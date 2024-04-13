import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import authService from "../api/AuthService.js";

function BoardList() {
    const [boardList, setBoardList] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [page, setPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
            const params = { page: page - 1, size: 10, search: searchVal };
            const response = await authService.get("board", params);
            setBoardList(response.data.content || []);
            setTotalItemsCount(response.data.totalElements);
            setTotalItemsCount(response.data.totalElements);
        } catch (error) {
            console.error("Error fetching board list:", error);
            setBoardList([]);
            setTotalItemsCount(0);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, [page, searchVal]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchVal(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBoards();
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <Form onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2"
                            value={searchVal}
                            onChange={handleSearchChange}
                        />
                        <Button variant="secondary" type="submit">Search</Button>
                    </Form>
                </Col>
                <Col className="text-right">
                    <Button variant="primary" onClick={() => navigate('/board/create')}>글 작성</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th className="boardId">#</th>
                        <th className="title">제목</th>
                        <th className="writerName">작성자</th>
                        <th className="viewCount">조회수</th>
                        <th className="createdDate">작성시간</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board, index) => (
                        <tr key={board.boardId}>
                            <td className="boardId">{index + 1}</td>
                            <td className="title">
                                <Link to={`/board/${board.boardId}`}>{board.title}</Link>
                            </td>
                            <td className="writerName">{board.writerName}</td>
                            <td className="viewCount">{board.viewCount}</td>
                            <td className="createdDate">{board.createdDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
            <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
            />
        </Container>
    );
}

export default BoardList;