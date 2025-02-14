import { useNavigate, useLocation } from "react-router-dom";
import PostEdit from "../../components/board_crate_eidt/PostEdit";
import { Post } from "../../types/board";

const BoardEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post as Post;

  // 수정된 핸들러 타입
  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/posts/${post.postId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("업데이트 실패");
      navigate(`/board/${post.postId}`);
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <PostEdit post={post} onSubmit={handleSubmit} onCancel={handleCancel} />
  );
};

export default BoardEditPage;
