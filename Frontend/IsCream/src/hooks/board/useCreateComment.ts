import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";
import { CommentRequest, ApiResponse } from "../../types/board";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, CommentRequest>({
    mutationFn: async (data: CommentRequest) => {
      const response = await boardApi.createComment(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.comments(variables.postId)
      });
    }
  });
};
