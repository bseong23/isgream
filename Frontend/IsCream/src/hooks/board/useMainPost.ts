import { useQuery } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";

export const useMainPost = () => {
  return useQuery({
    queryKey: boardKeys.main(),
    queryFn: () => boardApi.getMainPosts()
  });
};
