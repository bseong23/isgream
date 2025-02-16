import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/input";
import LongButton from "../../components/button/LongButton";
import { useAuth } from "../../hooks/useAuth";
import { checkEmailDuplicate, checkNicknameDuplicate } from "../../api/auth";
import { ERROR_CODES, SignUpRequest } from "../../types/auth";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  phone: string;
  relation: string;
  birthDate: string;
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phone: "",
    relation: "",
    birthDate: ""
  });

  const [buttonText, setButtonText] = useState("회원가입 하기");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [passwordValidationMessage, setPasswordValidationMessage] =
    useState("");

  const handleChange = (name: keyof SignUpFormData, value: string) => {
    if (name === "phone") {
      value = formatPhoneNumber(value);
    }

    if (name === "birthDate") {
      value = formatBirthDate(value);
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "password" || name === "confirmPassword") {
      const isPasswordValid = validatePassword(
        name === "password" ? value : formData.password
      );
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
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    }
  };

  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15}$)/;
    if (!regex.test(password)) {
      setPasswordValidationMessage(
        "비밀번호는 8~15자리이며, 숫자 및 특수문자를 포함해야 합니다."
      );
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

  const validateBirthDate = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;

    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today && birthDate.getFullYear() > 1900;
  };

  const handleEmailCheck = async () => {
    if (!validateEmail(formData.email)) {
      setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const response = await checkEmailDuplicate(formData.email);
      if (response.code === ERROR_CODES.SUCCESS) {
        setEmailCheckMessage(response.message || "사용 가능한 이메일입니다.");
      } else {
        setEmailCheckMessage(
          response.message || "이미 사용 중인 이메일입니다."
        );
      }
    } catch {
      setEmailCheckMessage("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await checkNicknameDuplicate(formData.nickname);
      if (response.code === ERROR_CODES.SUCCESS) {
        setNicknameCheckMessage(
          response.message || "사용 가능한 닉네임입니다."
        );
      } else {
        setNicknameCheckMessage(
          response.message || "이미 사용 중인 닉네임입니다."
        );
      }
    } catch {
      setNicknameCheckMessage("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (
      !emailCheckMessage.includes("가능") ||
      !nicknameCheckMessage.includes("가능")
    ) {
      alert("이메일 또는 닉네임 중복 확인을 해주세요.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("비밀번호는 8~15자리이며, 숫자 및 특수문자를 포함해야 합니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    if (!formData.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!formData.relation) {
      alert("아이와의 관계를 선택해주세요.");
      return;
    }

    if (!validateBirthDate(formData.birthDate)) {
      alert("올바른 생년월일을 입력해주세요. (YYYY-MM-DD)");
      return;
    }

    setButtonText("처리 중...");
    try {
      // signUpData를 SignUpRequest 타입으로 명시적 타입 지정
      const signUpData: SignUpRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        phone: formData.phone,
        relation: formData.relation,
        birthDate: formData.birthDate
      };

      const response = await signUp(signUpData);

      if (response.code === ERROR_CODES.SUCCESS) {
        setButtonText("가입 완료!");
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch {
      setButtonText("회원가입 하기");
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };
  const relationOptions = [
    { value: "REST", label: "기타" },
    { value: "MOTHER", label: "엄마" },
    { value: "FATHER", label: "아빠" }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-start space-y-4">
        {/* 이메일 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">이메일 아이디 *</label>
          <Input
            placeholder="example@naver.com"
            type="email"
            required={true}
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            withButton={true}
            onButtonClick={handleEmailCheck}
            buttonText="중복 확인"
          />
          <p
            className={`text-sm ${emailCheckMessage.includes("가능") ? "text-green-500" : "text-red-500"}`}
          >
            {emailCheckMessage}
          </p>
        </div>

        {/* 비밀번호 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">비밀번호 *</label>
          <Input
            placeholder="비밀번호를 입력해주세요."
            type="password"
            required={true}
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
          />
          <p className="text-sm text-red-500">{passwordValidationMessage}</p>
        </div>

        {/* 비밀번호 확인 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">비밀번호 확인 *</label>
          <Input
            placeholder="비밀번호를 확인해주세요."
            type="password"
            required={true}
            value={formData.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
          />
          <p
            className={`text-sm ${passwordMatchMessage.includes("일치합니다") ? "text-green-500" : "text-red-500"}`}
          >
            {passwordMatchMessage}
          </p>
        </div>

        {/* 이름 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">이름 *</label>
          <Input
            placeholder="이름을 입력해주세요."
            type="text"
            required={true}
            value={formData.username}
            onChange={(value) => handleChange("username", value)}
          />
        </div>

        {/* 닉네임 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">닉네임 *</label>
          <Input
            placeholder="닉네임을 입력해주세요."
            type="text"
            required={true}
            value={formData.nickname}
            onChange={(value) => handleChange("nickname", value)}
            withButton={true}
            onButtonClick={handleNicknameCheck}
            buttonText="중복 확인"
          />
          <p
            className={`text-sm ${nicknameCheckMessage.includes("가능") ? "text-green-500" : "text-red-500"}`}
          >
            {nicknameCheckMessage}
          </p>
        </div>

        {/* 전화번호 필드 */}
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

        {/* 관계 선택 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">아이와의 관계 *</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 appearance-none bg-white
  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
  bg-[length:10px] bg-[right_1rem_center] bg-no-repeat
  hover:border-green-400 transition-colors duration-200"
            value={formData.relation}
            onChange={(e) => handleChange("relation", e.target.value)}
            required
          >
            {relationOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.value === ""}
                className={option.value === "" ? "text-gray-400" : ""}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 생년월일 필드 */}
        <div className="w-full">
          <label className="text-gray-700 font-semibold">생년월일 *</label>
          <Input
            placeholder="YYYY-MM-DD"
            type="text"
            required={true}
            value={formData.birthDate}
            onChange={(value) => handleChange("birthDate", value)}
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
