import pool from "../config/db.js";
const generateOrderId = () => {
    const timestamp = Date.now().toString(); // Get current timestamp
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a 10-digit random number
    const orderId = `${timestamp}-${randomNumber}`; // Combine timestamp and random number
    return orderId;
};


const createOrder = async (userId, cartItems, totalAmount, time = "Still estimating", status = "Pending") => {
    try {
    
        const orderId = generateOrderId();

        await pool.query('INSERT INTO orders (OrderID, CustomerID, Time, Status) VALUES (?, ?, ?, ?)', [orderId, userId, time, status]);

        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            await pool.query('INSERT INTO order_details (OrderID, FoodID, Quantity,Price) VALUES (?, ?, ?,?)', [orderId, itemId, quantity,totalAmount]);
        }

        console.log("Order created successfully!");
        return orderId; 
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};


const getOrdersByUserId = async (userId) => {
    const SELECT_ORDERS_BY_USER_QUERY = `
        SELECT o.*, od.FoodID, od.Quantity
        FROM orders o
        INNER JOIN order_details od ON o.OrderID = od.OrderID
        WHERE o.CustomerID = ?
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
      
        if (newStatus === 'Confirmed') {
            
            const SELECT_ORDER_QUERY = 'SELECT * FROM order_details WHERE OrderID = ?';
            const [orderDetails] = await pool.query(SELECT_ORDER_QUERY, [orderId]);
            
          
            for (let order of orderDetails) {
                const INSERT_REPORT_QUERY = `
                    INSERT INTO report (FoodID, quantity)
                    VALUES (?, ?)
                `;
                await pool.query(INSERT_REPORT_QUERY, [
                    order.FoodID,
                    order.Quantity,
                ]);
            }
        }
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
    const SELECT_ORDERS_QUERY = `
        SELECT o.OrderID, o.CustomerID, o.time, o.status, od.FoodID, od.Quantity,od.Price
        FROM orders o
        INNER JOIN order_details od ON o.OrderID = od.OrderID
        
    `;
    try {
        const [orders] = await pool.query(SELECT_ORDERS_QUERY);
        return orders;
    } catch (error) {
        console.error('Error listing orders:', error);
        throw error;
    }
};


export {createOrder,listOrders,updateOrderStatus,getOrdersByUserId,updateOrderTime};
