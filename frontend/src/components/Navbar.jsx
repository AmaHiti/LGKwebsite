import './Navbar.css'

import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { FaBars, FaSearch, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import React, { useState } from "react";

import AuthModal from "./AuthModal";

const CustomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // Check if token exists
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload(); // Refresh the page to update the UI
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          {/* Logo */}
          <Navbar.Brand href="/">
            <img
              src="https://res.cloudinary.com/dpl2srwzl/image/upload/v1742004400/logo.jpg" // Replace with your logo path
              alt="Life's Good Kitchen"
              width="100"
              height="100"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <Navbar.Toggle
            aria-controls="navbar-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </Navbar.Toggle>

          {/* Navigation Links */}
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/browse-menu">Browse Menu</Nav.Link>
              <Nav.Link href="/about-us">About Us</Nav.Link>
              <Nav.Link href="/reservations">Reservations</Nav.Link>
              <Nav.Link href="/track-order">Track Order</Nav.Link>
              <Nav.Link href="/feedback">Feedback</Nav.Link>
              <Nav.Link href="/contact-us">Contact Us</Nav.Link>
            </Nav>

            {/* Right Icons */}
            <div className="d-flex align-items-center ms-3">
              <Button variant="light" className="me-2">
                <FaSearch />
              </Button>
              <Button variant="light" className="me-2">
                <FaShoppingCart />
              </Button>

              {/* Show User Icon or Login/Signup based on isLoggedIn */}
              {isLoggedIn ? (
                <div className="d-flex align-items-center">
                  <Button variant="light" className="me-2">
                    <FaUser />
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="primary" onClick={() => setShowAuthModal(true)}>
                  Login/Signup
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </>
  );
};

export default CustomNavbar;