import './AuthModal.css'

import { Alert, Button, Form, Modal } from "react-bootstrap";
import React, { useState } from "react";

const AuthModal = ({ show, onHide }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
    const body = isLogin
      ? { email, password }
      : { name, email, phone, password };

    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        onHide(); // Close the modal
        window.location.reload(); // Refresh the page to update the UI
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? "Login" : "Signup"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Name Field (Signup Only) */}
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Phone Number Field (Signup Only) */}
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {/* Password Field */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Confirm Password Field (Signup Only) */}
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit" className="w-100">
            {isLogin ? "Login" : "Signup"}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Signup"
              : "Already have an account? Login"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;