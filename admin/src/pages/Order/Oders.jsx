import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/list`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching order list. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        id: orderId,
        status: newStatus,
      });
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        await fetchOrders(); 
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    }
  };

  const updateOrderTime = async (orderId, newTime) => {
    try {
      const response = await axios.post(`${url}/api/order/time`, {
        id: orderId,
        time: newTime,
      });
      if (response.status === 200) {
        toast.success("Order time updated successfully");
        await fetchOrders(); 
      } else {
        toast.error("Failed to update order time");
      }
    } catch (error) {
      console.error("Error updating order time:", error);
      toast.error("Error updating order time. Please try again.");
    }
  };

  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    await updateOrderStatus(orderId, newStatus);
  };

  const handleTimeChange = async (e, orderId) => {
    const newTime = e.target.value;
    await updateOrderTime(orderId, newTime);
  };

  return (
    <div className="order add flex-col">
      <p>All Orders List</p>
      <div className="order-table">
        <div className="order-table-format title">
          <b>Order ID</b>
          <b>User ID</b>
          <b>Item ID</b>
          <b>Quantity</b>
          <b>Date</b>
          <b>Order Status</b>
          <b>Order Time</b> 
        </div>
        {orders.map((order, index) => (
          <div key={index} className="order-table-format">
            <p>{order.OrderID}</p>
            <p>{order.UserID}</p>
            <p>{order.FoodID}</p>
            <p>{order.quantity}</p>
            <p>{new Date(order.date).toLocaleString()}</p>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e, order.OrderID)}
            >
              <option value="Pending" className="s">
                Pending
              </option>
              <option value="Food processing" className="d">
                Food Processing
              </option>
              <option value="Confirmed" className="f">
                Confirmed
              </option>
              <option value="Ready to pick up" className="g">
                Ready to Pick Up
              </option>
            </select>
            <select
              value={order.time}
              onChange={(e) => handleTimeChange(e, order.OrderID)}
            >
              {" "}
              <option value="Still estimating ">Still estimating</option>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="Order Ready">Order Ready</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
