import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  };
  
  return (
    <div className="navbar">
      <img src={assets.logo} alt="" className="logo" />
      
      <div className="admin-section">
        <p>Life's Good Kitchen</p>
      </div>
      
      <div className="profile-section">
        <img src={assets.profile_image} alt="" className="profile" />
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
};

export default Navbar;