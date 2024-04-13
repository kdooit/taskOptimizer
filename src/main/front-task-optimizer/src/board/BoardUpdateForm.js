import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import authService from "../api/AuthService.js";

const API_URL = 'http://localhost:8080/api';

function BoardUpdateForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // 컴포넌트 마운트 시 게시글의 현재 내용을 불러옴
        const fetchBoardDetails = async () => {
            try {
                const response = await authService.get(`board/${id}`);
                const { title, content } = response.data;
                setTitle(title);
                setContent(content);
            } catch (error) {
                console.error('게시글 정보를 불러오는 중 오류가 발생했습니다.', error);
                alert('게시글 정보를 불러오는 데 실패하였습니다.');
            }
        };

        fetchBoardDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.put(`board/${id}`, { title, content });
            alert('게시글이 성공적으로 수정되었습니다.');
            navigate(`/board/${id}`);
        } catch (error) {
            console.log('Error Response:', error.response);
            console.error('게시글 수정 중 오류가 발생했습니다.', error);
            alert('게시글 수정에 실패하였습니다.');
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2>게시글 수정</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <Form.Label>제목</Form.Label>
                            <Form.Control type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicContent">
                            <Form.Label>내용</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            수정하기
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default BoardUpdateForm;