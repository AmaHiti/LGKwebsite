import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Cart from './pages/Cart/Cart';
import PlaceOder from './pages/PlaceOder/PlaceOder';
import Home from './pages/Home/Home';
import MyOrder from './pages/MyOrder/MyOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import SubmitFeedback from './components/Feedback/Feedback';
import MenuPage from './pages/Menu/MenuPage'; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  // This state will store the foods data fetched from the backend
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch food items from the backend
  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/food/list');
      const data = await response.json();
      if (response.ok) {
        setFoods(data.foods); // Assuming the response contains a "foods" array
        setLoading(false);
      } else {
        setError('Error fetching foods');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error');
      setLoading(false);
    }
  };

  // Fetch the food items when the component mounts
  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <>
      <ToastContainer />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />

      <div className="app">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOder />} />
          <Route path='/myorder' element={<MyOrder />} />
          <Route path='/menu' element={<MenuPage foods={foods} loading={loading} error={error} />} />
        </Routes>
      </div>

      <SubmitFeedback />
      <Footer />
    </>
  );
};

export default App;
