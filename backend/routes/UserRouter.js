import {
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
} from '../controllers/userController.js';

import authMiddleware from '../middleware/auth.js';
import express from 'express';

const userRouter = express.Router();

// Define routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/delete', authMiddleware, deleteUser);
userRouter.get('/get_users', getUsers);
userRouter.get('/get_user', authMiddleware, getUserById);

export default userRouter;