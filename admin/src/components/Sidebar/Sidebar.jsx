import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={`side-bar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3 className={isCollapsed ? 'hidden' : ''}>Dashboard</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="side-bar-options">
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.add_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.list_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.order_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Orders</p>
        </NavLink>

        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.order_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Reservations</p>
        </NavLink>

        <NavLink
          to="/feedback"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.feedback_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Feedback</p>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.user_icon} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Customer Accounts</p>
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive ? 'side-bar-option active' : 'side-bar-option'
          }
        >
          <div className="icon-container">
            <img src={assets.i} alt="" />
          </div>
          <p className={isCollapsed ? 'hidden' : ''}>Analysis</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
