import React, { useEffect, useState } from 'react';

function WeatherComponent() {
    const [weatherInfo, setWeatherInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const token = sessionStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:8080/weather?lat=${latitude}&lon=${longitude}&baseDate=20220601&baseTime=0500`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 토큰 포함
                    }
                });
                if (!response.ok) {
                    setError('날씨 정보를 가져올 수 없습니다.');
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setWeatherInfo(data);
                    console.log(data)
                } else {
                    console.error('정보 타입이 배열이 아닙니다.:', data);
                    setWeatherInfo([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('날씨 정보를 가져올 수 없습니다.:', error);
                setError('Failed to fetch weather data');
                setLoading(false);
            }
        }, (error) => {
            console.error('위치 정보를 가져올 수 없습니다.:', error);
            setError('Failed to get location');
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='Container'>
            <ul>
                {weatherInfo.map((item, index) => (
                    <li key={index}>{`${item.category}: ${item.fcstValue}`}</li>
                ))}
            </ul>
        </div>
    );
}

export default WeatherComponent;
