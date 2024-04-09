import fetch from 'node-fetch';

class WeatherService {
    constructor(apiKey) {
        this.apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        this.baseUrl = "https://apihub.kma.go.kr/api/typ01";
    }

    async fetchWeather(latitude, longitude) {
        const url = `${this.baseUrl}/url/fct_afs_dl2.php?reg=&tmfc1=2020052505&tmfc2=2020052517&disp=0&help=1&authKey=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            throw error;
        }
    }
}

export default WeatherService;