import { useState } from "react";
import { Link } from "react-router-dom";
import { useMainPost } from "../../hooks/board/useMainPost";
import type { Post } from "@/types/board";

const MainPageBoard = () => {
  const [activeTab, setActiveTab] = useState<"latest" | "hot">("latest");
  const { data, isLoading, error } = useMainPost();

  const renderPosts = (posts: Post[]) => {
    return posts.map((post, index) => (
      <Link
        key={post.postId}
        to={`/board/detail/${post.postId}`}
        className="block no-underline"
      >
        <div className="flex items-center py-3 px-4 border-b-1 border-[#E6E6E6] hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-[#009E28] text-white rounded-full flex items-center justify-center mr-4">
            {index + 1}
          </div>
          <p className="text-gray-800 flex-1 truncate">{post.title}</p>
        </div>
      </Link>
    ));
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-4 text-center">게시글을 불러오는 중...</div>;
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-500">
          게시글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      );
    }

    if (!data?.data.data) {
      return <div className="p-4 text-center">게시글이 없습니다.</div>;
    }

    const posts =
      activeTab === "latest" ? data.data.data.latest : data.data.data.hot;
    return renderPosts(posts.slice(0, 5));
  };

  return (
    <div className="w-full bg-white mt-4">
      <div className="mx-auto max-w-[706px] relative">
        <div className="relative">
          {/* 탭 버튼 영역 */}
          <div className="relative top-0 flex">
            <button
              className={`px-8 py-3 ${
                activeTab === "latest"
                  ? "bg-white rounded-t-[25px] border border-[#E6E6E6] border-b-0"
                  : "bg-[#F9F9F9] rounded-t-[25px] border border-[#E6E6E6] cursor-pointer hover:bg-[#E6E6E6]"
              }`}
              onClick={() => setActiveTab("latest")}
            >
              최신글
            </button>
            <button
              className={`px-8 py-3 ${
                activeTab === "hot"
                  ? "bg-white rounded-t-[25px] border border-[#E6E6E6] border-b-0"
                  : "bg-[#F9F9F9] rounded-t-[25px] border border-[#E6E6E6] cursor-pointer hover:bg-[#E6E6E6]"
              }`}
              onClick={() => setActiveTab("hot")}
            >
              인기글
            </button>
          </div>

          {/* 게시글 목록 영역 */}
          <div className="border border-[#E6E6E6] bg-white -mt-[1px] rounded-b-[25px] rounded-r-[25px]">
            <div className="p-4">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageBoard;
