import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? boardApi.unlikePost(postId) : boardApi.likePost(postId),
    onSuccess: (response) => {
      if (response.data.code === "S0000") {
        // 게시글 상세 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: boardKeys.detail(postId)
        });
        // 게시글 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: boardKeys.lists()
        });
      }
    }
  });
};
