interface TitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="제목을 입력해주세요."
      value={value}
      onChange={onChange}
      className="w-full p-2 mb-4 text-3xl border-b border-[#BEBEBE] focus:outline-none
                  md:text-4xl sm:text-2xl"
    />
  );
};
