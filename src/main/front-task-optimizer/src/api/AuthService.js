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

    // 로그아웃 메소드
    logout(navigate) {
        sessionStorage.removeItem('token');
        if (navigate) navigate('/');
    }

    // 토큰 가져오기
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

    // Axios 인터셉터 설정
    setupInterceptors() {
        axios.interceptors.response.use(response => response, error => {
            if (error.response && error.response.status === 401) {
                this.logout(() => {
                    window.location = '/';
                });
            }
            return Promise.reject(error);
        });
    }
}

const authService = new AuthService();
export default authService;