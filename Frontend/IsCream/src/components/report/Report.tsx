interface ReportProps {
  text: string;
}

const Report = ({ text }: ReportProps) => (
  <div className="w-full flex justify-center">

    <div className="w-[80%] p-4 bg-[#e3f4ff] rounded-[15px]  border border-gray-300 items-center whitespace-pre-wrap">
      {text}
    </div>
  </div>
);

export default Report;
