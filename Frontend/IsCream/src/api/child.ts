import { api } from "../utils/common/axiosInstance";
import { Child } from "../types/child";

export const childApi = {
  // 자녀 목록 조회
  async getChildren(): Promise<Child[]> {
    try {
      console.log("자녀목록조회시도중");

      const response = await api.get("/children");
      console.log("자녀목록조회완전잘돼: ", response);

      if (response.data.code === "S0000") {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error("자녀 목록 조회 실패:", error);
      throw error;
    }
  },

  async addChild(childData: {
    nickname: string;
    gender: string;
    birthDate: string;
  }): Promise<Child> {
    try {
      const response = await api.post("/children", childData);

      if (response.data.code === "S0000") {
        return response.data.data;
      }

      throw new Error(response.data.message || "자녀 추가에 실패했습니다.");
    } catch (error) {
      console.error("자녀 추가 실패:", error);
      throw error;
    }
  },

  async updateChild(
    childId: number,
    nickname: string,
    gender: string,
    birthDate: string
  ): Promise<Child> {
    try {
      console.log("API 호출 데이터:", {
        url: "/children",
        data: {
          childId,
          nickname,
          gender,
          birthDate
        }
      });

      const response = await api.put("/children", {
        childId,
        nickname,
        gender,
        birthDate
      });

      console.log("응답데이터: ", response);
      
      if (response.data.code === "S0000") {
        return response.data;
      }

      throw new Error(
        response.data.message || "자녀 정보 수정에 실패했습니다."
      );
    } catch (error) {
      console.error("자녀 정보 수정 실패:", error);
      throw error;
    }
  },

  async deleteChild(childId: number): Promise<void> {
    try {
      const response = await api.delete(`/children/${childId}`);

      if (response.data.code !== "S0000") {
        // return response.data;
        throw new Error(response.data.message || "자녀 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("자녀 삭제 실패:", error);
      throw error;
    }
  }
};
