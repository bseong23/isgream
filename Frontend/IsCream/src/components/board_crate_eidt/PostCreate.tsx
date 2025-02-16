import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "../../hooks/board/useCreatePost";
import { PostForm } from "./PostForm";
import { TitleInput } from "./TitleInput";
import { ContentTextarea } from "./ContentTextarea";
import { ImageUpload } from "./ImageUpload";
import LongButton from "../button/LongButton";
import Alert from "./Alert";
import type { CreatePostRequest } from "@/types/board";

const MAX_CONTENT_LENGTH = 1000;

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const createPost = useCreatePost();

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

    const postData: CreatePostRequest = {
      post: {
        title: title.trim(),
        content: content.trim()
      },
      files: images.length > 0 ? images : undefined
    };

    try {
      const response = await createPost.mutateAsync(postData);
      if (response.data?.data) {
        // postId 체크 부분 수정
        setAlert({ message: "게시글이 작성되었습니다.", type: "success" });
        navigate(`/board/detail/${response.data.data}`); // 직접 data 값 사용
      }
    } catch {
      setAlert({
        message: "게시글 작성 중 문제가 발생했습니다. 다시 시도해 주세요.",
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

  return (
    <div className="flex flex-col bg-white">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <PostForm onSubmit={handleSubmit}>
        <div className="px-4 md:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto py-10">
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
              <ImageUpload onImagesChange={setImages} initialImages={[]} />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 w-full bg-white py-4 px-4 md:px-6 lg:px-8">
          <div className="w-full max-w-3xl mx-auto">
            <LongButton
              type="submit"
              disabled={
                createPost.isPending || !title.trim() || !content.trim()
              }
            >
              {createPost.isPending ? "작성 중..." : "작성하기"}
            </LongButton>
          </div>
        </div>
      </PostForm>
    </div>
  );
};

export default PostCreate;
