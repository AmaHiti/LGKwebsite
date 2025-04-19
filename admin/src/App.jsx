import React from 'react';
import Navbar from './components/Navbra/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Oders from './pages/Order/Oders';
import Reservations from './pages/Reservation/Reservations';
import AdminLoginSignup from './pages/LoginSingup/LoginSignup';
import { ToastContainer } from 'react-toastify';
import FeedbackList from './pages/Feedback/Feedback';
import UserList from './pages/Users/Users';
import 'react-toastify/dist/ReactToastify.css';
import TopSellingChart from './pages/Report/Report';

const App = () => {
  const url = "http://localhost:4000";
  const location = useLocation();

  
  const shouldDisplayNavbarAndSidebar = () => {
    return location.pathname !== "/";
  };

  return (
    <div>
      <ToastContainer />
      {shouldDisplayNavbarAndSidebar() && <Navbar />}
      <hr />
      <div className="app-content">
        {shouldDisplayNavbarAndSidebar() && <Sidebar />}
        <Routes>
         
        <Route path="/" element={<AdminLoginSignup url={url} />} />
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
