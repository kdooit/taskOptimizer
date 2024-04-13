import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout.js';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = Boolean(sessionStorage.getItem('token'));
    return isLoggedIn ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export default ProtectedRoute;