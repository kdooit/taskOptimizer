import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../api/AuthService';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/sidebarSlice'
import { Container, Nav } from 'react-bootstrap';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import '../common/sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showComponentManagement, setShowComponentManagement] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            setIsAdmin(payload.auth === 'ROLE_ADMIN');
        }
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login', { replace: true });
    };

    const toggleText = isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar';

    return (
        <div className="dashboard-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <Nav className="flex-column">
                    {isAdmin ? (
                        <>
                            <Nav.Link href="/member-management">회원 관리</Nav.Link>
                            <div className="custom-link"
                                 onClick={() => setShowComponentManagement(!showComponentManagement)}>
                                구성요소 관리
                            </div>
                            {showComponentManagement && (
                                <div className="sub-menu">
                                    <Nav.Link href="/newsletter-management">뉴스레터 관리</Nav.Link>
                                    <Nav.Link href="/calendar-management">캘린더 관리</Nav.Link>
                                    <Nav.Link href="/schedule-management">일정 관리</Nav.Link>
                                    <Nav.Link href="/weather-management">날씨 관리</Nav.Link>
                                </div>
                            )}
                            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link href="/home">대시보드</Nav.Link>
                            <Nav.Link href="/schedule">상세 일정</Nav.Link>
                            <Nav.Link href="/board">스크랩보드</Nav.Link>
                            <Nav.Link href="/mypage">내 정보 수정</Nav.Link>
                            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                        </>
                    )}
                </Nav>
            </div>
            <div className="sidebar-toggle" data-toggle-text={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                 onClick={() => dispatch(toggleSidebar())}>
                {isSidebarOpen ? <FiChevronLeft size={24} color="var(--blue-gray)"/> :
                    <FiChevronRight size={24} color="var(--blue-gray)"/>}
            </div>
            <div className={`main-content ${isSidebarOpen ? "expanded" : ""}`}>
                <Container fluid>
                    {/* 대시보드의 메인 콘텐츠가 여기에 위치 */}
                </Container>
            </div>
        </div>
    );
}

export default Sidebar;