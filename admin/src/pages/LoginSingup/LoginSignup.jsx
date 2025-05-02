import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

const AdminLoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/admin/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setRedirectTo('/add');
        clearFields();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/admin/register', { username, email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setRedirectTo('/add');
        clearFields();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setUsername('');
  };

  if (redirectTo) {
    window.location.href = redirectTo;
  }

  const navigateToSignup = () => {
    setIsLogin(false);
    setError(''); 
  };
  

  return (
    <div className="login-signup">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      {isLogin ? (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <span onClick={navigateToSignup} className="span">Signup here</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Signup</button>
          <p>
            Already have an account? <span onClick={() => setIsLogin(true)} className="span">Login here</span>
          </p>
        </form>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AdminLoginSignup;
