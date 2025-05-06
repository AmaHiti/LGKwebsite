import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="fooetr-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Your premier destination for quality agricultural products, expert
            guidance, and innovative solutions. Serving with dedication and
            excellence
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="fooetr-content-center">
            <h2>TFC Resturent</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+94704027700</li>
            <li>lifesgoodkitchen@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">© 2024 Copyright:Ama Hitiarachchi</p>
    </div>
  );
};

export default Footer;
