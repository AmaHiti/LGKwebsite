import "bootstrap/dist/css/bootstrap.min.css";

import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaSnapchat, FaTiktok } from "react-icons/fa";

import React from "react";

const Footer = () => {
  return (
    <>
      {/* Location Section */}
      <div className="bg-light py-5 text-center">
        <h2>Our Location</h2>
        <p>Find us at:</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2839.9355077865716!2d79.86266246796912!3d6.892771716925465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259b06182f68d%3A0xabc7b34a80b660b0!2sLife%E2%80%99s%20Good%20Kitchen!5e0!3m2!1sen!2slk!4v1741447584809!5m2!1sen!2slk"
          width="100%"
          height="350"
          style={{ border: "0", maxWidth: "600px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row className="g-4">
            {/* Logo and Social Media */}
            <Col md={3}>
              <img
                src="https://res.cloudinary.com/dpl2srwzl/image/upload/v1742004400/logo.jpg" // Replace with your logo path
                alt="Life's Good Kitchen"
                width="100"
                height="100"
                className="mb-3"
              />
              <h4>Follow Us On</h4>
              <div className="d-flex gap-3">
                <a href="#" className="text-white">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-white">
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="text-white">
                  <FaTiktok size={24} />
                </a>
                <a href="#" className="text-white">
                  <FaSnapchat size={24} />
                </a>
              </div>
            </Col>

            {/* Legal Pages */}
            <Col md={3}>
              <h4>Legal Pages</h4>
              <ul className="list-unstyled">
                <li>
                  <a href="/terms" className="text-white text-decoration-none">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-white text-decoration-none">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-white text-decoration-none">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="/modern-slavery" className="text-white text-decoration-none">
                    Modern Slavery Statement
                  </a>
                </li>
              </ul>
            </Col>

            {/* Address */}
            <Col md={3}>
              <h4>Address</h4>
              <address>
                <p>2 Suleiman Terrace</p>
                <p>Jawatta Road</p>
                <p>Colombo 5</p>
              </address>
            </Col>

            {/* Company Info */}
            <Col md={3}>
              <h4>Company Info</h4>
              <p>Company # 490039-445</p>
              <p>Registered with House of Companies</p>
            </Col>
          </Row>

          {/* Footer Bottom */}
          <Row className="mt-4 pt-3 border-top">
            <Col className="text-center">
              <p>&copy; 2024 All Rights Reserved</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/privacy-policy" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-white text-decoration-none">
                  Terms
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;