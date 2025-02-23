import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailContent from "../../components/board_detail/DetailContent";
import DetailActions from "../../components/board_detail/DetailAction";
import DetailComments from "../../components/board_detail/DetailComments";
import { useAuth } from "../../hooks/useAuth";
import { usePostDetail } from "../../hooks/board/usePostDetail";
import { useComments } from "../../hooks/board/useComments";
import { useDeletePost } from "../../hooks/board/useDeletePost";
import { useLikePost } from "../../hooks/board/useLikePost";
import { useCreateComment } from "../../hooks/board/useCreateComment";
import { useDeleteComment } from "../../hooks/board/useDeleteComment";
import { useUpdateComment } from "../../hooks/board/useUpdateComment";
import type { PostDetail, CommentRequest } from "../../types/board";
import Bear from "../../assets/image/챗봇_곰.png";
// import { AxiosError } from "axios";

const BoardDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data: postData, isLoading } = usePostDetail(Number(postId));
  const { data: commentsData } = useComments(Number(postId));
  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost(Number(postId));
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  console.log("댓글정보: ",commentsData);
  
  // console.log("작가아이디 있는지 확인 ", postData);
  
  const [isCommentFormVisible, setIsCommentFormVisible] =
    useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!postId) return;

    const confirmDelete = window.confirm(
      "정말로 이 게시글을 삭제하시겠습니까?"
    );
    if (!confirmDelete) return;

    // 백엔드로 삭제 요청 보내기
    deletePostMutation.mutate(Number(postId), {
      onSuccess: () => {
        alert("게시글이 삭제되었습니다.");
        navigate("/board");
      },
      onError: (error) => {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const isCurrentlyLiked = postData?.data?.data?.userLiked;

    likePostMutation.mutate(!!isCurrentlyLiked, {
      onError: (error) => {
        console.error("좋아요 처리 중 오류 발생:", error);
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
    });
  };

  const handleCommentSubmit = (commentData: CommentRequest) => {
    if (!isAuthenticated) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    console.log(commentData);

    // commentData를 그대로 사용 (추가 변환 없이)
    createCommentMutation.mutate(commentData, {
      onError: () => {
        // console.log(error.respones);
        const errorMessage = "댓글 작성에 실패했습니다.";
        alert(errorMessage);
      }
    });
  };

  const handleCommentEdit = (commentId: number, content: string) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    updateCommentMutation.mutate(
      { commentId, content },
      {
        onError: (error) => {
          console.error("댓글 수정 중 오류 발생:", error);
          alert("댓글 수정에 실패했습니다.");
        }
      }
    );
  };

  const handleCommentDelete = (commentId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    deleteCommentMutation.mutate(commentId, {
      onError: (error) => {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-[706px] mx-auto bg-white p-4">
        <img src={Bear} alt="로딩 중" className="mx-auto" />
      </div>
    );
  }

  if (!postData?.data?.data) {
    return (
      <div className="max-w-[706px] mx-auto bg-white p-4">
        <p className="text-center text-gray-500">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const post: PostDetail = postData.data.data;
  const comments = commentsData?.data?.data?.comments || [];
  const commentCount = commentsData?.data?.data?.totalCount || 0;

  return (
    <div className="max-w-[706px] mx-auto">
      <div className="flex flex-col bg-white">
        <DetailContent
          post={post}
          onDelete={handleDelete} // 삭제 버튼 핸들러
          onChat={(userId) => console.log("Chat with:", userId)}
        />
        <DetailActions
          onLike={handleLike}
          onCommentClick={() => setIsCommentFormVisible(!isCommentFormVisible)}
          isLiked={post.userLiked}
          likeCount={post.likes}
          commentCount={commentCount}
        />
        <DetailComments
          postId={Number(postId)}
          comments={comments}
          onSubmit={handleCommentSubmit}
          onEdit={handleCommentEdit}
          onDelete={handleCommentDelete}
          isCommentFormVisible={isCommentFormVisible}
          isAuthenticated={isAuthenticated}
          currentUserId={user?.id}
          userImageUrl={post.userImageUrl} // 추가
        />
      </div>
    </div>
  );
};

export default BoardDetailPage;
