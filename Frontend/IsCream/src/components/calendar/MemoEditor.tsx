import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useCalendar } from "../../hooks/calendar/useCalendar";

interface MemoEditorProps {
  initialMemo: string;
  memoId?: string;
  selectedDate: {
    year: number;
    month: number;
    day: number;
  };
  onSave: (memo: string, memoId?: string) => Promise<void>;
  onCancel: () => void;
}

const MemoEditor: React.FC<MemoEditorProps> = ({
  initialMemo = "",
  memoId,
  selectedDate,
  onSave,
  onCancel
}) => {
  const [memoText, setMemoText] = useState(initialMemo);
  const { selectedChild } = useSelector((state: RootState) => state.child);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { createMemo, updateMemo, deleteMemo } = useCalendar(
    Number(selectedChild?.childId) || 0
  );

  useEffect(() => {
    setMemoText(initialMemo || "");
  }, [initialMemo]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = async () => {
    const trimmedMemo = memoText.trim();
    const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;

    try {
      let response;

      if (!memoId && trimmedMemo.length > 0) {
        // 새 메모 생성
        response = await createMemo(formattedDate, trimmedMemo);
      } else if (memoId && trimmedMemo.length === 0) {
        // 기존 메모 삭제
        response = await deleteMemo(Number(memoId));
      } else if (memoId && trimmedMemo !== initialMemo) {
        // 기존 메모 수정
        response = await updateMemo(Number(memoId), trimmedMemo);
      } else {
        // 변경 사항 없음
        onCancel();
        return;
      }

      if (response?.code === "S0000") {
        await onSave(trimmedMemo, response.data?.memoId || memoId);
      } else {
        console.error("메모 저장 실패:", response);
      }
    } catch (error) {
      console.error("메모 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className="w-full h-[650px] bg-[#ffffff] p-4 rounded-lg drop-shadow-sm">
      <textarea
        ref={textareaRef}
        value={memoText}
        onChange={(e) => setMemoText(e.target.value)}
        onBlur={handleSave}
        className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-800 overflow-y-auto"
        placeholder="메모를 입력하세요..."
        maxLength={500}
        style={{
          backgroundAttachment: "local",
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, #ccc 31px, #ccc 32px)",
          lineHeight: "32px",
          fontSize: "20px",
          padding: "0 10px",
          border: "none",
          // fontFamily:
          //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          wordBreak: "break-all"
        }}
      />
    </div>
  );
};

export default MemoEditor;
