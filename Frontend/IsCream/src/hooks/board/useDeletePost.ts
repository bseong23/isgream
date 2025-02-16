import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => boardApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.main() });
      queryClient.invalidateQueries({
        queryKey: boardKeys.list({
          lastId: null,
          lastLikeCount: null,
          size: 10,
          sort: "create",
          keyword: ""
        })
      });
    }
  });
};
