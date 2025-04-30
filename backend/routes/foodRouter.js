import express from 'express';
import multer from 'multer';
import pool from '../config/db.js';  
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const foodRouter = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post('/add', upload.single('image'), async (req, res) => {
    const { id,name, description, price, category } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image is required' });
    }
    const image = req.file.filename;
    const INSERT_FOOD_QUERY = `
        INSERT INTO foods (FoodID,name,description, price, image, category)
        VALUES (?, ?, ?, ?, ?,?)
    `;
    try {
        await pool.query(INSERT_FOOD_QUERY, [id,name, description, price, image, category]);
        res.status(201).json({ success: true, message: 'Food added successfully' });
    } catch (error) {
        console.error('Error adding food:', error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
});

foodRouter.get('/list', async (req, res) => {
    const SELECT_FOODS_QUERY = 'SELECT * FROM foods';
    try {
        const [results] = await pool.query(SELECT_FOODS_QUERY);
        res.status(200).json({ success: true, foods: results });
    } catch (error) {
        console.error('Error listing foods:', error);
        res.status(500).json({ success: false, message: 'Error listing foods' });
    }
});

foodRouter.post('/remove', async (req, res) => {
    const { foodId } = req.body;
    const DELETE_FOOD_QUERY = 'DELETE FROM foods WHERE FoodID = ?';
    try {
        const [results] = await pool.query(DELETE_FOOD_QUERY, [foodId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }
        res.status(200).json({ success: true, message: 'Food removed successfully' });
    } catch (error) {
        console.error('Error removing food:', error);
        res.status(500).json({ success: false, message: 'Error removing food' });
    }
});

foodRouter.put('/update', upload.single('image'), async (req, res) => {
    const { FoodID, name, description, price, category } = req.body;

    try {
        // Fetch existing image filename (in case we need to delete the old one)
        const [existing] = await pool.query('SELECT image FROM foods WHERE FoodID = ?', [FoodID]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        let updateQuery = `UPDATE foods SET name = ?, description = ?, price = ?, category = ?`;
        const params = [name, description, price, category];

        // Handle image if uploaded
        if (req.file) {
            const newImage = req.file.filename;
            const oldImage = existing[0].image;

            // Delete old image file
            fs.unlink(path.join(uploadsDir, oldImage), (err) => {
                if (err) console.error('Error deleting old image:', err);
            });

            updateQuery += `, image = ?`;
            params.push(newImage);
        }

        updateQuery += ` WHERE FoodID = ?`;
        params.push(FoodID);

        await pool.query(updateQuery, params);
        res.status(200).json({ success: true, message: 'Food updated successfully' });
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ success: false, message: 'Error updating food' });
    }
});


export default foodRouter;
