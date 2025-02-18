import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PostItemProps } from "@/types/board";
import DefaultThumbnail from "../../assets/icons/login_logo.png";

const PostItem = ({ post }: PostItemProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const {
    postId,
    title,
    content,
    thumbnail,
    createdAt,
    authorName,
    likes,
    userLiked
  } = post;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleClick = () => {
    navigate(`/board/detail/${postId}`);
  };

  return (
    <div
      className="py-3 px-1 cursor-pointer transition-colors duration-200 border-t border-[#BEBEBE] hover:bg-gray-50 active:bg-gray-100"
      onClick={handleClick}
    >
      <div className="flex gap-4 items-center flex-1">
        <div className="flex flex-col gap-3 flex-1">
          <h3
            className={`font-medium text-gray-900 truncate ${
              isMobile ? "text-xl" : "text-2xl"
            }`}
          >
            {title}
          </h3>
          <div className="min-w-0">
            <p
              className={`text-gray-600 ${isMobile ? "text-base" : "text-lg"}`}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word"
              }}
            >
              {content}
            </p>
          </div>
          <div
            className={`flex items-center ${
              isMobile ? "text-xs" : "text-sm"
            } text-gray-400`}
          >
            <div className="flex items-center gap-2 text-gray-500">
              <div className="flex items-center">
                <Heart
                  size={isMobile ? 16 : 20}
                  className={`${
                    userLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                  } ${isMobile ? "mr-1.5" : "mr-3"}`}
                />
                <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
                  {likes.toString()} {/* 숫자만 깔끔하게 표시 */}
                </span>
              </div>
            </div>
            <div className="w-45">
              <span className="mx-3"> | </span>
              <span>{createdAt}</span>
              <span className="mx-3"> | </span>
              <span>{authorName}</span>
            </div>
          </div>
        </div>
        {thumbnail && (
          <div
            className={`flex items-center justify-center ${
              isMobile ? "w-24 h-24" : "w-30 h-30"
            }`}
          >
            <img
              src={thumbnail}
              alt="게시글 썸네일"
              className="w-full h-full object-cover rounded-[15px]"
              onError={(e) => {
                e.currentTarget.src = DefaultThumbnail;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
