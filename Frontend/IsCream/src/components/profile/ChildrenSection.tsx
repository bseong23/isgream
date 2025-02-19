import ChildInfo from "../child/ChildInfo";
import { childApi } from "../../api/child";
import { Child } from "../../types/child";
import { useState, useEffect, useCallback } from "react";
import ChildeModal from "../modal/ChildModal";

interface ChildrenSectionProps {
  children: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }[];
  onAddChild: () => void;
  onUpdateChild: (index: number) => void;
  onDeleteChild: (index: number) => void;
}

const ChildrenSection: React.FC<ChildrenSectionProps> = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchChildren = useCallback(async () => {
    try {
      console.log();
      console.log("try문에 들어가기는 해");
      const children = await childApi.getChildren();
      console.log("ChildrenSection 조회 잘돼!!", children);

      setChildren(children);
    } catch (error) {
      console.error("자녀 정보 조회 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handleOpenAddChildModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddChild = async (childData: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }) => {
    try {
      await childApi.addChild({
        nickname: childData.childNickname,
        gender: childData.childGender === "남자아이" ? "M" : "F",
        birthDate: childData.childBirth
      });

      setIsAddModalOpen(false);

      fetchChildren();
    } catch (error) {
      console.error("자녀 추가 실패: ", error);
      alert("자녀 추가에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div className="flex justify-between">
          <div className="m-3 text-xl">자녀 정보</div>
          <div className="m-3 text-xl">
            {children.length < 2 && (
              <button onClick={handleOpenAddChildModal}>+</button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {children.map((child, index) => (
              <div key={index} className="m-2">
                <ChildInfo
                  key={index}
                  childId={child.childId}
                  childNickName={child.nickname}
                  childGender={child.gender === "M" ? "남자아이" : "여자아이"}
                  childBirth={child.birthDate}
                  onUpdateSuccess={fetchChildren}
                  onDeleteSuccess={fetchChildren}
                />
              </div>
            ))}
          </div>
        </div>
        {/* 자녀 추가 모달 */}
        {isAddModalOpen && (
          <ChildeModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddChild}
            initialData={{
              childNickname: "",
              childGender: "",
              childBirth: ""
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChildrenSection;
