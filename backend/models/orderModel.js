import pool from "../config/db.js";

 const createOrder = async (userId, foodId, quantity, time="Still estimating", status="Pending") => {
    const INSERT_ORDER_QUERY = `
        INSERT INTO orders (UserID, FoodID, quantity, time, status)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        // Ensure all values are of the correct type
        const values = [
            parseInt(userId),
            parseInt(foodId),
            parseInt(quantity),
            time,
            status
        ];
        
        console.log('Creating order with values:', values);
        await pool.query(INSERT_ORDER_QUERY, values);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const getOrdersByUserId = async (userId) => {
    const SELECT_ORDERS_BY_USER_QUERY = `
        SELECT 
            o.OrderID,
            o.UserID,
            o.FoodID,
            o.quantity,
            o.time,
            o.status,
            o.created_at,
            f.name as food_name,
            f.price,
            f.image,
            f.description
        FROM orders o
        JOIN foods f ON o.FoodID = f.FoodID
        WHERE o.UserID = ?
        ORDER BY o.created_at DESC
    `;
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
