import React, { useContext } from "react";
import "./OfferFooditem.css";
import { StoreContext } from "../context/StoreContex";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfferFoodItem = ({ id, name, price, image }) => {
  const { cartItems, addToCart, token, url } = useContext(StoreContext);

  const handleAddToCart = () => {
    if (token) {
      addToCart(id);
    } else {
      toast.error("You need to be logged in to add items to the cart.", {});
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt=""
        />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
      </div>
      <div className="buy-now-container">
        {!cartItems[id] && (
          <button className="buy-now" onClick={handleAddToCart}>
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferFoodItem;
