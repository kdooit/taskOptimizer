import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Dashboard.css';
import WeatherComponent from "./WeatherComponent.js";

function Dashboard() {
    return (
        <Container fluid className="dashboard">
            <Row className="g-4">
                <Col md={6} lg={4} className="content-large"><WeatherComponent /></Col>
                <Col md={6} lg={8} className="content-large">뉴스 컴포넌트</Col>

                <Col md={6} lg={4} className="content-small">옷차림 추천 컴포넌트</Col>
                <Col md={6} lg={8} className="content-small">즐겨찾기 컴포넌트</Col>

                <Col md={6} lg={4} className="content-xlarge">캘린더 컴포넌트</Col>
                <Col md={6} lg={8} className="content-xlarge">일정 관리 컴포넌트</Col>
            </Row>
        </Container>
    );
}

export default Dashboard;