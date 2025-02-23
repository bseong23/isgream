import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../api/chat";

export const useChatComment = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (userId: string ) => chatApi.createChatroom(userId),
        
        onSuccess: (data) => {
          const chatRoomId = data.data.id;
          navigate(`/chat/room/${chatRoomId}`);
        }
      });
    };

