import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Input from "../input/input"; // 공통 Input 컴포넌트 사용
import LongButton from "../button/LongButton"; // 공통 LongButton 컴포넌트 사용

// 🔹 FindPasswordForm 컴포넌트의 Props 타입 정의
interface FindPasswordFormProps {
  onSubmit: (formData: { email: string; name: string; phone: string }) => Promise<boolean>;
}

// 🔹 비밀번호 찾기 폼 컴포넌트
const FindPasswordForm = ({ onSubmit }: FindPasswordFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", name: "", phone: "" });

  console.log("📢 FindPasswordForm 렌더링됨!");
  console.log("📢 초기 onSubmit 값:", onSubmit);

  // 🔹 입력값 변경 핸들러
  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔥 handleSubmit 실행됨!", formData);
    console.log("📢 현재 onSubmit 함수:", onSubmit);

    const success = await onSubmit(formData);
    console.log("📢 onSubmit 실행 완료!", success);

    if (success) {
      navigate("/reset-password", { state: { email: formData.email } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
      {/* 🔹 이메일 입력 필드 */}
      <div className="space-y-2">
        <label className="block text-black font-semibold text-left">이메일 아이디 *</label>
        <Input
          placeholder="example@gmail.com"
          type="email"
          required={true}
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
        />
      </div>

      {/* 🔹 이름 입력 필드 */}
      <div className="space-y-2">
        <label className="block text-black font-semibold text-left">이름 *</label>
        <Input
          placeholder="이름을 입력해주세요."
          type="text"
          required={true}
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
        />
      </div>

      {/* 🔹 전화번호 입력 필드 */}
      <div className="space-y-2">
        <label className="block text-black font-semibold text-left">전화번호 *</label>
        <Input
          placeholder="전화번호를 입력해주세요."
          type="tel"
          required={true}
          value={formData.phone}
          onChange={(value) => handleChange("phone", value)}
        />
      </div>

      {/* 🔹 비밀번호 찾기 버튼 */}
      <div className="pt-4">
        <LongButton 
          type="submit" 
          color="green"
          className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          비밀번호 찾기
        </LongButton>
      </div>
    </form>
  );
};

export default FindPasswordForm;
