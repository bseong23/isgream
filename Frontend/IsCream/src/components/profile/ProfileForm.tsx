import Input from "../input/input";
import LongButton from "../button/LongButton";
import ProfileFormLabel from "./ProfileFormLabel";
import RelationButtons from "../../components/profile/RelationButtons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postNicknameCheck } from "../../api/user"

interface ProfileFormProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
  initialData?: {
    nickname?: string;
    phone?: string;
    birthDate?: string;
    relation?: string;
  }
  onSubmit: (formData: {
    nickname: string;
    phone: string;
    birthDate: string;
    relation: string;
  }) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ birthDate, setBirthDate, initialData, onSubmit }: ProfileFormProps) => {
  const [nickname, setNickname] = useState(initialData?.nickname || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [selectedRelation, setSelectedRelation] = useState<string>(initialData?.relation || '');
  // 닉네임 중복 체크 상태 추가
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  
  const navigate = useNavigate();

  // 닉네임 중복 체크 함수
  const handleNicknameCheck = async () => {
      if (!nickname) {
          alert('닉네임을 입력해주세요.');
          return;
      }

      try {
          const response = await postNicknameCheck(nickname);
          if (response.code === 'S0000') {
              alert('사용 가능한 닉네임입니다.');
              setIsNicknameChecked(true);
          }
      } catch (error) {
          alert('이미 사용 중인 닉네임입니다.');
          setIsNicknameChecked(false);
      }
  };

  // 닉네임 변경 시 중복 체크 상태 초기화
  const handleNicknameChange = (value: string) => {
      setNickname(value);
      setIsNicknameChecked(false);
      setIsNicknameChanged(true);
  };

  const handleSubmit = () => {
      if (!nickname || !phone || !birthDate || !selectedRelation) {
          alert('모든 필수 항목을 입력해주세요.');
          return;
      }

      if (isNicknameChanged && !isNicknameChecked) {
          alert('닉네임 중복 확인이 필요합니다.');
          return;
      }
      
      onSubmit({
          nickname,
          phone,
          birthDate,
          relation: selectedRelation
      });
  };
  

  return (
    <div className="w-full max-w-[706px]">
        <div className="space-y-4 w-full">
          <div>
            {/* 닉네임 필드 */}
            <ProfileFormLabel
              label="닉네임"
              required
            >
              <Input
                placeholder="닉네임"
                type="text"
                required={true}
                withButton={true}
                value={nickname}
                onChange={handleNicknameChange}
                onButtonClick={handleNicknameCheck}
              />
            </ProfileFormLabel>
          </div>
          {/* 전화번호 필드 */}
          <ProfileFormLabel
            label="전화번호"
            required
          >
            <Input
              placeholder="010-1234-5678"
              type="tel"
              required={true}
              value={phone}
              onChange={(value) => setPhone(value)}
            />
          </ProfileFormLabel>

          {/* 생년월일 필드 */}
          <ProfileFormLabel
            label="생년월일"
            required
          >
            <Input
              type="calendar"
              placeholder="생년월일을 선택하세요"
              required={true}
              value={birthDate}
              onChange={setBirthDate}
            />
          </ProfileFormLabel>

          {/* 관계 선택 필드 */}
          <ProfileFormLabel
            label="아이와의 관계"
            required
          >
            <RelationButtons 
              selectedRelation={selectedRelation}
              onChange={setSelectedRelation}
            />
          </ProfileFormLabel>

          {/* 비밀번호 변경 버튼 */}
          <div className="flex justify-center">
            <div className="w-[95%] flex justify-end">
              <button
                className="w-1/3 bg-[#009E28] rounded-[15px] text-white p-1 my-5"
                onClick={() => {
                  console.log("비밀번호 변경하기 버튼 클릭")
                  navigate('/mypage/changeinfo/password')
                }}
              >
                비밀번호 변경하기 &gt;
              </button>
            </div>
          </div>

          {/* 정보 수정 버튼 */}
          <div className="flex justify-center sticky mt-20 mb-10">
              <LongButton color="green" onClick={handleSubmit}>정보 수정</LongButton>
          </div>
        </div>
    </div>
  );
};

export default ProfileForm;