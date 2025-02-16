import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useBoardList } from "../../hooks/board/useBoardList";
import type { Post as APIPost } from "../../types/board";
import BoardFilter from "./BoardFilter";
import PostItem from "./PostItem";
import SearchBar from "../Search/SearchBar";
import Bear from "../../assets/image/챗봇_곰.png";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react"; // 새로고침 아이콘 추가

const BoardMain = () => {
  const [sort, setSort] = useState<"create" | "like">("create");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBoardList({
      lastId: null,
      lastLikeCount: null,
      size: 10,
      sort,
      keyword: searchQuery || ""
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const transformPost = (apiPost: APIPost) => {
    const formattedDate = new Date(apiPost.createdAt)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
      .replace(/\. /g, ".")
      .slice(0, -1);

    return {
      postId: apiPost.postId,
      title: apiPost.title,
      content: apiPost.content,
      thumbnail: apiPost.thumbnail || "",
      createdAt: formattedDate,
      authorName: apiPost.authorName,
      likes: apiPost.likes || 0,
      userLiked: apiPost.userLiked,
      hits: apiPost.viewCount || 0
    };
  };

  const handleFilter = (newSort: "create" | "like") => {
    setSort(newSort);
    queryClient.resetQueries({ queryKey: ["boardList"] });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    queryClient.resetQueries({ queryKey: ["boardList"] });
  };

  const handleRefresh = () => {
    setSearchQuery(""); // 검색어 초기화
    queryClient.resetQueries({ queryKey: ["boardList"] });
  };

  if (isLoading) {
    return (
      <div className="max-w-[706px] mx-auto bg-white p-4">
        <img src={Bear} alt="로딩 중" className="mx-auto" />
      </div>
    );
  }

  const hasNoResults =
    searchQuery && data?.pages[0]?.data?.data?.info?.length === 0;

  return (
    <div className="max-w-[706px] mx-auto bg-white">
      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="검색어를 입력해주세요"
        />
      </div>

      <div className="flex justify-end px-1 py-1">
        <BoardFilter
          text="최신순"
          active={sort === "create"}
          onClick={() => handleFilter("create")}
        />
        <BoardFilter
          text="좋아요"
          active={sort === "like"}
          onClick={() => handleFilter("like")}
        />
      </div>

      {hasNoResults ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">검색 결과를 찾을 수 없습니다.</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 cursor-pointer transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            새로고침
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {data?.pages.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.data?.data?.info?.map((apiPost) => (
                  <PostItem
                    key={apiPost.postId}
                    post={transformPost(apiPost)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div ref={ref} className="h-4" />
          {isFetchingNextPage && (
            <div className="p-4 text-center">
              <img src={Bear} alt="로딩 중..." className="mx-auto" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardMain;
