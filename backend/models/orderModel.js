import pool from "../config/db.js";

 const createOrder = async (userId, itemId, quantity,time="Still estimating",status="Pending") => {
    const INSERT_ORDER_QUERY = `
        INSERT INTO orders (UserID, FoodID, quantity,time, status)
        VALUES (?, ?, ?,?, ?)
    `;
    try {
        await pool.query(INSERT_ORDER_QUERY, [userId, itemId, quantity,time, status]);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const getOrdersByUserId = async (userId) => {
    const SELECT_ORDERS_BY_USER_QUERY = 'SELECT * FROM orders WHERE UserID = ?';
    try {
        const [orders] = await pool.query(SELECT_ORDERS_BY_USER_QUERY, [userId]);
        return orders;
    } catch (error) {
        console.error('Error getting orders by user ID:', error);
        throw error;
    }
};

 const updateOrderStatus = async (orderId, newStatus) => {
    const UPDATE_ORDER_STATUS_QUERY = 'UPDATE orders SET status = ? WHERE OrderID = ?';
    try {
        await pool.query(UPDATE_ORDER_STATUS_QUERY, [newStatus, orderId]);
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};
const updateOrderTime = async (orderId, newTime) => {
    const UPDATE_ORDER_STATUS_QUERY = 'UPDATE orders SET time = ? WHERE OrderID = ?';
    try {
        await pool.query(UPDATE_ORDER_STATUS_QUERY, [newTime, orderId]);
    } catch (error) {
        console.error('Error updating order time:', error);
        throw error;
    }
};

const listOrders = async () => {
    const SELECT_ORDERS_QUERY = 'SELECT * FROM orders';
    try {
        const [orders] = await pool.query(SELECT_ORDERS_QUERY);
        return orders;
    } catch (error) {
        console.error('Error listing orders:', error);
        throw error;
    }
};


export {createOrder,listOrders,updateOrderStatus,getOrdersByUserId,updateOrderTime};
