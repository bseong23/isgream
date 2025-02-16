import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { childApi } from "../../api/child";
import { setChildren, selectChild } from "../../store/slices/childSlice";
import axios from "axios";

interface UseChildOptions {
  enabled?: boolean;
}

export const useChild = (
  onChildSelect?: (childName: string) => void,
  options: UseChildOptions = { enabled: true }
) => {
  const dispatch = useDispatch();
  const { children, selectedChild } = useSelector(
    (state: RootState) => state.child
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback으로 함수 메모이제이션
  const fetchChildren = useCallback(async () => {
    // enabled 옵션 추가
    if (!options.enabled) {
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const data = await childApi.getChildren();

      if (Array.isArray(data) && data.length > 0) {
        dispatch(setChildren(data));

        // onChildSelect가 있고 아직 선택된 자녀가 없을 때만 첫 번째 자녀 선택
        if (onChildSelect && !selectedChild) {
          onChildSelect(data[0].nickname);
          dispatch(selectChild(data[0]));
        }
      } else {
        dispatch(setChildren([]));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "자녀 목록 조회에 실패했습니다.";

        console.error("자녀 목록 조회 실패:", {
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data
        });

        setError(errorMessage);
        dispatch(setChildren([]));
      } else {
        console.error("예상치 못한 에러:", error);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, onChildSelect, options.enabled, selectedChild]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handleChildSelect = useCallback(
    (child) => {
      dispatch(selectChild(child));
      if (onChildSelect) {
        onChildSelect(child.nickname);
      }
    },
    [dispatch, onChildSelect]
  );

  return {
    children,
    selectedChild,
    loading,
    error,
    handleChildSelect
  };
};
