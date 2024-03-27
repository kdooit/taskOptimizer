import axios from 'axios';

// 백엔드 API 엔드포인트 URL 설정
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;

// 로그인 함수
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.accessToken) {
        // 로그인 성공 후, 토큰을 로컬 스토리지에 저장
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
};

// 토큰 재발급 함수
export const verifyToken = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    try {
        const response = await fetch(`${API_URL}/reissue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                refreshToken,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            // 재발급 받은 토큰으로 업데이트
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('refreshToken', data.refreshToken);
            return data;
        } else {
            throw new Error(data.message || '토큰 재발급 실패');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};