import { useState } from "react";

interface CounselingCardProps {
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  moveToLocation: (lat: number, lng: number) => void;
}

const CounselingCard: React.FC<CounselingCardProps> = ({
  name,
  address,
  phone,
  lat,
  lng,
  moveToLocation
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-[#BEBEBE] border rounded-[15px] bg-white">
      {/* 🔹 이름 클릭 시 지도 이동 */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => moveToLocation(lat, lng)}
      >
        <span className="text-xl">{name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-gray-600"
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* 🔹 상세 정보 (아코디언) */}
      {isOpen && (
        <div className="p-4 border-t text-lg border-[#BEBEBE]">
          <p>
            <strong>주소:</strong> {address}
          </p>
          <p>
            <strong>전화번호:</strong> {phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default CounselingCard;
