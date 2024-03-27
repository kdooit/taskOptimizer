const mysql = require('mysql');
const dbConfig = { /* 환경 변수에서 로드한 설정 사용 */ };

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;