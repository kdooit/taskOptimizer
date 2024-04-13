import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from 'react-bootstrap';
import authService from "../api/AuthService.js";

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

    const handleDelete = async ()=>{
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                await authService.delete(`board/${id}`);
                navigate(`/board`)
            } catch(error) {

            }
        }

    }
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
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
        </Container>
    );
}

export default BoardDetail;