import axios from 'axios';
import Db from '../Db.js';

const API_URL = 'http://localhost:8080/api/';

class AuthService {

    constructor() {
        this.Db = Db;
    }

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
            sessionStorage.removeItem('token');
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
        const token = this.getToken();
        return this.post('member/update', data);
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
}

// Axios 인터셉터 설정
axios.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        const authService = new AuthService();
        authService.logout().then(() => {
            window.location = '/';
            }

        )
    }
    return Promise.reject(error);
});

// AuthService 인스턴스 생성, DB 연결 인스턴스 전달
const authServiceInstance = new AuthService(Db);
export default authServiceInstance;