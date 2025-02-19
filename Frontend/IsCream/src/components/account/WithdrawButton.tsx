import useWithdraw from "../../hooks/useWithdraw";

interface WithdrawButtonProps {
  className?: string; // ✅ className을 props로 추가
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({ className = "" }) => {
  const { withdraw, loading } = useWithdraw();

  return (
    <button 
      onClick={withdraw} 
      disabled={loading}
      className={`bg-gray-500 text-white text-lg ${className} flex items-center justify-center shadow-md hover:bg-red-600 transition-all duration-300`}
    >
      {loading ? "탈퇴 중..." : "회원 탈퇴"}
    </button>
  );
};

export default WithdrawButton;
