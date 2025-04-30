import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Oders from './pages/Order/Oders';
import AdminLoginSignup from './pages/LoginSingup/LoginSignup';
import FeedbackList from './pages/Feedback/Feedback';
import UserList from './pages/Users/Users';
import TopSellingChart from './pages/Report/Report';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // <-- for layout styles

const App = () => {
  const url = "http://localhost:4000";
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isLoginPage = location.pathname === "/";

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {!isLoginPage && isLoggedIn && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      <div className="main-section">
        <ToastContainer />
        {!isLoginPage && isLoggedIn && (
          <Navbar isSidebarCollapsed={isSidebarCollapsed} />
        )}

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/add" /> : <AdminLoginSignup />
            }
          />
          <Route
            path="/add"
            element={
              isLoggedIn ? <Add url={url} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/list"
            element={
              isLoggedIn ? <List url={url} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/orders"
            element={
              isLoggedIn ? <Oders url={url} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/feedback"
            element={
              isLoggedIn ? <FeedbackList url={url} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/users"
            element={
              isLoggedIn ? <UserList url={url} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/report"
            element={
              isLoggedIn ? <TopSellingChart url={url} /> : <Navigate to="/" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
