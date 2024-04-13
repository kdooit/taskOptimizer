import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.js';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const savedSidebarState = sessionStorage.getItem('sidebarState') === 'true';
        setIsSidebarOpen(savedSidebarState);
    }, []);
    return (
        <div className="sidebar-container">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className={isSidebarOpen ? "main-content expanded" : "main-content"}>
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;