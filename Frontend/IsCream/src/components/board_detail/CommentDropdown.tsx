import { useRef, useEffect } from "react";
import { CommentDropdownProps } from "../../types/board";

const CommentDropdown = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onChat,
  isOpen,
  onToggle
}: CommentDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 안전한 방식으로 author 체크
  const isAuthor =
    comment?.author?.id && currentUserId === comment.author.id.toString();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // 댓글이나 작성자 정보가 없으면 null 반환
  if (!comment || !comment.author) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="댓글 메뉴"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm7 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm7 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
        </svg>
      </button>

      {/* 조건 없이 항상 렌더링 */}
      <div
        className={`absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10 ${
          isOpen ? "block" : "hidden"
        }`}
        role="menu"
      >
        {!isAuthor ? (
          <>
            <button
              onClick={() => {
                onEdit?.(comment.commentId, comment.content);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg transition-colors duration-200"
              role="menuitem"
            >
              수정하기
            </button>
            <button
              onClick={() => {
                onDelete?.(comment.commentId);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 rounded-b-lg transition-colors duration-200"
              role="menuitem"
            >
              삭제하기
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              onChat?.(comment.author.id);
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-lg transition-colors duration-200"
            role="menuitem"
          >
            채팅하기
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentDropdown;
