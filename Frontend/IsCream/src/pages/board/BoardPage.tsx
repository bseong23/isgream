import BoardMain from "../../components/board/BoardMain";
import PostCreatButton from "../../components/board/PostCreateButton";

const BoardPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <BoardMain />
      </div>
      <div className="fixed bottom-4 right-4">
        <PostCreatButton />
      </div>
    </div>
  );
};

export default BoardPage;
