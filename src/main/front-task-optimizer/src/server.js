const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // 환경 변수 로드

// AuthService 경로와 db 모듈 경로에 따라 수정 필요
const AuthService = require('./api/AuthService');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000; // 포트 설정도 환경 변수에서 가져오기

// AuthService 인스턴스 생성, DB 연결 인스턴스 전달
const authService = new AuthService(db);

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(bodyParser.json());

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

app.listen(port, () => console.log(`Server running on port ${port}`));