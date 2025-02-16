import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => boardApi.deleteComment(commentId),
    onSuccess: () => {
      // 모든 댓글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        predicate: (query) => query.queryKey[1] === "comments"
      });
    }
  });
};
