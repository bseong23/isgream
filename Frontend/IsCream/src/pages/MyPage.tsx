import LogoutButton from "../components/profile/LogoutButton";
import ProfileHeader from "../components/profile/ProfileHeader";
import ChildrenSection from "../components/profile/ChildrenSection";
import ChildModal from "../components/modal/ChildModal";
import Pdf from "../components/profile/Pdf";
import PAT from "../components/report/PAT";
import Personality5 from "../components/report/Personality5";
import React, { useEffect, useState } from "react";
import { getUserInfoAPI } from "../api/userAPI";

interface MyPageProps {
  nickname: string;
  profileImage: string;
  phone: string;
  birthDate: string;
  relation: string;
  children?: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }[];
  pat?: {
    patDate: string;
    typeA: number;
    typeB: number;
    typeC: number;
    patReport: string;
  };
  personality?: {
    personalityDate: string;
    personalityReport: string;
  };
}

const MyPage: React.FC = () => {
  console.log("MyPage 컴포넌트 렌더링 시작");

  const [userData, setUserData] = useState<MyPageProps>({
    nickname: "",
    profileImage: "",
    phone: "",
    birthDate: "",
    relation: "",
    children: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(
    null
  );

  const handleAddChild = () => {
    if (userData.children && userData.children.length < 2) {
      setEditingChildIndex(null);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("유저 정보 요청 시작");
        const response = await getUserInfoAPI();
        console.log("API 응답:", response);

        if (response.code == "S0000") {
          setUserData({
            nickname: response.data.nickname,
            profileImage: response.data.imageUrl,
            phone: response.data.phone, // 추가
            birthDate: response.data.birthDate, // 추가
            relation: response.data.relation, // 추가
            children: []
          });
          console.log(userData.profileImage);
        } else {
          console.error("사용자 정보 로딩 실패: ", response.message);
        }
      } catch (error) {
        console.error("사용자 정보 로딩 에러: ", error);
      }
    };

    fetchUserData();
  }, [userData.profileImage]);

  const handleEditChild = (index: number) => {
    setEditingChildIndex(index); // 수정할 자녀의 인덱스 저장
    setIsModalOpen(true);
  };

  const handleDeleteChild = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      children: prev.children!.filter((_, i) => i !== index)
    }));
  };

  const handleModalSubmit = (childData: {
    childNickname: string;
    childGender: string;
    childBirth: string;
  }) => {
    if (editingChildIndex !== null) {
      // 수정 모드
      setUserData((prev) => ({
        ...prev,
        children: prev.children!.map((child, index) =>
          index === editingChildIndex ? childData : child
        )
      }));
    } else {
      // 새로운 자녀 추가 모드
      setUserData((prev) => ({
        ...prev,
        children: [...prev.children!, childData]
      }));
    }
    setEditingChildIndex(null);
  };

  return (
    <>
      <div>
        {/* 로그아웃 */}
        <LogoutButton />

        {/* 프로필 이미지 영역 */}
        <ProfileHeader
          profileImage={userData.profileImage}
          nickname={userData.nickname}
          phone={userData.phone}
          birthDate={userData.birthDate}
          relation={userData.relation}
        />

        {/* 자녀 정보 영역 */}
        <ChildrenSection
          children={userData.children || []}
          onAddChild={handleAddChild}
          onUpdateChild={handleEditChild}
          onDeleteChild={handleDeleteChild}
        />

        {/* 검사결과(PDF) 다운 */}
        <Pdf 
          nickname={userData.nickname}
        />

        {/* 막대그래프 및 보고서 */}
        <PAT />

        {/* 도넛그래프 및 보고서 */}
        <Personality5 />
      </div>

      {/* 모달 컴포넌트 추가 */}
      <ChildModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChildIndex(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingChildIndex !== null
            ? userData.children![editingChildIndex]
            : undefined
        }
      />
    </>
  );
};

export default MyPage;
