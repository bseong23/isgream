import { useState } from "react";
import Input from "../input/input"; // 공통 Input 컴포넌트 사용
import LongButton from "../button/LongButton"; // 공통 LongButton 컴포넌트 사용

// 🔹 ResetPasswordForm의 Props 타입 정의
interface ResetPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => void;
}

// 🔹 비밀번호 재설정 폼 컴포넌트
const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 🔹 비밀번호 유효성 검사 (8~15자리, 숫자 및 특수문자 포함)
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15}$)/;
    return regex.test(password);
  };

  // 🔹 비밀번호 입력 변경 핸들러
  const handleChangePassword = (value: string) => {
    setPassword(value);

    // 입력된 비밀번호가 유효하지 않으면 에러 메시지 표시
    if (!validatePassword(value)) {
      setPasswordError("비밀번호는 8~15자리이며, 숫자 및 특수문자를 포함해야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  // 🔹 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError("비밀번호가 조건을 충족하지 않습니다.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    onSubmit(password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
      
      {/* 🔹 새 비밀번호 입력 필드 */}
      <div className="space-y-2">
        <label className="block text-black font-semibold">새 비밀번호 *</label>
        <Input
          type="password"
          placeholder="새 비밀번호 입력"
          required={true}
          value={password}
          onChange={handleChangePassword}
        />
        <p className="text-sm text-red-500">{passwordError}</p>
      </div>

      {/* 🔹 비밀번호 확인 입력 필드 */}
      <div className="space-y-2">
        <label className="block text-black font-semibold">비밀번호 확인 *</label>
        <Input
          type="password"
          placeholder="비밀번호 다시 입력"
          required={true}
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
        />
      </div>

      {/* 🔹 비밀번호 재설정 버튼 (LongButton 활용) */}
      <div className="pt-4">
        <LongButton 
          type="submit" 
          color="green"
          className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          비밀번호 재설정
        </LongButton>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
