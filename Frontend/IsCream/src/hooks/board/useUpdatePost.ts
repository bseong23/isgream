import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";
import { UpdatePostRequest } from "../../types/board";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data
    }: {
      postId: number;
      data: UpdatePostRequest;
    }) => boardApi.updatePost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.main() });
    }
  });
};
