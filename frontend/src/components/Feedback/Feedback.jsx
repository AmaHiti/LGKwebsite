import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContex';
import "./Feedback.css"
import { assets } from '../../assets/assets';

const SubmitFeedback = () => {
  const { addFeedback } = useContext(StoreContext);  
  const [feedbackText, setFeedbackText] = useState('');
  const [c_name, setc_name] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (token) {
        await addFeedback(feedbackText, c_name);  
        setSuccessMessage('Thank You For Your Feedback');
        setFeedbackText('');
        setc_name('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);  
      } else {
        setErrorMessage('Please Login to Feedback');
        setTimeout(() => {
            setErrorMessage('');
          }, 2000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <>
      <div className="feedback-container">
        <img src={assets.TFC} alt="" className='image' />
       
        <div className="form-overlay">
          <div className='feedback-form'>
            <h1>Your Feedback</h1>
            <form onSubmit={handleSubmit}>
              <div className='from-inputs'>
                <input id="c_name" value={c_name} onChange={(e) => setc_name(e.target.value)} type="text" required placeholder='Your Name'/>
                <textarea
                  id="feedbackText"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  placeholder='Type Here'
                ></textarea>
              </div>
              <button className='s-button' type="submit">Submit Feedback</button>
            </form>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitFeedback;
