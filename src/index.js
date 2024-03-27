import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import axios from 'axios';

import AuthService from './api/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            AuthService.logout(); // 사용자 로그아웃 처리
            window.location = '/'; // 로그인 페이지로 리다이렉션
        }
        return Promise.reject(error);
    }
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
