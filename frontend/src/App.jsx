import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import PlaceOder from './pages/PlaceOder/PlaceOder'
import Home from './pages/Home/Home'
import MyOrder from './pages/MyOrder/MyOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import SubmitFeedback from './components/Feedback/Feedback'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const [showLogin,setShowLogin] = useState(false)

  return (<>
       <ToastContainer/>
  {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
  <Navbar setShowLogin={setShowLogin}/>
  
    <div className="app">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOder/>}/>
        <Route path='/myorder' element = {<MyOrder/>}/>
      </Routes>
    </div>
    <SubmitFeedback/>
    <Footer/>
    </>
  )
}

export default App