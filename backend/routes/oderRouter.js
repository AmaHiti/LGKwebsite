import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createOrderController,getOrdersByUserIdController,listOrdersController,updateOrderStatusController,deleteOrdersByUserController,updateOrderTimeController} from '../controllers/orderController.js';

const orderRouter = express.Router();


orderRouter.post("/place", authMiddleware, createOrderController);
orderRouter.post("/list",listOrdersController);
orderRouter.get("/get",authMiddleware,getOrdersByUserIdController)
orderRouter.post("/status",updateOrderStatusController);
orderRouter.post("/time",updateOrderTimeController);
orderRouter.post("/remove",authMiddleware,deleteOrdersByUserController);


export default orderRouter;
