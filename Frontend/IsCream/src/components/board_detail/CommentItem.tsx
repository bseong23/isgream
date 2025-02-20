import { useState } from "react";
import type { CommentItemProps } from "../../types/board";
import CommentDropdown from "./CommentDropdown";
import defaultImage from "../../assets/image/챗봇_곰.png";

const CommentItem = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onChat,
  onReply,
  onToggleReplies,
  repliesCount = 0,
  isRepliesExpanded,
  children,
  isReply = false,
  isEditing = false
}: CommentItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEditSubmit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.commentId, editContent.trim());
    }
  };

  if (isEditing) {
    return (
      <div className={`${isReply ? "ml-8" : ""}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit();
          }}
        >
          <div className="flex items-center space-x-2 max-w-4xl mx-auto px-2 mt-1">
            <div className="w-10 h-10 bg-gray-50 rounded-full overflow-hidden">
              <img
                src={comment.author.imageUrl ?? defaultImage}
                alt={comment.author.nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
            </div>
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="댓글 수정"
              className="flex-1 px-4 py-2 border border-[#BEBEBE] rounded-full focus:outline-none focus:ring-1 focus:ring-green-600"
              autoFocus
            />
            <button
              type="submit"
              disabled={
                !editContent.trim() || editContent.trim() === comment.content
              }
              className={`
    px-3 
    py-1 
    text-sm 
    rounded-[15px] 
    ${
      editContent.trim()
        ? "bg-green-600 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
    min-w-[60px] 
    flex 
    items-center 
    justify-center
  `}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(comment.commentId, comment.content)}
              className="
    text-sm 
    text-gray-500 
    hover:text-gray-700 
    py-1 
    px-2 
    min-w-[60px] 
    flex 
    items-center 
    justify-center
  "
            >
              취소
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`${isReply ? "pl-4 mt-4" : ""}`}>
      <div className="flex items-center justify-between group">
        <div className="flex items-center flex-1 ">
          <div className="w-10 h-10 bg-gray-50 rounded-full mr-2 overflow-hidden flex-shrink-0">
            <img
              src={comment.author.imageUrl ?? defaultImage}
              alt={comment.author.nickname}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultImage;
              }}
            />
          </div>
          <div className="ml-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {comment.author.nickname}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-800 mt-1 break-words">{comment.content}</p>
            <div className="flex items-center space-x-4 mt-2">
              {!isReply && onReply && (
                <button
                  type="button"
                  onClick={onReply}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  답글달기
                </button>
              )}
              {!isReply && repliesCount > 0 && onToggleReplies && (
                <button
                  type="button"
                  onClick={onToggleReplies}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {isRepliesExpanded ? "답글 숨기기" : `답글 ${repliesCount}개`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <CommentDropdown
            comment={comment}
            currentUserId={currentUserId}
            onEdit={() => onEdit?.(comment.commentId, comment.content)}
            onDelete={() => onDelete?.(comment.commentId)}
            onChat={() => onChat?.(comment.author.id)}
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>
      </div>

      {!isReply && children && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-[#BEBEBE]">
          {children}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
