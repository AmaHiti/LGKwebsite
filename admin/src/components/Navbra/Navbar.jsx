import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isCollapsed }) => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  return (
    <div className={`navbar ${isCollapsed ? 'expanded' : ''}`}>
      <img src={assets.logo} alt="logo" className="logo" />
      <div className="admin-section">
        <h2>Life's Good Kitchen</h2>
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
      <img src={assets.profile_image} alt="profile" className="profile" />
    </div>
  );
};

export default Navbar;
