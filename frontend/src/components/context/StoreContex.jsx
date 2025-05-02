import "react-toastify/dist/ReactToastify.css";

import React, { createContext, useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [cartCleared, setCartCleared] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    const filteredCartItems = Object.fromEntries(
      Object.entries(cartItems).filter(([, value]) => value > 0)
    );
    localStorage.setItem("cartItems", JSON.stringify(filteredCartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    setCartCleared(true);
  };

  const addFeedback = async (feedbackText, c_name) => {
    try {
      if (token) {
        await axios.post(
          url + "/api/feedback/add",
          { feedbackText, c_name },
          { headers: { token } }
        );
        console.log("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  };
  const deleteUser = async () => {
    try {
      if (token) {
        await axios.post(url + "/api/user/delete", {}, { headers: { token } });
        console.log("User deleted successfully!");
        setToken("");
        localStorage.removeItem("token");
        toast.success("Account deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Please Clear Cart & Orders to Delete Account");
      throw error;
    }
  };
  const deleteOrder = async () => {
    try {
      if (token) {
        await axios.post(url + "/api/order/remove", {}, { headers: { token } });
        console.log("Orders deleted successfully!");
        toast.success("Orders cleared successfully!");

        await axios.post(url + "/api/cart/delete", {}, { headers: { token } });
        console.log("Cart cleared successfully!");
        toast.success("Cart cleared successfully!");
      }
    } catch (error) {
      console.error("Error deleting orders and clearing cart:", error);
      toast.error("Failed to clear orders and cart");
      throw error;
    }
  };

  const addToCart = async (itemId) => {
    try {
      setCartItems((prevCartItems) => {
        const updatedCartItems = { ...prevCartItems };
        if (!updatedCartItems[itemId]) {
          updatedCartItems[itemId] = 1;
        } else {
          updatedCartItems[itemId]++;
        }
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        return updatedCartItems;
      });

      if (token) {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  const removeFromCart = async (itemId) => {
    try {
      setCartItems((prevCartItems) => {
        const updatedCartItems = { ...prevCartItems };
        if (updatedCartItems[itemId] > 0) {
          updatedCartItems[itemId]--;
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }
        return updatedCartItems;
      });

      if (token) {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  const createOrder = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const cartItems = JSON.parse(localStorage.getItem("cartItems"));

      const orderDetails = { userId, cartItems };

      await axios.post(url + "/api/order/place", orderDetails, {
        headers: { token },
      });
      console.log("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.foods);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);
  const getTotalCartAmount = () => {
    if (!foodList || foodList.length === 0) {
      return 0;
    }

    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] != 0) {
        const itemInfo = foodList.find((product) => product.FoodID === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };
  const fetchOrdersByUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return [];
      }

      const response = await axios.get(url + "/api/order/get", {
        headers: { token },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
      return [];
    }
  };

  const contextValue = {
    orders,
    foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    addFeedback,
    deleteUser,
    createOrder,
    clearCart,
    cartCleared,
    fetchOrdersByUserId,
    deleteOrder,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
