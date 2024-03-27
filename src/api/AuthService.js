import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

class AuthService {
    // 로그인 메소드
    login(email, password) {
        return axios.post(`${API_URL}auth/login`, { email, password })
            .then(response => {
                if (response.data.accessToken) {
                    sessionStorage.setItem('token', response.data.accessToken);
                }
                return response.data;
            });
    }

    async logout(navigate) {
        const token = sessionStorage.getItem('token');
        if (!token) {
            if (navigate) navigate('/');
            return;
        }

        try {
            // 로그아웃 API 호출
            await axios.post(`${API_URL}auth/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
            // 에러 처리 로직 필요 시 여기에 추가
        } finally {
            // 세션에서 토큰 제거
            sessionStorage.removeItem('token');
            // navigate 함수를 사용하여 리다이렉션
            if (navigate) navigate('/');
        }
    }

    // 현재 로그인된 사용자 정보를 가져오는 메소드
    getToken() {
        return sessionStorage.getItem('token');
    }

    // 내 정보 조회
    getMyInfo() {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.get(`${API_URL}member/myinfo`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    // 내 정보 수정
    updateMyInfo(data) {
        const token = sessionStorage.getItem('token'); // 또는 localStorage.getItem('token');
        return axios.put(`${API_URL}member/update`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // 회원 탈퇴
    deleteAccount() {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.delete(`${API_URL}member/deleteAccount`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }
}

// Axios 인터셉터 설정
axios.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        const authService = new AuthService();
        authService.logout();
    }
    return Promise.reject(error);
});

export default new AuthService();