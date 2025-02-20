import girlImg from "../../assets/image/little_girl.png";
import boyImg from "../../assets/image/little_boy.png";
import editIcon from "../../assets/icons/edit-pen.png";
import cancelIcon from "../../assets/icons/cancle-default.png";
import { childApi } from "../../api/child";
import { useState } from "react";
import ChildeModal from "../../components/modal/ChildModal";
import { persistor } from "../../store";

interface ChildInfoProps {
  childId: number;
  childNickName: string;
  childGender: string;
  childBirth: string;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

const ChildInfo: React.FC<ChildInfoProps> = ({
  childId,
  childNickName,
  childGender,
  childBirth
  //   onUpdateSuccess,
  //   onDeleteSuccess
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(childNickName);
  const [gender, setGender] = useState(childGender);
  const [birth, setBirth] = useState(childBirth);

  const handleUpdate = async () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (childData: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }) => {
    try {
      console.log("수정 시도 데이터:", childData);

      const response = await childApi.updateChild(
        childId,
        childData.childNickname,
        childData.childGender === "남자아이" ? "M" : "F",
        childData.childBirth
      );

      console.log("수정 API 응답:", response);

      if (response) {
        setNickname(childData.childNickname);
        setGender(childData.childGender);
        setBirth(childData.childBirth);
        setIsModalOpen(false);

        await persistor.purge();
        window.location.reload();
      }
    } catch (error: any) {
      console.error("자녀 정보 수정 실패:", error);
      if (error.response) {
        console.error("서버 에러 응답:", error.response.data);
        console.error("서버 에러 상태:", error.response.status);
      }
      alert(`자녀 정보 수정에 실패했습니다. ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const isConfirmed = window.confirm("정말로 자녀를 삭제하시겠습니까?");
      if (!isConfirmed) return;

      console.log("자녀 삭제 시도");

      await childApi.deleteChild(childId);
      await persistor.purge();
      window.location.reload();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "자녀 삭제 중 오류가 발생했습니다.";

      console.error("자녀 삭제 실패:", error);
      alert(errorMessage);
    }
  };

  return (
    <>
      <div className="p-4 border border-gray-300 rounded-lg w-[160px]">
        <div className="flex justify-between mb-2">
          <div>
            {childGender === "여자아이" ? (
              <img src={girlImg} alt="여자아이 이미지" />
            ) : (
              <img src={boyImg} alt="남자아이 이미지" />
            )}
          </div>
          <div>
            <button onClick={handleUpdate}>
              <img src={editIcon} alt="수정" />
            </button>
            <button onClick={handleDelete}>
              <img src={cancelIcon} alt="삭제" />
            </button>
          </div>
        </div>
        <h3 className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
          이름: {nickname}
        </h3>
        <p className="text-gray-600">성별: {gender}</p>
        <p className="text-gray-600">생년월일: {birth}</p>
      </div>

      <ChildeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={{
          childNickname: childNickName,
          childGender: childGender,
          childBirth: childBirth
        }}
      />
    </>
  );
};

export default ChildInfo;
