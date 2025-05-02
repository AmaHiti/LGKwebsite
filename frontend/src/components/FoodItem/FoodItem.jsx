import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../context/StoreContex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);
  const [showNutrition, setShowNutrition] = useState(false);

  const toggleNutritionPopup = () => {
    setShowNutrition(!showNutrition);
  };

  const handleAddToCart = () => {
    if (token) {
      addToCart(id);
    } else {
      toast.error("You need to be logged in to add items to the cart.", {
        
      });
    }
  };

  const formatDescription = (description) => {
    
    const items = description.split(';');

    
    return items.map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={`${url}/images/${image}`} alt="" />
        {!cartItems[id] ? (
          <img className="add" onClick={handleAddToCart} src={assets.add_icon_white} alt="" />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-price">Rs.{price}</p>
        <button className="view-nutrition-button" onClick={toggleNutritionPopup}>
          View Nutrition
        </button>
        {showNutrition && (
          <div className="nutrition-popup">
            <div className="nutrition-popup-content">
              
              {formatDescription(description)}
              <button className="close-button" onClick={toggleNutritionPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
