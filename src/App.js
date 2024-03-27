import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';
import Login from './components/Login';
import SignIn from './components/SignIn';
import FindAccount from './components/FindAccount';
import ErrorPage from './components/ErrorPage';
import Mypage from "./components/Mypage";
import BoardList from "./board/BoardList";
import BoardCreateForm from "./board/BoardCreateForm";
import Calendar from "./schedule/Calendar";

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
                    <Route path="home" element={<div>Home Page Content</div>} />
                    <Route path="scrap-board" element={<BoardList />} />
                    <Route path="board/create" element={<BoardCreateForm />} />
                    <Route path="schedule" element={<Calendar />} />
                    <Route path="mypage" element={<Mypage />} />
                    <Route path="deleteAccount" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;