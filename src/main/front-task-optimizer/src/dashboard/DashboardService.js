const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getToken = () => `Bearer ${sessionStorage.getItem('token')}`;

const dashboardService = {
    getWeatherInfo: async (nx, ny, baseDate, baseTime) => {
        const url = `${API_BASE_URL}/weather?nx=${nx}&ny=${ny}&baseDate=${baseDate}&baseTime=${baseTime}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text(); // 오류 메시지 읽기
                console.error("HTTP error", response.status, errorText);
                return []; // 에러가 있으면 빈 배열 반환
            }

            // JSON 파싱
            const responseData = await response.json();
            console.log("API Response:", responseData);
            return responseData;
        } catch (error) {
            console.error("Network or other error", error);
            return []; // 네트워크 오류 또는 JSON 파싱 오류 발생 시 빈 배열 반환
        }
    },

    getNews: async (category) => {
        const url = `${API_BASE_URL}/news?category=${category}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.text();
            if (!response.ok) {
                console.error("HTTP error", response.status, responseData);
                return { error: `HTTP error: ${response.status}`, details: responseData };
            }
            return JSON.parse(responseData);
        } catch (error) {
            console.error("Network or other error", error);
            throw error;
        }
    },

    getCalendarEvents: async () => {
        const url = `${API_BASE_URL}/calendar`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.text();
            if (!response.ok) {
                console.error("HTTP error", response.status, responseData);
                return { error: `HTTP error: ${response.status}`, details: responseData };
            }
            return JSON.parse(responseData);
        } catch (error) {
            console.error("Network or other error", error);
            throw error;
        }
    },

    getLifestyleInfo: async (type) => {
        const url = `${API_BASE_URL}/lifestyle?type=${type}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.text();
            if (!response.ok) {
                console.error("HTTP error", response.status, responseData);
                return { error: `HTTP error: ${response.status}`, details: responseData };
            }
            return JSON.parse(responseData);
        } catch (error) {
            console.error("Network or other error", error);
            throw error;
        }
    }
};

export default dashboardService;