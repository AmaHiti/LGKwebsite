import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="side-bar">
        <div className="side-bar-options">
            <NavLink to='/add'className="side-bar-option">
                <img src={ assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list'className="side-bar-option">
                <img src={ assets.list_icon} alt="" />
                <p>List Items</p>
            </NavLink>
            <NavLink to='/orders' className="side-bar-option">
                <img src={ assets.order_icon} alt="" className='b'/>
                <p>Orders</p>
            </NavLink>
            <NavLink to='/feedback' className="side-bar-option">
                <img src={ assets.feedback_icon} alt="" />
                <p>Feedback</p>
            </NavLink>
            <NavLink to='/users' className="side-bar-option">
                <img src={ assets.user_icon} alt="" className='a' />
                <p>Users Accounts</p>
            </NavLink>
        </div>
    </div>
  );
};

export default Sidebar;
