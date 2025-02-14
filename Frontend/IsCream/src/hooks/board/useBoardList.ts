import { useInfiniteQuery } from "@tanstack/react-query";
import { boardApi, boardKeys } from "../../api/board";
import type { BoardListRequest } from "../../types/board";

export const useBoardList = (initialParams: BoardListRequest) => {
  return useInfiniteQuery({
    queryKey: boardKeys.list(initialParams),
    queryFn: ({ pageParam = initialParams }) =>
      boardApi.getBoardList(pageParam),
    initialPageParam: initialParams,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.data?.hasNext) return undefined;
      return {
        ...initialParams,
        lastId: lastPage.data.data.lastId,
        lastLikeCount: lastPage.data.data.lastLikeCount
      };
    }
  });
};
