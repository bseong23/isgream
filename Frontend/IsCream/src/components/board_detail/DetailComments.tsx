import { useState } from "react";
import type { Comment, CommentRequest } from "../../types/board";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface DetailCommentsProps {
  postId: number;
  comments: Comment[];
  onSubmit: (commentData: CommentRequest) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  isCommentFormVisible: boolean;
  isAuthenticated: boolean;
  currentUserId?: string;
  userImageUrl?: string;
}

const DetailComments = ({
  postId,
  comments,
  onSubmit,
  onEdit,
  onDelete,
  isCommentFormVisible,
  isAuthenticated,
  currentUserId,
  userImageUrl
}: DetailCommentsProps) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const handleSubmit = (content: string, parentId?: number | null) => {
    if (!isAuthenticated || !content.trim()) return;

    const commentData: CommentRequest = {
      postId,
      commentId: parentId || null,
      content: content.trim()
    };

    onSubmit(commentData);
    setReplyingTo(null);
  };

  const getChildComments = (parentCommentId: number) =>
    comments.filter((comment) => comment.parentId === parentCommentId);

  const handleToggleReplies = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const mainComments = comments.filter((comment) => comment.parentId === null);

  return (
    <div className="pb-20">
      <div className="px-4 space-y-4">
        {mainComments.map((comment) => {
          const replies = getChildComments(comment.commentId);
          const isExpanded = expandedComments.includes(comment.commentId);

          return (
            <div key={comment.commentId}>
              {editingCommentId === comment.commentId ? (
                <CommentForm
                  onSubmit={(content) => onEdit(comment.commentId, content)}
                  onCancel={() => setEditingCommentId(null)}
                  initialContent={comment.content}
                  isEditing={true}
                  placeholder="댓글을 수정하세요"
                  userImageUrl={userImageUrl}
                />
              ) : (
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserId}
                  onEdit={() => setEditingCommentId(comment.commentId)}
                  onDelete={onDelete}
                  onReply={() => setReplyingTo(comment.commentId)}
                  onToggleReplies={
                    replies.length > 0
                      ? () => handleToggleReplies(comment.commentId)
                      : undefined
                  }
                  repliesCount={replies.length}
                  isRepliesExpanded={isExpanded}
                />
              )}

              {isExpanded && replies.length > 0 && (
                <div className="space-y-4">
                  {replies.map((reply) =>
                    editingCommentId === reply.commentId ? (
                      <CommentForm
                        key={reply.commentId}
                        onSubmit={(content) => onEdit(reply.commentId, content)}
                        onCancel={() => setEditingCommentId(null)}
                        initialContent={reply.content}
                        isEditing={true}
                        placeholder="답글을 수정하세요"
                        userImageUrl={userImageUrl}
                      />
                    ) : (
                      <CommentItem
                        key={reply.commentId}
                        comment={reply}
                        currentUserId={currentUserId}
                        onEdit={() => setEditingCommentId(reply.commentId)}
                        onDelete={onDelete}
                        isReply
                      />
                    )
                  )}
                </div>
              )}

              {replyingTo === comment.commentId && (
                <CommentForm
                  onSubmit={handleSubmit}
                  parentId={comment.commentId}
                  placeholder="답글을 입력하세요"
                  onCancel={() => setReplyingTo(null)}
                  userImageUrl={userImageUrl}
                />
              )}
            </div>
          );
        })}
      </div>

      {isCommentFormVisible && (
        <CommentForm
          onSubmit={handleSubmit}
          placeholder="댓글을 입력하세요"
          userImageUrl={userImageUrl}
        />
      )}
    </div>
  );
};

export default DetailComments;
