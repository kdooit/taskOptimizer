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
        if (!token) return Promise.reject("유효한 토큰을 찾을 수 없습니다.");
        return axios.get(`${API_URL}member/myinfo`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    //내 정보 수정
    updateMyInfo(data) {
        const token = this.getToken();
        if (!token) {
            return Promise.reject("유효한 토큰을 찾을 수 없습니다.");
        }
        return axios.put(`${API_URL}member/update`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
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

    // 공통 POST 요청 메소드 추가
    post(url, data) {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.post(`${API_URL}${url}`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    //상세 글 보기
    async get(url, params = {}) {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.get(`${API_URL}${url}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: params,
        });
    }

    //게시글 수정
    async put(url, data = {}) {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.put(`${API_URL}${url}`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    //게시글 삭제
    async delete(url, config = {}) {
        const token = this.getToken();
        if (!token) return Promise.reject("No token found.");
        return axios.delete(`${API_URL}${url}`, {
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