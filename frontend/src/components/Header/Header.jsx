import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <p className="tagline">FRESH, HEALTHY AND DELICIOUS</p>
        <h1 className="title">HEALTHY GREENS</h1>
        <button className="order-button">ORDER ONLINE DIRECT</button>
      </div>
    </div>
  )
}

export default Header;