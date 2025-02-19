import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/image/character2.png";

interface ProfileHeaderProps {
  profileImage?: string;
  nickname?: string;
  phone?: string;
  birthDate?: string;
  relation?: string;
  onNavigate?: () => void;
}

const ProfileHeader = ({
  profileImage,
  nickname,
  phone,
  birthDate,
  relation
}: ProfileHeaderProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("상세 프로필 설정 페이지 이동");
    navigate("/mypage/changeInfo", {
      state: {
        profileImage,
        nickname,
        phone,
        birthDate,
        relation
      }
    });
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[706px] mx-auto px-3 my-3">
          <div className="flex justify-between text-xl">
            <div className="flex items-center">
              <img
                src={profileImage || defaultImg}
                alt="Profile"
                className="w-24 h-25 rounded-full overflow-hidden border-2 border-gray-200"
              />
              <span className="ml-4 text-[25px]">{nickname}님</span>
            </div>
            <button className="ml-auto m-3" onClick={handleClick}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
