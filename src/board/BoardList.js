import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";

function BoardList() {
    const [boardList, setBoardList] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [page, setPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const navigate = useNavigate();

    const fetchBoards = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/board`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { page: page - 1, size: 10, search: searchVal },
            });
            setBoardList(response.data.content || []); //응답 데이터가 없는 경우 빈 배열 할당
            setTotalItemsCount(response.data.totalElements);
        } catch (error) {
            console.error("Error fetching board list:", error);
            setBoardList([]); // 에러 발생 시 boardList를 빈 배열로 설정
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
                        <th>#</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board, index) => (
                        <tr key={board.id}>
                            <td>{index + 1}</td>
                            <td>{board.title}</td>
                            <td>
                                <Button variant="secondary" size="sm" as={Link} to={`/board/${board.id}`}>View</Button>
                            </td>
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