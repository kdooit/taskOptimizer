import React, { useState, useEffect } from 'react';

function WeatherComponent() {
    const [weatherInfo, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWeatherInfo = async () => {
            try {
                // 예시 파라미터, 실제 요청 시 적절한 값으로 대체 필요
                const params = new URLSearchParams({
                    reg: "11B10101", // 서울 지역 코드
                    tmfc1: "2020052505",
                    tmfc2: "2020052517"
                });
                const response = await fetch(`/weather?${params}`);
                if (!response.ok) {
                    throw new Error('날씨 정보를 가져오는 데 실패했습니다.');
                }
                const data = await response.text();

                console.log(data)
                setWeatherData(data); // 파싱된 데이터로 상태 업데이트
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.toString());
                setLoading(false);
            }
        };

        fetchWeatherInfo();
    }, []);

    if (loading) return <div>날씨 정보를 불러오는 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div>
            <h1>초단기 날씨 정보</h1>
            {/* 날씨 정보 표시 로직 추가 */}
            <p>기온: {weatherInfo ? weatherInfo.response.body.items.item[0].obsrValue : '정보 없음'}</p>
        </div>
    );
}

export default WeatherComponent;