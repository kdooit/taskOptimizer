import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import authService from '../api/AuthService';

function Mypage() {
    const [userInfo, setUserInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        authService.getMyInfo()
            .then(response => {
                setUserInfo(prev => ({ ...prev, ...response.data }));
            })
            .catch(error => {
                console.error(error.message);
                navigate('/login');
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (userInfo.newPassword !== userInfo.confirmPassword) {
            setErrorMessage('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        authService.updateMyInfo({
            currentPassword: userInfo.currentPassword,
            newPassword: userInfo.newPassword,
        })
            .then(() => {
                alert('비밀번호가 수정되었습니다.');
                navigate('/home');
            })
            .catch(error => {
                console.error('Update error:', error);
                setErrorMessage('비밀번호 수정 오류입니다.');
            });
    };

    const handleDelete = () => {
        if (window.confirm('정말 회원을 탈퇴하시겠습니까?')) {
            authService.deleteAccount()
                .then(() => {
                    alert('회원 탈퇴에 성공했습니다.');
                    authService.logout(navigate);
                })
                .catch(error => {
                    console.error('Delete account error:', error);
                    setErrorMessage('회원 탈퇴 오류입니다.');
                });
        }
    };

    return (
        <Container className="mt-5 main-content">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h3 className="mt-5" >비밀번호 수정</h3>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mt-5" controlId="currentPassword">
                            <Form.Label>현재 비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="현재 비밀번호를 입력하세요"
                                name="currentPassword"
                                value={userInfo.currentPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-5" controlId="newPassword">
                            <Form.Label>새로운 비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="새로운 비밀번호를 입력하세요"
                                name="newPassword"
                                value={userInfo.newPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="confirmPassword">
                            <Form.Label>새로운 비밀번호 확인</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="새로운 비밀번호를 다시 입력하세요"
                                name="confirmPassword"
                                value={userInfo.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button className="mt-5" variant="secondary" type="submit">비밀번호 변경</Button>
                        <Button className="mt-5" variant="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                            회원 탈퇴
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Mypage;