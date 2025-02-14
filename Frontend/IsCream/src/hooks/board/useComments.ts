import { useQuery } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: boardKeys.comments(postId),
    queryFn: () => boardApi.getComments(postId)
  });
};
