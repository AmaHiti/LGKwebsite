import express from 'express';
import { addFeedback, deleteFeedback, listFeedbacks } from '../controllers/feedbackController.js'; 
import authMiddleware from '../middleware/auth.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/add", authMiddleware, addFeedback);
feedbackRouter.delete("/delete", authMiddleware, deleteFeedback);
feedbackRouter.get("/list", listFeedbacks);

export default feedbackRouter;
