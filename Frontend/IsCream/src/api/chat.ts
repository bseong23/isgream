import { connect } from "react-redux";
import { api } from "../utils/common/axiosInstance";

interface GetChatListResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        roomId: string;
        opponentName: string;
        newMessageCount: number;
        lastMessageTime: string;
        lastMessageUnread: string;
    }[]
}

interface CreateChatroomResponse {
    code: 'S0000' | "E4001";
    massage: string;
    data: {
        id: string;
        participantIds:[number, number];
        lastMessageTimestamp: string;
    }
}

interface DeleteChatroomRespone {
    code: 'S0000' | 'E4001';
    message: string;
}

interface openChatroomResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        id: string;
        roomId: string;
        sender: string;
        receiver: string;
        content: string;
        timestamp: string;
        read: boolean;
    }[]
}

// interface sendMessageProps {
//     messageId: string;
//     roomId: string;
//     sender: string;
    
// }

export const chatApi = {
    // 채팅방 목록 불러오기
    async getChatList(): Promise<GetChatListResponse> {
        try{
            const response = await api.get("/chatrooms");
            console.log("ChapPage.txs 여기까지 오니?");
            console.log("채팅방목록: ", response);
            if(response.data.code === 'S0000') {
                return response.data;
            }
            throw new Error(response.data.message || "채팅 목록 조회 실패");
        } catch (error) {
          console.error("채팅방 목록 조회 실패:", error);
          throw error;
        }
    },

    // 채팅방 생성하기
    async createChatroom(): Promise<CreateChatroomResponse>{
        try{
            const response = await api.post("/chatrooms/create");
            if(response.data.code === 'S0000'){
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
        try{
            const response = await api.delete(`/chatrooms/${roomId}/leave`);
            if(response.data.code === 'S0000'){
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
    async openChatroom(roomId: string, page: number): Promise<openChatroomResponse> {
        try{
            const response = await api.get(`/chat/${roomId}/message/${page}`);
            if(response.data.code === 'S0000'){
                return response.data;
            }
            throw new Error(response.data.massage || "채팅방 입장 실패");
        } catch (error) {
            console.log("채팅방 입장 실패", error);
            throw error;
        }
    },

    // // 메시지 보내기
    // async sendMessage(): Promise<> {

    // },

    // // 채팅방 입장시, 소켓 통신 연결
    // async connectChatroom(): Promise<> {

    // },

    // // 채팅방 입장시 연결 성공 직후후, 구독
    // async subscribeChatroom(): Promise<> {

    // }, 

    // // 채팅방 안에서, 메시지 읽음 처리
    // async ackMessage(): Promist<> {

    // }
}