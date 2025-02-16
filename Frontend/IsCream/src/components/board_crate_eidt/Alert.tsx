interface AlertProps {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "error", onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 mt-15 rounded-md shadow-lg ${
        type === "error"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-sm hover:opacity-75">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Alert;
