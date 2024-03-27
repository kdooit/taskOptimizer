import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [memberName, setMemberName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setShowError(true);
            return;
        }

        const userData = {
            email: email,
            memberName: memberName,
            password: password,
        };

        try {
            await axios.post('/api/auth/signup', userData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            setShowError(true);
        }

    };

    const handleClose = () => setShowError(false);

    return (
        <div className="form-wrapper">
            <Container className="form-container">
                <h4 style={{ color: 'var(--blue-gray)', fontWeight: 'bold', marginBottom: '30px'}}>회원가입</h4>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', fontWeight: 'bold', textAlign: 'left' }}>
                            이메일:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="email"
                                id="formBasicEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                                required
                            />
                        </Col>
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', fontWeight: 'bold', textAlign: 'left' }}>
                            이름:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="text"
                                id="formBasicName"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                placeholder="이름"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', fontWeight: 'bold', textAlign: 'left' }}>
                            비밀번호:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', fontWeight: 'bold', textAlign: 'left' }}>
                            비밀번호 확인:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 확인"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }}  style={{ color: 'var(--blue-gray)', marginTop: '10px' }}>
                            <Button variant="secondary" type="submit" className="w-100">
                                회원가입
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '10px' }}>
                            <Link to="/login" style={{ color: 'var(--blue-gray)' }}>이미 계정이 있으신가요? 로그인 하기</Link>
                        </Col>
                    </Row>
                </Form>

                {/* 에러 모달 */}
                <Modal show={showError} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>오류</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{errorMessage}</Modal.Body>
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

export default SignUpForm;