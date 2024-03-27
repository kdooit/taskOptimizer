import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from 'react-bootstrap';
import authService from "../api/AuthService";

function BoardDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await authService.get(`board/${id}`);
                setBoard(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching board details:", error);
            }
        };

        fetchBoardDetail();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h2>{board.title}</h2>
            <p>작성자: {board.writerName}</p>
            <p>조회수: {board.viewCount}</p>
            <p>작성시간: {board.createdDate}</p>
            <div>{board.content}</div>
            <Button variant="primary" onClick={() => navigate(`/board/edit/${id}`)}>수정</Button>
            <Button variant="danger" onClick={() => {
                // 여기에 삭제 로직 구현
            }}>삭제</Button>
            {/* 댓글 기능 구현 */}
        </Container>
    );
}

export default BoardDetail;