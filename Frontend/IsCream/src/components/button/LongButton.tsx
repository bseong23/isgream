// 사용방법
// <LongButton color="green">버튼</LongButton>
// <LongButton color="gray">버튼</LongButton>

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  color?: "red" | "blue" | "green" | "gray";
  disabled?: boolean;
  className?: string;
  "data-id"?: string;
  "data-name"?: string;
  isLoading?: boolean;
}

const COLOR_PROS = {
  red: "bg-red-600",
  blue: "bg-blue-700",
  green: "bg-[#009E28] text-white",
  // green: 'bg-green-500',
  gray: "bg-gray-300"
};

const LongButton = ({
  children,
  type = "button",
  color = "green",
  disabled = false,
  onClick,
  className,
  "data-id": dataId,
  "data-name": dataName,
  isLoading = false
}: ButtonProps) => {
  return (
    <>
      <div className="w-full flex justify-center ">
        <button
          onClick={onClick}
          type={type}
          disabled={disabled}
          data-id={dataId}
          data-name={dataName}
          className={`w-full items-center rounded-[15px] text-xl h-12 px-4 py-1 text-text-md text-gray-25 ${COLOR_PROS[color]} ${className}`}
        >
          {isLoading ? (
            <div className="flex h-6 w-20 items-center justify-center gap-2">
              {/* <img
                            src="/assets/loading/spinner.svg"
                            alt="로딩중"
                            className="h-full w-full"
                        /> */}
            </div>
          ) : (
            children
          )}
        </button>
      </div>
    </>
  );
};

export default LongButton;
