import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

const BoardCreateButton = () => {
  const navigate = useNavigate();

  const onClickCreatePost = () => {
    navigate("/board/write");
  };

  return (
    <button
      onClick={onClickCreatePost}
      className="fixed bottom-25 right-4 z-50 w-14 h-14 bg-[#009E28]
        rounded-full shadow-lg flex items-center 
        justify-center transition-transform hover:scale-105 
        active:scale-95"
      aria-label="글쓰기"
    >
      <Pencil size={24} className="text-white" />
    </button>
  );
};

export default BoardCreateButton;
