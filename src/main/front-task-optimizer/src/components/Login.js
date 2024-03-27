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
        const token = sessionStorage.getItem('token');
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
            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('token', data.accessToken);
                navigate('/home');
            } else {
                const errorData = await response.json();
                console.error('Login error:', errorData.message);
                setShowError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setShowError(true);
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