import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('menu');
  const { token, setToken, deleteUser, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const logout = () => {
    if (getTotalCartAmount() > 0) {
      toast.error('Please clear cart to logout');
    } else {
      localStorage.removeItem('token');
      setToken('');
      navigate('/');
    }
  };

  // Define background colors for different routes
  const routeBackgroundColors = {
    '/': 'rgba(0, 0, 0, 0.7)',
    '/about': 'rgba(255, 255, 255, 0.7)',
    '/contact': 'rgba(0, 0, 0, 0.7)',
    // Add more routes and their corresponding background colors as needed
  };

  // Determine the background color based on the current route
  const navbarStyle = {
    background: routeBackgroundColors[currentPage] || 'rgba(0, 0, 0, 0.7)',
  };

  return (
    <div className="navbar" style={navbarStyle}>
      <div className="navbar-left">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="logo" />
        </Link>
        <h1 className="logo-text">Life's Good Kitchen</h1>
      </div>

      <ul className="navbar-menu">
        <li>
          <Link 
            to="/" 
            onClick={() => setMenu('home')} 
            className={menu === 'home' ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/menu" 
            onClick={() => setMenu('menu')} 
            className={menu === 'menu' ? 'active' : ''}
          >
            Menu
          </Link>
        </li>
        <li>
          <Link 
            to="/offers" 
            onClick={() => setMenu('offers')} 
            className={menu === 'offers' ? 'active' : ''}
          >
            Offers
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            onClick={() => setMenu('contact-us')} 
            className={menu === 'contact-us' ? 'active' : ''}
          >
            Contact Us
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        {token && currentPage !== '/order' && (
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="cart" className="a" />
              {getTotalCartAmount() > 0 && <div className="cart-dot"></div>}
            </Link>
          </div>
        )}

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" className="b" />
            <div className="nav-profile-dropdown">
              <ul>
                <li>
                  <Link to="/myorder">
                    <img src={assets.bag_icon} alt="orders" />
                    <p>My Orders</p>
                  </Link>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="logout" />
                  <p>Logout</p>
                </li>
                <hr />
                <button onClick={deleteUser}>Delete Account</button>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
