import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Container } from 'react-bootstrap';

function FindAccount() {
    const [email, setEmail] = useState('');
    const [option, setOption] = useState('');
    const [showError, setShowError] = useState(false);

    const handleOptionClick = (selectedOption) => {
        setOption(selectedOption);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { email, option };

        try {
            // 여기에 API 호출 코드를 추가하여 아이디 또는 비밀번호 찾기를 수행합니다.
            if (option === 'id') {
                // 아이디 찾기를 수행하는 코드
                alert('아이디 찾기를 수행합니다.');
            } else if (option === 'password') {
                // 비밀번호 찾기를 수행하는 코드
                alert('비밀번호 찾기를 수행합니다.');
            }
        } catch (error) {
            console.error('Find account error:', error);
            setShowError(true);
        }
    };

    const handleClose = () => setShowError(false);

    return (
        <div className="form-wrapper">
            <Container className="form-container">
                <h4 style={{ color: 'var(--blue-gray)', fontWeight: 'bold', marginBottom: '30px'}}>계정 찾기</h4>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }}>
                            <p
                                className={option === 'id' ? 'find-option active' : 'find-option'}
                                onClick={() => handleOptionClick('id')}
                                style={{ display: 'inline-block', marginRight: '20px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--blue-gray)' }}
                            >
                                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>아이디 찾기</Link>
                            </p>
                            <p
                                className={option === 'password' ? 'find-option active' : 'find-option'}
                                onClick={() => handleOptionClick('password')}
                                style={{ display: 'inline-block', cursor: 'pointer', fontWeight: 'bold', color: 'var(--blue-gray)' }}
                            >
                                <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>비밀번호 찾기</Link>
                            </p>
                        </Col>
                    </Row>

                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm={{ span: 10, offset: 1 }} style={{ color: 'var(--blue-gray)', fontWeight: 'bold', textAlign: 'left' }}>
                            이메일:
                        </Form.Label>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }}  style={{ color: 'var(--blue-gray)', marginTop: '10px' }}>
                            <Button variant="secondary" type="submit" className="w-100">
                                {option === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }} style={{ marginTop: '20px' }}>
                            <Link to="/" style={{ color: 'var(--blue-gray)' }}>로그인으로 돌아가기</Link>
                        </Col>
                    </Row>
                </Form>

                {/* 에러 모달 */}
                <Modal show={showError} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>오류</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>오류가 발생했습니다. 다시 시도해주세요.</Modal.Body>
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

export default FindAccount;