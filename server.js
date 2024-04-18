import dotenv from 'dotenv';
dotenv.config();  // 환경 변수 불러오기

import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import authService from "./src/main/front-task-optimizer/src/api/AuthService.js";
import path from 'path';

import { fileURLToPath } from 'url';
import open from 'open';

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES 모듈에서 __dirname 정의
const publicPath = path.join(__dirname, 'build'); // React 빌드 폴더 경로 지정

app.use(express.static(publicPath));

// 모든 도메인에서의 요청을 허용
app.use(cors());

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(bodyParser.json());
app.use(express.json());

// 정적 파일 제공 설정
app.use(express.static('build'));

// 모든 GET 요청을 index.html로 라우팅 (Single Page Application 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

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

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function transform(lat, lon) {
    const Re = 6371.00877; // 지구 반경(km)
    const grid = 5.0; // 격자 간격(km)
    const slat1 = 30.0; // 표준위도 1
    const slat2 = 60.0; // 표준위도 2
    const olon = 126.0; // 기준점 경도
    const olat = 38.0; // 기준점 위도
    const xo = 210 / grid; // 기준점 X좌표
    const yo = 675 / grid; // 기준점 Y좌표

    let sn = Math.tan(Math.PI * 0.25 + slat1 * 0.5 / 180 * Math.PI) / Math.tan(Math.PI * 0.25 + olat * 0.5 / 180 * Math.PI);
    sn = Math.log(Math.cos(deg2rad(olat)) / Math.cos(deg2rad(slat1))) / Math.log(sn);

    let sf = Math.tan(Math.PI * 0.25 + olat * 0.5 / 180 * Math.PI);
    sf = Math.pow(sf, sn) * Math.cos(deg2rad(olat)) / sn;

    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5 / 180 * Math.PI);
    ro = Re * sf / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * 0.5 / 180 * Math.PI);
    ra = Re * sf / Math.pow(ra, sn);
    let theta = lon - olon;
    if (theta > 180) theta -= 360;
    if (theta < -180) theta += 360;
    theta *= sn;

    let x = Math.floor(ra * Math.sin(deg2rad(theta)) + xo + 0.5);
    let y = Math.floor(ro - ra * Math.cos(deg2rad(theta)) + yo + 0.5);

    return { x, y };
}

//기상청 api 호출
app.get('/weather', async (req, res) => {
    console.log("Headers:", req.headers); // 헤더 로깅
    const { lat, lon, baseDate, baseTime } = req.query;
    const { nx, ny } = transform(parseFloat(lat), parseFloat(lon));

    const serviceKey = process.env.WEATHER_API_KEY;
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
    console.log(url)

    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`API 요청에 실패했습니다. 상태 코드: ${response.status}`);
        }
        const data = await response.json();
        res.json(data.response.body.items.item);
    } catch (error) {
        console.error("날씨 정보 조회 중 오류 발생:", error);
        res.status(500).send('날씨 정보 조회 중 오류가 발생했습니다.');
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}번 포트에서 실행 중입니다.`);
    open(`http://localhost:${port}`); // 자동으로 브라우저에서 주소 열기
});