import ProfileImage from "../../components/profile/ProfileImage";
import ProfileForm from "../../components/profile/ProfileForm";
import {useState, useRef} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserInfoAPI } from "../../api/userAPI";

interface LocationState  {
    profileImage: string;
    nickname: string;
    phone: string;
    birthDate: string;
    relation: "MOTHER" | "FATHER" | "REST";
}

interface UpdateUserInfoRequest {
  nickname: string;
  phone: string;
  birthDate: string;
  relation: "MOTHER" | "FATHER" | "REST";
}

const ChangeInfo = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state as LocationState;
  const profileImageRef = useRef<{ uploadImage: () => Promise<File | null> }>(null);

  const [birthDate, setBirthDate] = useState(userData?.birthDate || '');

  const handleSubmit = async (formData: {
    nickname: string;
    phone: string;
    birthDate: string;
    relation: string;
  }) => {
    try {
      // 이미지 파일 가져오기
      console.log("이미지 업로드 시도");
      const imageFile = await profileImageRef.current?.uploadImage();
      console.log("이미지 업로드 시도");

      const updateData: UpdateUserInfoRequest = {
        nickname: formData.nickname,
        birthDate: formData.birthDate,
        phone: formData.phone,
        relation: formData.relation as "MOTHER" | "FATHER" | "REST"
      };
 
      console.log("전송할 데이터:", updateData);
      const response = await updateUserInfoAPI(updateData, imageFile || undefined);
      console.log("서버 응답:", response);

      if (response.code === 'S0000') {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        navigate('/mypage');
      } else {
        alert(`프로필 업데이트 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col mt-20">

      <div>
        {/* 프로필 이미지 */}
          <ProfileImage 
          initialProfileImage={userData?.profileImage}
          ref={profileImageRef}
          />
      </div>
      <div className="flex justify-center">
        {/* 입력 폼 */}
          <ProfileForm
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              initialData = {{
                nickname: userData?.nickname,
                phone: userData?.phone,
                birthDate: userData?.birthDate,
                relation: userData?.relation
              }}
              onSubmit={handleSubmit}
          />
      </div>
    </div>
  );
};

export default ChangeInfo;