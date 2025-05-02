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

    useEffect(() => {
       
        
    }, [token, navigate]);

    const logout = () => {
        const cartAmount = getTotalCartAmount();
        if (cartAmount > 0) {
            toast.error('Please Clear Cart to Logout');
        } else {
            localStorage.removeItem('token');
            setToken('');
            navigate('/');
        }
    };

    return (
        <div className="navbar">
            <Link to="./">
                <img src={assets.logo} alt="" className="logo" />
            </Link>
            <h1 className="logo-text">TFC Restaurant</h1>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
                    Home
                </Link>
                <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
                    Menu
                </a>
                <a href="#pricing" onClick={() => setMenu('about-us')} className={menu === 'offers' ? 'active' : ''}>
                    Offers
                </a>
                <a href="#footer" onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>
                    Contact us
                </a>
            </ul>
            <div className="navbar-right">
                {token ? (
                    <div className="navbar-search-icon">
                        {currentPage !== '/order' && (
                            <Link to="/cart">
                                <img src={assets.basket_icon} alt="" className="a" />
                                {getTotalCartAmount() > 0 && currentPage !== '/order' && <div className="cart-dot"></div>}
                            </Link>
                        )}
                    </div>
                ) : null}
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="" className="b" />
                        <ul className="nav-profile-dropdown">
                            <li>
                                <Link to='./myorder'>
                                    <img src={assets.bag_icon} alt="" />
                                    <p>My Orders</p>
                                </Link>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p>
                            </li>
                            <hr />
                            <button onClick={deleteUser}>Delete Account</button>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
