import { useQuery } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const usePostDetail = (postId: number) => {
  return useQuery({
    queryKey: boardKeys.detail(postId),
    queryFn: () => boardApi.getPostDetail(postId)
  });
};
