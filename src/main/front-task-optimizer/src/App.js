import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute.js';

import Layout from './components/Layout.js';
import Login from './components/Login.js';
import SignIn from './components/SignIn.js';
import FindAccount from './components/FindAccount.js';
import ErrorPage from './components/ErrorPage.js';
import Mypage from "./components/Mypage.js";
import Dashboard from "./dashboard/Dashboard.js";
import WeatherComponent from "./dashboard/WeatherComponent.js";
import BoardList from "./board/BoardList.js";
import BoardCreateForm from "./board/BoardCreateForm.js";
import BoardUpdateForm from "./board/BoardUpdateForm.js";
import BoardDetail from "./board/BoardDetail.js";
import Calendar from "./schedule/Calendar.js";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<SignIn />} />
                <Route path="/find-account" element={<FindAccount />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="home" element={<Dashboard />} />
                    <Route path="home" element={<WeatherComponent />} />
                    <Route path="board" element={<BoardList />} />
                    <Route path="board/create" element={<BoardCreateForm />} />
                    <Route path="board/edit/:id" element={<BoardUpdateForm />} />
                    <Route path="board/:id" element={<BoardDetail />} />
                    <Route path="schedule" element={<Calendar />} />
                    <Route path="mypage" element={<Mypage />} />
                    <Route path="deleteAccount" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;