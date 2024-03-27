import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Container } from 'react-bootstrap';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 로그인 상태 확인
        const token = sessionStorage.getItem('token');
        // 현재 경로가 로그인 페이지가 아니거나 토큰이 없을 때만 리디렉션을 실행
        if (token && location.pathname === '/login') {
            navigate('/home');
        }
    }, [navigate, location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userdata = { email, password };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userdata),
            });

            const data = await response.json(); // 서버 응답에서 JSON 데이터를 파싱합니다.

            if (response.ok) {
                // 로그인 성공 시, 받은 토큰을 sessionStorage에 저장합니다.
                sessionStorage.setItem('token', data.accessToken); // 'token'은 서버 응답에서 받은 인증 토큰의 키입니다.
                navigate('/home'); // 로그인 성공 시 홈 페이지로 리다이렉션합니다.
            } else {
                throw new Error(data.message || '로그인 실패'); // 서버에서 보낸 에러 메시지 또는 기본 메시지를 사용합니다.
            }
        } catch (error) {
            console.error('Login error:', error);
            setShowError(true); // 로그인 실패 시 에러 메시지를 표시합니다.
        }
    };

    // 모달 창을 닫는 함수입니다.
    const handleClose = () => setShowError(false);

    return (
        <div className="form-wrapper">
            <Container className="form-container">
                <h3 style={{ color: 'var(--blue-gray)' }}>WorkOn!</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', textAlign: 'left' }}>
                            E-mail:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', textAlign: 'left' }}>
                            Password:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '10px' }}>
                            <Button variant="secondary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Col>
                    </Row>
                    {/*<Row className="mb-3">*/}
                    {/*    <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '-10px' }}>*/}
                    {/*        <Button variant="primary" onClick={() => window.location.href=`${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/google`} className="w-100">*/}
                    {/*            Google로 로그인*/}
                    {/*        </Button>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '20px' }}>
                            <Link to="/join">회원가입</Link>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '10px' }}>
                            <Link to="/find-account">아이디 / 비밀번호 찾기</Link>
                        </Col>
                    </Row>
                </Form>

                {/* 로그인 실패 모달 */}
                <Modal show={showError} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>로그인 실패</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>로그인에 실패했습니다. 정보를 확인하고 다시 시도해주세요.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            닫기
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default Login;