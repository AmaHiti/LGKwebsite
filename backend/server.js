import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import foodRouter from './routes/foodRouter.js';
import userRouter from './routes/UserRouter.js';
import cartRouter from './routes/cartRouter.js';
import feedbackRouter from './routes/feedbackRouter.js';
import 'dotenv/config';
import ordrRouter from './routes/oderRouter.js';
import adminRouter from './routes/adminRouter.js';
import reportrouter from './routes/reportRouter.js';
import reservationRouter from './routes/reservationRouter.js';
import promotionRouter from './routes/promotionRouter.js';

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/feedback',feedbackRouter);
app.use("/api/order",ordrRouter);
app.use("/api/admin",adminRouter);
app.use("/api/report",reportrouter);
app.use("/api/reservation",reservationRouter);
app.use("/api/promotion",promotionRouter);


// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, message: 'Database connected!', result: rows[0] });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, message: 'Error connecting to the database', error });
    }
});

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}`);
});
