import girlImg from "../../assets/image/little_girl.png";
import boyImg from "../../assets/image/little_boy.png";
import editIcon from "../../assets/icons/edit-pen.png";
import cancelIcon from "../../assets/icons/cancle-default.png";
import { childApi } from "../../api/child";
import { useState } from "react";
import ChildeModal from "../../components/modal/ChildModal";

interface ChildInfoProps{
    childId: number;
    childNickName:string;
    childGender: string;
    childBirth: string;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
}

const ChildInfo: React.FC<ChildInfoProps> = ({ 
    childId,
    childNickName, 
    childGender, 
    childBirth,
    onUpdateSuccess,
    onDeleteSuccess
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nickname, setNickname] = useState(childNickName);
    const [gender, setGender] = useState(childGender);
    const [birth, setBirth] = useState(childBirth);
    
    const handleUpdate = async () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (childData: {
        childNickname: string;
        childGender: string;
        childBirth: string;
    }) => {
        try {
            console.log('수정 시도 데이터:', childData);

            const response = await childApi.updateChild(
                childId,
                childData.childNickname,
                childData.childGender === '남자아이' ? 'M' : 'F',
                childData.childBirth
            );
    
            console.log('수정 API 응답:', response);

            if (response) {
                // 로컬 상태 업데이트
                setNickname(childData.childNickname);
                setGender(childData.childGender);
                setBirth(childData.childBirth);

                // 부모 컴포넌트의 목록 새로고침
                console.log('onUpdateSuccess 호출 직전');
                onUpdateSuccess?.();
                console.log('onUpdateSuccess 호출 완료');

                setIsModalOpen(false);
                console.log('수정 성공!');
            }
        } catch (error: any) {
            console.error('자녀 정보 수정 실패:', error);
            if (error.response) {
                console.error('서버 에러 응답:', error.response.data);
                console.error('서버 에러 상태:', error.response.status);
            }
            alert(`자녀 정보 수정에 실패했습니다. ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const isConfirmed = window.confirm('정말로 자녀를 삭제하시겠습니까?');
            if (!isConfirmed) return;
    
            console.log('자녀 삭제 시도');
            
            await childApi.deleteChild(childId);

            // console.log("응답: ", response);
            onDeleteSuccess?.();
            console.log('자녀 삭제 성공!');
        } catch (error: any) {
            // 백엔드에서 반환한 구체적인 에러 메시지 우선 사용
            const errorMessage = error.response?.data?.message || 
                                 error.message || 
                                 '자녀 삭제 중 오류가 발생했습니다.';
    
            console.error('자녀 삭제 실패:', error);
            
            // 사용자에게 구체적인 에러 메시지 표시
            alert(errorMessage);
    
            // 필요하다면 추가 에러 처리 (예: 에러 로깅, 특정 조건에 따른 다른 처리)
            if (error.response?.data?.code === 'E2001') {
                // 시스템 에러의 경우 추가 조치
                // 예: 고객 지원팀에 문의 안내
            }
        }
    };

    return(
        <>
            <div className="p-4 border border-gray-300 rounded-lg w-[160px]">
                <div className="flex justify-between mb-2">
                    <div>
                        {childGender === '여자아이' ? (
                            <img src={girlImg} alt="여자아이 이미지" />
                        ) : (
                            <img src={boyImg} alt="남자아이 이미지" />
                        )}
                    </div>
                    <div>
                        <button onClick={handleUpdate}>
                            <img src={editIcon} alt="수정" />
                        </button>
                        <button onClick={handleDelete}>
                            <img src={cancelIcon} alt="삭제" />
                        </button>
                    </div>
                </div>
                <h3 className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">이름: {nickname}</h3>
                <p className="text-gray-600">성별: {gender}</p>
                <p className="text-gray-600">생년월일: {birth}</p>
            </div>

            <ChildeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={{
                    childNickname: childNickName,
                    childGender: childGender,
                    childBirth: childBirth
                }}
            />
        </>
    )
}

export default ChildInfo;