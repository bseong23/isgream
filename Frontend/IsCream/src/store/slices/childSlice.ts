import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Child } from "@/types/child";

interface ChildState {
  selectedChild: Child | null;
  children: Child[];
}

const initialState: ChildState = {
  selectedChild: null,
  children: []
};

const childSlice = createSlice({
  name: "child",
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;

      // 아이가 있고 현재 선택된 아이가 없다면 첫 번째 아이 선택
      if (action.payload.length > 0 && !state.selectedChild) {
        state.selectedChild = action.payload[0];
      }
    },
    selectChild: (state, action: PayloadAction<Child>) => {
      state.selectedChild = action.payload;
    },
    clearSelectedChild: (state) => {
      state.selectedChild = null;
      localStorage.removeItem("selectedChild");
    },
    // 모든 child 상태를 초기화하는 리듀서 추가
    resetChild: (state) => {
      state.selectedChild = null;
      state.children = [];
      localStorage.removeItem("selectedChild");
    }
  }
});

export const { setChildren, selectChild, clearSelectedChild, resetChild } =
  childSlice.actions;
export default childSlice.reducer;
