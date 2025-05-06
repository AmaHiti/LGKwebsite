import { createOrder, getOrdersByUserId, listOrders, updateOrderStatus, updateOrderTime } from "../models/orderModel.js";

import pool from "../config/db.js";

export const createOrderController = async (req, res) => {
    const { userId, cartItems } = req.body;
    console.log('Creating order with userId:', userId);
    console.log('Cart items:', cartItems);

    try {
        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            const foodId = parseInt(itemId);
            if (isNaN(foodId)) {
                console.error('Invalid FoodID:', itemId);
                continue;
            }
            console.log('Creating order item - FoodID:', foodId, 'Quantity:', quantity);
            await createOrder(userId, foodId, quantity);
        }
        
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



export const getOrdersByUserIdController = async (req, res) => {
    const { userId } = req.body;
    console.log('Getting orders for userId:', userId);
    try {
        const orders = await getOrdersByUserId(userId);
        console.log('Found orders:', orders);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ message: 'No orders found for this user' });
        }
    } catch (error) {
        console.error('Error getting orders by user ID:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const updateOrderStatusController = async (req, res) => {
    const { status, id } = req.body; 
    try {
        await updateOrderStatus(id, status); 
        res.status(200).send('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Internal Server Error');
    }
};
export const updateOrderTimeController = async (req, res) => {
    const { time, id } = req.body; 
    try {
        await updateOrderTime(id, time); 
        res.status(200).send('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Internal Server Error');
    }
};



export const listOrdersController = async (req, res) => {
    try {
        const orders = await listOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error listing orders:', error);
        res.status(500).send('Internal Server Error');
    }
};
const deleteOrdersByUserId = async (userId) => {
    const DELETE_ORDERS_BY_USER_QUERY = 'DELETE FROM orders WHERE userId = ?';
    try {
        await pool.query(DELETE_ORDERS_BY_USER_QUERY, [userId]);
    } catch (error) {
        console.error('Error deleting orders by user ID:', error);
        throw error;
    }
};

export const deleteOrdersByUserController = async (req, res) => {
    const { userId } = req.body; 
    try {
        await deleteOrdersByUserId(userId); 
        res.status(200).send('Orders deleted successfully');
    } catch (error) {
        console.error('Error deleting orders by user ID:', error);
        res.status(500).send('Internal Server Error');
    }
};