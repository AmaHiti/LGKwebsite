import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from API
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        id: orderId,
        status: newStatus,
      });
      
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        await fetchOrders(); // Refresh orders after update
        saveToLocalStorage(orderId, 'status', newStatus); // Save to local storage
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    }
  };

  // Update order time
  const updateOrderTime = async (orderId, newTime) => {
    try {
      const response = await axios.post(`${url}/api/order/time`, {
        id: orderId,
        time: newTime,
      });
      if (response.status === 200) {
        toast.success("Order time updated successfully");
        await fetchOrders(); // Refresh orders after update
        saveToLocalStorage(orderId, 'time', newTime); // Save to local storage
      } else {
        toast.error("Failed to update order time");
      }
    } catch (error) {
      console.error("Error updating order time:", error);
      toast.error("Error updating order time. Please try again.");
    }
  };

  // Save to local storage
  const saveToLocalStorage = (orderId, key, value) => {
    localStorage.setItem(`order_${orderId}_${key}`, value);
  };

  // Get from local storage
  const getFromLocalStorage = (orderId, key) => {
    return localStorage.getItem(`order_${orderId}_${key}`);
  };

  // Handle order status change
  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    await updateOrderStatus(orderId, newStatus);
  };

  // Handle order time change
  const handleTimeChange = async (e, orderId) => {
    const newTime = e.target.value;
    await updateOrderTime(orderId, newTime);
  };

  // Group orders by OrderID and CustomerID
  const groupOrders = () => {
    const groupedOrders = {};
    orders.forEach(order => {
      const key = `${order.OrderID}_${order.CustomerID}`;
      if (!groupedOrders[key]) {
        groupedOrders[key] = [order];
      } else {
        groupedOrders[key].push(order);
      }
    });
    return groupedOrders;
  };

  const groupedOrders = groupOrders();

  // Function to get value from local storage or use default
  const getStoredValueOrDefault = (orderId, key, defaultValue) => {
    const storedValue = getFromLocalStorage(orderId, key);
    return storedValue !== null ? storedValue : defaultValue;
  };

  
  return (
    <div className="order add flex-col">
      <p>All Orders List</p>
      <div className="order-table">
        <div className="order-table-format title">
          <b>Order ID</b>
          <b>User ID</b>
          <b>ItemID/Quantity</b>
          
          <b>Price</b>
          <b>Order Status</b>
          <b>Order Time</b> 
        </div>
        {Object.values(groupedOrders).map((groupedOrder, index) => (
          <div key={index} className="grouped-order">
            <div className="order-table-format">
              <p>{groupedOrder[0].OrderID}</p>
              <p>{groupedOrder[0].CustomerID}</p>
              
              <div>
                {groupedOrder.map(order => (
                  <p key={order.FoodID}>{order.FoodID} / {order.Quantity}</p>
                ))}
              </div>
              
              <p>Rs.{groupedOrder[0].Price}</p>
              <select
                value={getStoredValueOrDefault(groupedOrder[0].OrderID, 'status', groupedOrder[0].Status)}
                onChange={(e) => handleStatusChange(e, groupedOrder[0].OrderID)}
              >
                <option value="Pending" className="s">Pending</option>
                <option value="Food processing" className="d">Food Processing</option>
                <option value="Confirmed" className="f">Confirmed</option>
                <option value="Ready to pick up" className="g">Ready to Pick Up</option>
              </select>
              <select
                value={getStoredValueOrDefault(groupedOrder[0].OrderID, 'time', groupedOrder[0].Time)}
                onChange={(e) => handleTimeChange(e, groupedOrder[0].OrderID)}
              >
                <option value="Still estimating">Still estimating</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="Order Ready">Order Ready</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
