import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  createReservationController,
  getReservationsByUserIdController,
  listReservationsController,
  updateReservationStatusController,
  deleteReservationController
} from '../controllers/reservationController.js';

const reservationRouter = express.Router();

// Create a reservation (requires user to be authenticated)
reservationRouter.post("/create", authMiddleware, createReservationController);

// Get reservations by user ID (requires user to be authenticated)
reservationRouter.get("/user", authMiddleware, getReservationsByUserIdController);

// List all reservations (optional: could restrict to admins)
reservationRouter.get("/list", listReservationsController);

// Update reservation status
reservationRouter.post("/status", updateReservationStatusController);

// Delete a reservation (requires user to be authenticated)
reservationRouter.post("/delete", authMiddleware, deleteReservationController);

export default reservationRouter;
