interface PostFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  encType?: string; // 파일 업로드를 위한 인코딩 타입
}

export const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  children,
  encType = "multipart/form-data" // 파일 업로드를 위한 기본값 설정
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 p-4 max-w-4xl mx-auto w-full"
      encType={encType}
    >
      {children}
    </form>
  );
};
