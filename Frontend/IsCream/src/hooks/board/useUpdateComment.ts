import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content
    }: {
      commentId: number;
      content: string;
    }) => boardApi.updateComment(commentId, content),
    onSuccess: () => {
      // 댓글이 속한 게시글의 모든 댓글을 갱신
      // Note: 실제로는 optimistic update를 사용하는 것이 더 좋을 수 있습니다
      queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        predicate: (query) => query.queryKey[1] === "comments"
      });
    }
  });
};
