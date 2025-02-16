import { useState } from "react";
import Input from "../../components/input/input";
import LongButton from "../../components/button/LongButton";
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phone: "",
    relation: "",
    birthDate: "",
  });

  const [buttonText, setButtonText] = useState("회원가입 하기");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [passwordValidationMessage, setPasswordValidationMessage] = useState("");

  const handleChange = (name: string, value: string) => {
    if (name === "phone") {
      value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const isPasswordValid = validatePassword(name === "password" ? value : formData.password);
      if (isPasswordValid) {
        checkPasswordMatch(
          name === "password" ? value : formData.password,
          name === "confirmPassword" ? value : formData.confirmPassword
        );
      } else {
        setPasswordMatchMessage("");
      }
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    }
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15}$)/;
    if (!regex.test(password)) {
      setPasswordValidationMessage("비밀번호는 8~15자리이며, 숫자 및 특수문자를 포함해야 합니다.");
    } else {
      setPasswordValidationMessage("");
    }
    return regex.test(password);
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setPasswordMatchMessage("비밀번호가 일치합니다.");
      } else {
        setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setPasswordMatchMessage("");
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const checkEmailDuplicate = async () => {
    if (!validateEmail(formData.email)) {
      setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const response = await axios.post("/users/email/check", {
        email: formData.email,
      });

      if (response.data.code === "S0000") {
        setEmailCheckMessage("사용 가능한 이메일입니다.");
      } else {
        setEmailCheckMessage("이미 사용 중인 이메일입니다.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEmailCheckMessage(error.response?.data?.message || "이메일 중복 확인 실패!");
      } else if (error instanceof Error) {
        setEmailCheckMessage(error.message);
      } else {
        setEmailCheckMessage("알 수 없는 오류 발생!");
      }
    }
  };

  const checkNicknameDuplicate = async () => {
    try {
      const response = await axios.post("/users/nickname/check", {
        nickname: formData.nickname,
      });

      if (response.data.code === "S0000") {
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
      } else {
        setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNicknameCheckMessage(error.response?.data?.message || "닉네임 중복 확인 실패!");
      } else if (error instanceof Error) {
        setNicknameCheckMessage(error.message);
      } else {
        setNicknameCheckMessage("알 수 없는 오류 발생!");
      }
    }
  };

  const handleSubmit = async () => {
    if (!emailCheckMessage.includes('가능') || !nicknameCheckMessage.includes('가능')) {
      alert('이메일 또는 닉네임 중복 확인을 해주세요.');
      return;
    }

    if (!validatePassword(formData.password)) {
      alert('비밀번호는 8~15자리이며, 숫자 및 특수문자를 포함해야 합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }

    if (!formData.phone) {
      alert('전화번호를 입력해주세요.');
      return;
    }

    setButtonText('처리 중...');
    try {
      const response = await axios.post('/users/join', formData);
      console.log('회원가입 성공!', response.data);
      setButtonText('가입 완료!');
      alert('회원가입이 완료되었습니다!');
    } catch (error) {
      console.error('회원가입 실패', error);
      setButtonText('회원가입 하기');
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-start space-y-4">
        <div className="w-full">
          <label className="text-gray-700 font-semibold">이메일 아이디 *</label>
          <Input
            placeholder="example@naver.com"
            type="email"
            required={true}
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            withButton={true}
            onButtonClick={checkEmailDuplicate}
          />
          <p className={`text-sm ${emailCheckMessage.includes("가능") ? "text-green-500" : "text-red-500"}`}>
            {emailCheckMessage}
          </p>
        </div>

        <div className="w-full">
          <label className="text-gray-700 font-semibold">닉네임 *</label>
          <Input
            placeholder="닉네임을 입력해주세요."
            type="text"
            required={true}
            value={formData.nickname}
            onChange={(value) => handleChange("nickname", value)}
            withButton={true}
            onButtonClick={checkNicknameDuplicate}
          />
          <p className={`text-sm ${nicknameCheckMessage.includes("가능") ? "text-green-500" : "text-red-500"}`}>
            {nicknameCheckMessage}
          </p>
        </div>

        <div className="w-full">
          <label className="text-gray-700 font-semibold">비밀번호 입력 *</label>
          <Input
            placeholder="비밀번호를 입력해주세요."
            type="password"
            required={true}
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
          />
          <p className="text-sm text-red-500">{passwordValidationMessage}</p>
        </div>

        <div className="w-full">
          <label className="text-gray-700 font-semibold">비밀번호 확인 *</label>
          <Input
            placeholder="비밀번호를 확인해주세요."
            type="password"
            required={true}
            value={formData.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
          />
          <p className={`text-sm ${passwordMatchMessage.includes("일치합니다") ? "text-green-500" : "text-red-500"}`}>
            {passwordMatchMessage}
          </p>
        </div>

        <div className="w-full">
          <label className="text-gray-700 font-semibold">전화번호 *</label>
          <Input
            placeholder="010-xxxx-xxxx"
            type="tel"
            required={true}
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
          />
        </div>
      </div>

      <LongButton 
        onClick={handleSubmit} 
        color="green" 
        className="mt-8 w-full max-w-md bg-green-600 border border-green-500 font-semibold px-4 py-2 text-white"
      >
        {buttonText}
      </LongButton>
    </div>
  );
};

export default SignUpPage;
