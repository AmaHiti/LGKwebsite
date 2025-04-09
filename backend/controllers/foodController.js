import pool from "../config/db.js"; 
import fs from 'fs';


const addFood = async (req, res) => {
    try {
        const {id,name, description, price, category } = req.body;
        const image_filename = req.file.filename;
        const INSERT_FOOD_QUERY = `
            INSERT INTO foods (FoodID,name, description, price, category, image)
            VALUES (?, ?, ?, ?, ?,?)
        `;
        await pool.query(INSERT_FOOD_QUERY, [id,name, description, price, category, image_filename]);
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error('Error adding food:', error);
        res.json({ success: false, message: "Error adding food" });
    }
};


const listFood = async (req, res) => {
    try {
        const SELECT_FOODS_QUERY = 'SELECT * FROM foods';
        const foods = await pool.query(SELECT_FOODS_QUERY);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error('Error listing foods:', error);
        res.json({ success: false, message: "Error listing foods" });
    }
};


const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        const SELECT_FOOD_IMAGE_QUERY = 'SELECT image FROM foods WHERE FoodID = ?';
        const result = await pool.query(SELECT_FOOD_IMAGE_QUERY, [id]);
        const foodImage = result[0].image;
        fs.unlink(`uploads/${foodImage}`, (err) => {
            if (err) {
                console.error('Error deleting food image:', err);
            }
        });
        const DELETE_FOOD_QUERY = 'DELETE FROM foods WHERE FoodID = ?';
        await pool.query(DELETE_FOOD_QUERY, [id]);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error('Error removing food:', error);
        res.json({ success: false, message: "Error removing food" });
    }
};

export { addFood, listFood, removeFood };
