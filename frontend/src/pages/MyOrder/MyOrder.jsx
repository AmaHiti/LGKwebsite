import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../components/context/StoreContex';
import { useNavigate } from 'react-router-dom';
import './MyOrder.css'; 

const MyOrder = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to home');
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;
        console.log('Fetching orders for userId:', userId);
        console.log('Using token:', token);
        console.log('API URL:', `${url}/api/order/get`);

        const response = await fetch(`${url}/api/order/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (Array.isArray(data)) {
          const groupedOrders = data.reduce((acc, order) => {
            if (!acc[order.OrderID]) {
              acc[order.OrderID] = {
                OrderID: order.OrderID,
                date: new Date(order.created_at).toLocaleDateString(),
                time: order.time || 'Not specified',
                status: order.status || 'Pending',
                items: []
              };
            }
            acc[order.OrderID].items.push({
              FoodID: order.FoodID,
              name: order.food_name || 'Unknown Item',
              price: parseFloat(order.price) || 0,
              image: order.image || '',
              quantity: parseInt(order.quantity) || 0
            });
            return acc;
          }, {});
          console.log('Grouped orders:', groupedOrders);
          setOrders(Object.values(groupedOrders));
        } else {
          console.error('Invalid response format:', data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [token, url, navigate]);

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return '0.00';
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const formatPrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? '0.00' : parsedPrice.toFixed(2);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-food.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${url}/images/${imagePath}`;
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.OrderID} className="order-item">
              <div className="order-header">
                <p>Order #{order.OrderID}</p>
                <p>Date: {order.date}</p>
                <p>Time: {order.time}</p>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={`${order.OrderID}-${item.FoodID}`} className="order-item-details">
                    <div className="order-food-image-container">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="order-food-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-food.jpg';
                          e.target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    </div>
                    <div className="order-food-info">
                      <p className="food-name">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs.{formatPrice(item.price)}</p>
                      <p>Total: Rs.{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <p>Order Total: Rs.{calculateOrderTotal(order.items)}</p>
                <p className={`status ${order.status.toLowerCase()}`}>Status: {order.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrder;
