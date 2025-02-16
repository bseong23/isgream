import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PostForm } from "./PostForm";
import { TitleInput } from "./TitleInput";
import { ContentTextarea } from "./ContentTextarea";
import { ImageUpload } from "./ImageUpload";
import LongButton from "../button/LongButton";
import Alert from "./Alert";
import type { PostDetail } from "../../types/board";
import { useUpdatePost } from "../../hooks/board/useUpdatePost";

interface PostEditProps {
  post: PostDetail;
  onSubmit?: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

const MAX_CONTENT_LENGTH = 1000;

const PostEdit: React.FC<PostEditProps> = ({ post }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(post.title);
  const [content, setContent] = useState<string>(post.content);
  const [images, setImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const updatePost = useUpdatePost();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setAlert({ message: "제목을 입력해 주세요.", type: "error" });
      return;
    }

    if (!content.trim()) {
      setAlert({ message: "내용을 입력해 주세요.", type: "error" });
      return;
    }

    console.log("삭제할 이미지들:", deletedImages);
    console.log("새로 추가할 이미지들:", images);

    // 디버깅용 URL 파싱 로직 추가
    deletedImages.forEach((imageUrl) => {
      console.log("삭제 요청된 이미지 URL 전체:", imageUrl);
      console.log("URL 파싱 테스트:", {
        bucket: "a407-20250124",
        region: "ap-northeast-2",
        key: imageUrl.split("/images/")[1]
      });
    });

    try {
      const result = await updatePost.mutateAsync({
        postId: post.postId,
        data: {
          post: {
            title: title.trim(),
            content: content.trim(),
            deleteFiles: deletedImages
          },
          files: images.length > 0 ? images : undefined
        }
      });

      console.log("API 응답:", result);

      navigate(`/board/detail/${post.postId}`);
    } catch (error) {
      console.error("상세 에러:", error);
      setAlert({
        message: "게시글 수정 중 문제가 발생했습니다. 다시 시도해 주세요.",
        type: "error"
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CONTENT_LENGTH) {
      setContent(newContent);
    } else {
      setAlert({
        message: `최대 ${MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`,
        type: "error"
      });
    }
  };

  const handleExistingImageDelete = (imageUrl: string) => {
    console.log("이미지 삭제됨:", imageUrl);

    // 디버깅용 URL 파싱 로직 추가
    console.log("삭제 요청된 이미지 URL 전체:", imageUrl);
    console.log("URL 파싱 테스트:", {
      bucket: "a407-20250124",
      region: "ap-northeast-2",
      key: imageUrl.split("/images/")[1]
    });

    setDeletedImages((prev) => {
      const updated = [...prev, imageUrl];
      console.log("현재 삭제된 이미지 목록:", updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col bg-white">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto py-10">
          <PostForm onSubmit={handleSubmit}>
            <TitleInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="min-h-[300px] md:min-h-[400px]">
              <ContentTextarea
                value={content}
                onChange={handleContentChange}
                maxLength={MAX_CONTENT_LENGTH}
              />
            </div>
            <div className="mt-4">
              <ImageUpload
                onImagesChange={setImages}
                initialImages={post.images || []}
                onExistingImageDelete={handleExistingImageDelete}
              />
            </div>
            <div className="sticky bottom-0 w-full bg-white py-4 px-4 md:px-6 lg:px-8">
              <div className="w-full max-w-3xl mx-auto flex gap-4">
                <LongButton
                  type="button"
                  onClick={() => navigate(`/board/detail/${post.postId}`)}
                  className="flex-1 bg-red-600"
                >
                  취소
                </LongButton>
                <LongButton
                  type="submit"
                  disabled={
                    updatePost.isPending || !title.trim() || !content.trim()
                  }
                  className="flex-1"
                >
                  {updatePost.isPending ? "수정 중..." : "수정하기"}
                </LongButton>
              </div>
            </div>
          </PostForm>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
