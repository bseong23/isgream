import { useState } from "react";

interface VerifyEmailFormProps {
  onSubmit: (code: string) => void;
}

const VerifyEmailForm = ({ onSubmit }: VerifyEmailFormProps) => {
  const [code, setCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(code);
      }}
      className="space-y-4 w-full max-w-md"
    >
      <label className="block text-gray-700 font-semibold">인증 코드 입력 *</label>
      <input
        type="text"
        placeholder="인증 코드를 입력하세요"
        value={code}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        maxLength={6} // 6자리 인증 코드
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
      >
        인증 확인
      </button>
    </form>
  );
};

export default VerifyEmailForm;
