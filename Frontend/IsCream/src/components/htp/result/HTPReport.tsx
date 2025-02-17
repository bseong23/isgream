import React from "react";

interface HtpReportProps {
  title: string;
  result: string;
}

const HtpReport: React.FC<HtpReportProps> = ({ title, result }) => {
  return (
    <div className="htp-report">
      <h2>{title}</h2>
      <pre>{result}</pre>
    </div>
  );
};

export default HtpReport;
