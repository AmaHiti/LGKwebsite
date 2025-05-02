import { createOrder, getOrdersByUserId, listOrders, updateOrderStatus, updateOrderTime } from "../models/orderModel.js";

import pool from "../config/db.js";

export const createOrderController = async (req, res) => {
    
    const { userId, cartItems } = req.body;

    try {
        
        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            await createOrder(userId, itemId, quantity);
        }
        
        res.status(201).send('Order created successfully');
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
};



export const getOrdersByUserIdController = async (req, res) => {
    const { userId } = req.body;
    try {
        const orders = await getOrdersByUserId(userId);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).send('Orders not found for this user');
        }
    } catch (error) {
        console.error('Error getting orders by user ID:', error);
        res.status(500).send('Internal Server Error');
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