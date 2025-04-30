import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import OrderConfirmation from "./Pages/OrderConfirmation";
// App.jsx
import React from "react";

const App = () => {
  return (
    <Router>
      <CustomNavbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/checkout" element={<Checkout />} />
        
      
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;