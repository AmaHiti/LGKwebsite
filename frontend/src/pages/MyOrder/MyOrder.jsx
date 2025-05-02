import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../components/context/StoreContex';
import './MyOrder.css'; 

const MyOrder = () => {
  const { fetchOrdersByUserId, deleteOrder } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const userId = localStorage.getItem("userId");
        const userOrders = await fetchOrdersByUserId(userId);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchData();
  }, [fetchOrdersByUserId]);

  const handleClearOrders = async () => {
    try {
      
      const userId = localStorage.getItem("userId");
      await deleteOrder(userId);
      
      const userOrders = await fetchOrdersByUserId(userId);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error clearing orders:", error);
    }
  };

  return (
    <>
      <div className="my-order-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li className="order-item" key={order.OrderID}>
                <h2>Order ID: {order.OrderID}</h2>
                <div className="order-details">
                  <div className="order-detail">
                    <label>User ID:</label>
                    <p>{order.UserID}</p>
                  </div>
                  <div className="order-detail">
                    <label>Item ID:</label>
                    <p>{order.FoodID}</p>
                  </div>
                  <div className="order-detail">
                    <label>Quantity:</label>
                    <p>{order.quantity}</p>
                  </div>
                  <div className="order-detail1">
                    <label>Status:</label>
                    <p>{order.status}</p>
                  </div>
                  <div className="order-detail">
                    <label>Time:</label>
                    <p>{order.time} </p>
                  </div>
                  <div className="order-detail">
                    <label>Date:</label>
                    <p>{order.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleClearOrders} className='order-button'>Clear Orders</button>
    </>
  );
};

export default MyOrder;
