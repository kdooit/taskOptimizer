import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from "../api/AuthService";

function BoardCreateForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.post('board', { title, content });
            alert('게시글이 성공적으로 작성되었습니다.');
            navigate('/board'); // 게시글 목록 페이지로 리디렉션
        } catch (error) {
            console.error('게시글 작성 중 오류가 발생했습니다.', error);
            alert('게시글 작성에 실패하였습니다.');
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2>게시글 작성</h2>
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
                            작성하기
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default BoardCreateForm;