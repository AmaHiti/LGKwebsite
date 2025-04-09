import express from "express";
import { getUsers } from "../controllers/userController.js";
import { deleteUser,registerUser,loginUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";



const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser)
userRouter.post("/delete", authMiddleware, deleteUser);

userRouter.get("/users", getUsers);

export default userRouter;
