import { useState, useEffect } from "react";
// import { childApi } from "../../api/child";

interface ChildeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (childData: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }) => void;
  initialData?: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  };
}

const ChildeModal: React.FC<ChildeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [childData, setChildData] = useState({
    childNickname: "",
    childGender: "",
    childBirth: ""
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen && initialData) {
      setChildData(initialData);
    } else if (isOpen) {
      setChildData({
        childNickname: "",
        childGender: "",
        childBirth: ""
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(childData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 z-50 relative">
          <h2 className="text-xl font-bold mb-4">자녀 정보 입력</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">이름</label>
              <input
                type="text"
                value={childData.childNickname}
                onChange={(e) =>
                  setChildData({ ...childData, childNickname: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">성별</label>
              <select
                value={childData.childGender}
                onChange={(e) =>
                  setChildData({ ...childData, childGender: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">선택하세요</option>
                <option value="남자아이">남자아이</option>
                <option value="여자아이">여자아이</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">생년월일</label>
              <input
                type="date"
                value={childData.childBirth}
                max={today}
                onChange={(e) =>
                  setChildData({ ...childData, childBirth: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChildeModal;
