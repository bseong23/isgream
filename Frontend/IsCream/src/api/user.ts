import { api } from '../utils/common/axiosInstance';

interface GetUserInfoResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        email: string;
        username: string;
        nickname: string;
        phone: string;
        birthDate: string;
        relation: string;
        imageUrl: string;
    }
}

interface UpdateUserInfoRequest {
    nickname: string;
    birthDate: string;
    phone: string;
    relation: 'MOTHER' | 'FATHER' | 'REST';
}

interface UpdateUserResponse{
    code: 'S0000' | 'E4002';
    message: string;
}

interface NicknameCheckResponse {
    code: 'S0000' | 'E5002';
    message: string;
}


// 사용자 정보 확인(이메일, 이름, 전화번호 확인)
export const getUserInfoAPI = async () : Promise<GetUserInfoResponse> => {

    const token = localStorage.getItem('accessToken');
    console.log('현재 토큰:', token);

    const response = await api.get('/users/info');
    console.log('API 응답:', response);
    return response.data;
}

export const updateUserInfoAPI = async (
    updateData: UpdateUserInfoRequest,
    file?: File
) : Promise<UpdateUserResponse> => {

    const formData = new FormData();

    const userBlob = new Blob(
        [JSON.stringify(updateData)],
        {type: 'application/json'}
    );
    formData.append('updateUser', userBlob);

    if(file) {
        formData.append('file', file);
    }

    const response = await api.put('/users/info', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const postNicknameCheck = async (nickname: string): Promise<NicknameCheckResponse> => {
    try {
        const response = await api.post('/users/nickname/check', {
            nickname: nickname
        });
        
        if (response.data.code === 'S0000') {
            return response.data;
        }
        throw new Error(response.data.message || "닉네임 중복 검사 실패");
        
    } catch (error) {
        console.error("닉네임 중복 검사 실패", error);
        throw error;
    }
}
