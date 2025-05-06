import "./Cart.css";
import "react-toastify/dist/ReactToastify.css";

import React, { useContext, useState } from "react";

import { StoreContext } from "../../components/context/StoreContex";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    foodList,
    removeFromCart,
    getTotalCartAmount,
    url,
    clearCart,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const calculateDiscountedPrice = (item) => {
    let price = item.price;
    return price;
  };

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;
    foodList.forEach(item => {
      if (cartItems[item.FoodID] > 0) {
        totalDiscount += (item.price - calculateDiscountedPrice(item)) * cartItems[item.FoodID];
      }
    });
    return totalDiscount;
  };

  const createOrderDirectly = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const userId = localStorage.getItem("userId");
      const orderDetails = { 
        userId, 
        cartItems: Object.fromEntries(
          Object.entries(cartItems).filter(([_, quantity]) => quantity > 0)
        )
      };

      const response = await axios.post(`${url}/api/order/place`, orderDetails, {
        headers: { token },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const totalAmount = getTotalCartAmount();
      if (totalAmount > 0 && isChecked) {
        // Call the direct order creation function
        await createOrderDirectly();
        
        // Clear the cart after successful order creation
        clearCart();
        
        // Navigate to my orders page
        navigate("/myorder");
        
        toast.success("Order placed successfully!");
      } else {
        if (totalAmount <= 0) {
          toast.info("Your cart is empty. Please add items to proceed.");
        } else {
          toast.info(
            "Please agree to the terms of use & privacy policy to proceed."
          );
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!foodList || foodList.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Action</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if (cartItems[item.FoodID] > 0) {
            return (
              <div key={item.FoodID}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt="" />
                  <p>{item.name}</p>
                  <p>Rs.{calculateDiscountedPrice(item)}</p> 
                  <p>{cartItems[item.FoodID]}</p>
                  <p>{calculateDiscountedPrice(item) * cartItems[item.FoodID]}</p> 
                  <button
                    onClick={() => removeFromCart(item.FoodID)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Total Discount</p>
              <p>Rs.{calculateTotalDiscount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Service Charges</p>
              <p>Rs.{getTotalCartAmount() === 0 ? 0 : 200}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() - calculateTotalDiscount() + 200}
              </b>
            </div>
            <hr />
            <hr />
            <div className="login-popup-condition1">
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  required
                />
                <span>Once confirmed, the order cannot be modified.</span>
              </label>
            </div>
          </div>
          <button onClick={handleProceedToCheckout} disabled={!isChecked}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;