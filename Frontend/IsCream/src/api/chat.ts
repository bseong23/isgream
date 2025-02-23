import { api } from "../utils/common/axiosInstance";
import { Client } from "@stomp/stompjs";

interface GetChatListResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    roomId: string;
    opponentName: string;
    newMessageCount: number;
    lastMessageTime: string;
    lastMessageUnread: string;
    receiver: string;
  }[];
}

interface CreateChatroomResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    id: string;
    participantIds: [number, number];
    lastMessageTimestamp: string;
  };
}

interface DeleteChatroomRespone {
  code: "S0000" | "E4001";
  message: string;
}

interface openChatroomResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    id: string;
    roomId: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
    read: boolean;
  }[];
}

let stompClient: Client | null = null;
let currentSubscription: any = null;

export const chatApi = {
  // 채팅방 목록 불러오기

  async getChatList(): Promise<GetChatListResponse> {
    try {
      const response = await api.get("/chatrooms");
      console.log("chat.ts 채팅방목록: ", response);
      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "채팅 목록 조회 실패");
    } catch (error) {
      console.error("채팅방 목록 조회 실패:", error);
      throw error;
    }
  },

  // 채팅방 생성하기
  async createChatroom(receiverId: string): Promise<CreateChatroomResponse> {
    try {
    //   console.log("chat.ts 상대방 id: ", receiverId);
      
      const response = await api.post(
        `/chatrooms/create?receiverId=${receiverId}`
      );

    //   console.log("chat.ts 응답: ", response);
      
      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "채팅방 생성 실패");
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      throw error;
    }
  },

  // 채팅 나가기
  async deleteChatroom(roomId: string): Promise<DeleteChatroomRespone> {
    try {
      const response = await api.delete(`/chatrooms/${roomId}/leave`);
      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "채팅방 삭제 실패");
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
      throw error;
    }
  },

  //-----------------------------------------------
  // 채팅방 입장하기
  async openChatroom(
    roomId: string,
    page: number
  ): Promise<openChatroomResponse> {
    try {
      const response = await api.get(`/chat/${roomId}/messages?page=${page}`);
      if (response.data.code === "S0000") {
        // console.log("채팅방 입장 성공");
        return response.data;
      }
      throw new Error(response.data.massage || "채팅방 입장 실패");
    } catch (error) {
      console.log("채팅방 입장 실패", error);
      throw error;
    }
  },

  // 채팅방 입장시, 소켓 통신 연결
  async connectChatroom(roomId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (stompClient?.connected) {
          // 이미 연결되어 있으면 바로 resolve
          resolve();
          return;
        }

        stompClient = new Client({
          brokerURL: "https://i12a407.p.ssafy.io/api/ws",
          // brokerURL: 'ws://localhost:8080/ws',
          connectHeaders: {
            roomId: roomId,
            Authorization: `Bearer ${token}`,
            "accept-version": "1.1,1.0"
          },

          // heartbeat 비활성화
          heartbeatIncoming: 0,
          heartbeatOutgoing: 0,

          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: 0,  // 자동 재연결 비활성화
          maxWebSocketChunkSize: 8 * 1024,  // 청크 사이즈 제한
          forceBinaryWSFrames: true,  // 바이너리 프레임 강제

          onConnect: () => {
            console.log("웹소켓 연결 성공");
            resolve();
          },
          onDisconnect: () => {
            console.log("웹소켓 연결 해제");
            // disconnect  시에도 cleanup
            stompClient = null;
            currentSubscription = null;
          },
          onStompError: (frame) => {
            console.error("Stomp 에러:", frame);
            reject(new Error("STOMP 연결 실패"));
          }
        });

        // 활성화 전에 연결이 완료되길 기다림
        // stompClient.onConnect = () => {
        //   console.log("연결 완료");
        //   setTimeout(() => {
        //     resolve();
        //   }, 500); // 연결 후 약간의 지연 추가
        // };
        stompClient.activate();
      } catch (error) {
        reject(error);
      }
    });
  },


  // 웹소켓 연결 해제
  async disconnectChatroom(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (stompClient) {
          // 모든 구독 해제
          if (currentSubscription) {
            currentSubscription.unsubscribe();
            currentSubscription = null;
          }
          
          // 연결 종료 전에 heartbeat 비활성화
          stompClient.heartbeatIncoming = 0;
          stompClient.heartbeatOutgoing = 0;

          // 즉시 연결 종료
          stompClient.deactivate();

          // 강제로 연결 종료
          stompClient.forceDisconnect();
          
          // cleanup
          stompClient.deactivate();
          stompClient = null;
          currentSubscription = null;
          
          console.log('웹소켓 연결 완전히 종료됨');
        }
        resolve();
      } catch (error) {
        console.error('웹소켓 연결 해제 중 오류:', error);
        resolve(); // 에러가 발생해도 Promise는 resolve
      }
    });
  },

  // 메시지 보내기
  async sendMessage(
    roomId: string,
    sender: string,
    receiver: string,
    content: string
  ): Promise<any> {
    if (!stompClient) {
      throw new Error("웹소켓이 연결되지 않았습니다.");
    }

    return new Promise((resolve, reject) => {
      try {
        const messageData = {
          roomId,
          sender,
          receiver,
          content
        };
        console.log("Sending message:", messageData);

        if (stompClient === null) {
          console.log("stomp문제ㅜㅜ");

          return;
        }

        stompClient.publish({
          destination: "/pub/chat/send",
          body: JSON.stringify(messageData),
          headers: { "content-type": "application/json" }
        });

        if (stompClient === null) return;

        // 서버 응답을 기다림
        const subscription = stompClient.subscribe(
          `/sub/chat/room/${roomId}`,
          (message) => {
            const responseData = JSON.parse(message.body);
            subscription.unsubscribe(); // 응답을 받은 후 구독 해제
            resolve(responseData);
            console.log("백엔드 응답데이터: ", responseData);
          }
        );
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        reject(error);
      }
    });
  },

  // 채팅방 입장시 연결 성공 직후, 구독
  async subscribeChatroom(
    roomId: string,
    onMessageReceived: (message: any) => void
  ): Promise<() => void> {
    if (!stompClient) {
      throw new Error("웹소켓이 연결되지 않았습니다.");
    }

    try {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }

      currentSubscription = stompClient.subscribe(
        `/sub/chat/room/${roomId}`,
        (message) => {
          console.log("새로운 메시지 수신:", message);
          try {
            const receivedMessage = JSON.parse(message.body);
            onMessageReceived(receivedMessage);
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
            console.log("원본 메시지:", message.body);
          }
        }
      );

      return () => {
        if (currentSubscription) {
          currentSubscription.unsubscribe();
          currentSubscription = null;
        }
      };
    } catch (error) {
      console.error("채팅방 구독 실패:", error);
      throw error;
    }
  },

  // // 채팅방 안에서, 메시지 읽음 처리
  // 메시지 전송을 위한 별도의 일회성 구독 ID 관리
  _tempSubscriptionId: 0,
  async messageRead(
    messageId: string,
    readerId: string,
    roomId: string
  ): Promise<any> {
    if (!stompClient) {
      throw new Error("웹소켓이 연결되지 않았습니다.");
    }

    return new Promise((resolve, reject) => {
      try {
        const messageData = {
          messageId,
          readerId,
          type: "ACK"
        };
        console.log("sending read message: ", messageData);

        // 읽음 처리를 위한 별도의 일회성 구독
        const tempSubId = `temp-ack-${this._tempSubscriptionId++}`;
        if (!stompClient) return;
        const tempSubscription = stompClient.subscribe(
          `/sub/chat/room/${roomId}`,
          (message) => {
            try {
              const responseData = JSON.parse(message.body);

              if (responseData.timestamp) {
                responseData.timestamp = new Date(responseData.timestamp);
              }

              tempSubscription.unsubscribe(); // 일회성 구독만 해제
              resolve(responseData);
              console.log("읽음 처리 응답 데이터: ", responseData);
            } catch (parseError) {
              tempSubscription.unsubscribe();
              reject(parseError);
            }
          },
          { id: tempSubId }
        );

        // 읽음 처리 메시지 발행
        stompClient.publish({
          destination: "/pub/chat/ack",
          body: JSON.stringify(messageData),
          headers: { "content-type": "application/json" }
        });
      } catch (error) {
        console.log("읽음 처리 실패: ", error);
        reject(error);
      }
    });
  }
  //         stompClient?.publish({
  //           destination: "/pub/chat/ack",
  //           body: JSON.stringify(messageData),
  //           headers: { "content-type": "application/json" }
  //         });

  //         // 서버 응답을 기다림
  //         const subscription = stompClient?.subscribe(
  //           `/sub/chat/room/${roomId}`,
  //           (message) => {
  //             try{
  //                 const responseData = JSON.parse(message.body);

  //                 // 타임스탬프 파싱 시 안전한 방법 사용
  //                 if (responseData.timestamp) {
  //                     responseData.timestamp = new Date(responseData.timestamp);
  //                 }

  //                 subscription?.unsubscribe(); // 응답을 받은 후 구독 해제
  //                 resolve(responseData);
  //                 console.log("백엔드 응답 데이터: ", responseData);
  //             } catch (parseError) {
  //                 console.error("메시지 파싱 중 오류: ", parseError);
  //                 console.log("원본 메시지 본문: ", message.body);
  //                 reject(parseError);
  //             }
  //           }
  //         );

  //       } catch (error) {
  //         console.log("메세지 전송 실패: ", error);
  //         reject(error);
  //       }
  //     });
  //   }
};