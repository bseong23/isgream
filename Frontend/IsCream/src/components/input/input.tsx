// 사용방법
// <Input
//         placeholder='hello@example.com'
//         type='email'
//         required={true}
//         />

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

//       <Input
//         placeholder="홍길동"
//         type="text"
//         required={true}
//         withButton={true}
//         onButtonClick={() => console.log('중복확인 클릭')}
//       />

interface InputProps {
  placeholder?: string;
  type?: "email" | "tel" | "text" | "calendar" | "password";
  required?: boolean;
  className?: string;
  withButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  value?: string; // 달력 값
  onChange?: (value: string) => void;
}

const Input = ({
  placeholder = "",
  type = "email",
  required = false,
  className = "",
  withButton = false,
  buttonText = "중복 확인",
  onButtonClick,
  value,
  onChange
}: InputProps) => {
  const [showPassword, setShoePassword] = useState(false);
  const inputType =
    type === "calendar"
      ? "date"
      : type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

  const handlerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setShoePassword(!showPassword);
  };

  return (
    <>
      <div>
        <div className="w-full max-w-[706px] p-3 bg-white border border-gray-300 rounded-[15px] flex items-center">
          <input
            type={inputType}
            placeholder={placeholder}
            required={required}
            className={`flex-1 outline-none ${className} ${
              type === "calendar" ? "cursor-pointer" : ""
            }`}
            value={value}
            onChange={handlerInputChange}
          />
          {withButton && (
            <button
              onClick={onButtonClick}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-[15px] hover:bg-green-700"
            >
              {buttonText}
            </button>
          )}

          {type === "password" && (
            <button
              onClick={togglePasswordVisibility}
              className="p-1 text-gray-500 hover:text-gray-700"
              type="button"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Input;
