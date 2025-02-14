interface DetailActionsProps {
  onLike: () => void;
  onCommentClick: () => void;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}

const DetailActions: React.FC<DetailActionsProps> = ({
  onLike,
  onCommentClick,
  isLiked,
  likeCount,
  commentCount
}) => {
  return (
    <div className="flex items-center border-b border-[#BEBEBE] space-x-4 px-4 py-3 mb-3">
      <button
        onClick={onLike}
        className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-600"}`}
      >
        <svg
          className="w-6 h-6"
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{likeCount} 좋아요</span>
      </button>

      <button
        onClick={onCommentClick}
        className="flex items-center space-x-1 text-gray-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>{commentCount} 댓글</span>
      </button>
    </div>
  );
};

export default DetailActions;
