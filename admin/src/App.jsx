import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Oders from './pages/Order/Oders';
import Reservations from './pages/Reservation/Reservations';
import FeedbackList from './pages/Feedback/Feedback';
import UserList from './pages/Users/Users';
import TopSellingChart from './pages/Report/Report';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const url = "http://localhost:4000";

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded credentials
    if (username === 'admin' && password === '1234') {
      setLoggedIn(true);
    } else {
      setError('Invalid username or password');
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-signup">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="main-section">
        <ToastContainer />
        <Navbar isSidebarCollapsed={isSidebarCollapsed} />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Oders url={url} />} />
          <Route path="/reservations" element={<Reservations url={url} />} />
          <Route path="/feedback" element={<FeedbackList url={url} />} />
          <Route path="/users" element={<UserList url={url} />} />
          <Route path="/report" element={<TopSellingChart url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
