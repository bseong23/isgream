import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";
import type { CreatePostRequest } from "../../types/board";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => boardApi.createPost(data),
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
