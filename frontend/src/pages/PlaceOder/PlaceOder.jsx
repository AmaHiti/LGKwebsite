import './PlaceOder.css';

import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContex";

const PlaceOrder = () => {
  const { getTotalCartAmount, foodList, cartItems, clearCart } = useContext(StoreContext);

  const calculateDiscountedPrice = (item) => {
    let price = item.price;
    if (item.FoodID.startsWith("O001")) price *= 0.85;
    else if (item.FoodID.startsWith("O002")) price *= 0.9;
    else if (item.FoodID.startsWith("O003")) price *= 0.88;
    return price;
  };

  const calculateTotalDiscount = () => {
    return foodList.reduce((total, item) => {
      if (cartItems[item.FoodID] > 0) {
        total += (item.price - calculateDiscountedPrice(item)) * cartItems[item.FoodID];
      }
      return total;
    }, 0);
  };

  const generateBillContent = () => {
    let content = "Order Details:\n\n";

    foodList.forEach((item) => {
      if (cartItems[item.FoodID] > 0) {
        content += `${item.name}: Rs.${calculateDiscountedPrice(item)} x ${cartItems[item.FoodID]}\n`;
      }
    });

    const totalAmount = getTotalCartAmount();
    const totalDiscount = calculateTotalDiscount();
    const serviceCharge = totalAmount === 0 ? 0 : 200;
    const finalTotal = totalAmount - totalDiscount + serviceCharge;

    content += `\nSubtotal: Rs.${totalAmount}\n`;
    content += `Total Discount: Rs.${totalDiscount}\n`;
    content += `Service Charges: Rs.${serviceCharge}\n`;
    content += `Total: Rs.${finalTotal}\n`;

    return content;
  };

  const handleDownloadBill = () => {
    const billContent = generateBillContent();
    const blob = new Blob([billContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bill.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="place-order">
      <div className="place-order-left">
        <p className="title">Order Details</p>
        <div className="order-items">
          <div className="order-items-title">
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
          </div>
          <hr />
          {foodList.map((item) => cartItems[item.FoodID] > 0 && (
            <div key={item.FoodID} className="order-items-item">
              <p>{item.name}</p>
              <p>Rs.{calculateDiscountedPrice(item)}</p>
              <p>{cartItems[item.FoodID]}</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <div className="place-order-right">
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
          </div>
          <div className="action-buttons">
            <Link to="/myorder" onClick={clearCart}>
              <button>View Order Status</button>
            </Link>
            <button onClick={handleDownloadBill}>Download Bill</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;