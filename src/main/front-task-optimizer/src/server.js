const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
require('dotenv').config();

const AuthService = require('./api/AuthService');
const db = require('./db');

const app = express();
const port = process.env.PORT || 8080;

// AuthService 인스턴스 생성, DB 연결 인스턴스 전달
const authService = new AuthService(db);

// 모든 도메인에서의 요청을 허용
app.use(cors());

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(bodyParser.json());
app.use(express.json());

// 회원가입 라우트
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        await authService.signup(email, password);
        res.status(200).send('회원가입이 완료되었습니다.');
    } catch (error) {
        console.error(error);
        res.status(500).send('회원가입 중 오류가 발생했습니다.');
    }
});

// 날씨 정보를 제공하는 라우트
app.get('/weather', async (req, res) => {
    // const { nx, ny, base_date, base_time } = req.query;
    const reg = req.query.reg; // 예보 구역 코드
    const tmfc1 = '2020052505'; // 발표 시간 시작
    const tmfc2 = '2020052517'; // 발표 시간 종료

    const apiKey = process.env.WEATHER_API_KEY;
    const baseUrl = `https://apihub.kma.go.kr/api/typ01`;
    const url = `${baseUrl}/url/fct_afs_dl2.php?reg=&tmfc1=2020052505&tmfc2=2020052517&disp=0&help=1&authKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API 요청에 실패했습니다. 상태 코드: ${response.status}`);
        const textData = await response.text(); // 텍스트 데이터로 응답 받음

        // 텍스트 데이터를 줄 단위로 분리하여 필요한 정보 추출
        const weatherData = textData.split('\n').reduce((acc, line) => {
            // 정규 표현식을 사용하여 필요한 데이터 추출, 예제는 기온(TA)과 하늘 상태(SKY)를 대상으로 합니다.
            // 정확한 필드 위치를 알아야 정규 표현식을 작성할 수 있습니다.
            const regex = /11A00101\s+\S+\s+\S+\s+\S+\s+\d+\s+\d+\s+\d+\s+\S+\s+\S+\s+\S+\s+\d+\s+\S+\s+(-?\d+)\s+\S+\s+(\d+)\s+(\S+)\s+(\d+)/;
            const match = regex.exec(line);
            if (match) {
                // 추출된 데이터를 배열에 추가
                acc.push({ temperature: match[1], skyCondition: match[3] });
            }
            return acc;
        }, []);

        // res.json({ data: weatherData });
        res.send(textData);
        console.log(weatherData)
    } catch (error) {
        console.error('날씨 정보 조회 중 오류 발생:', error);
        res.status(500).send('날씨 정보 조회 중 오류가 발생했습니다.');
    }
});

app.listen(port, () => console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`));