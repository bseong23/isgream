interface ContentTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength: number;
}

export const ContentTextarea: React.FC<ContentTextareaProps> = ({
  value,
  onChange,
  maxLength
}) => {
  return (
    <div className="relative">
      <textarea
        placeholder="자유롭게 이야기를 나눠보세요."
        value={value}
        onChange={onChange}
        className="w-full h-100 p-2 focus:outline-none resize-none border-b border-[#BEBEBE] text-xl"
      />
      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
        {value.length}/{maxLength}
      </div>
    </div>
  );
};
