import {
    createReservation,
    getReservationsByUserId,
    listReservations,
    updateReservationStatus,
    deleteReservationById
} from "../models/reservationModel.js";
import pool from "../config/db.js";

// Create a reservation with hybrid waiter assignment
export const createReservationController = async (req, res) => {
    const { userId, date, time, numberOfPeople, waiterId } = req.body;

    try {
        // Hybrid logic: assign a waiter if not provided
        let assignedWaiterId = waiterId;
        if (!assignedWaiterId) {
            const [waiters] = await pool.query(`SELECT WaiterID FROM waiters`);
            if (waiters.length === 0) {
                return res.status(500).send("No waiters available for assignment");
            }
            assignedWaiterId = waiters[Math.floor(Math.random() * waiters.length)].WaiterID;
        }

        const reservationId = await createReservation(
            userId,
            date,
            time,
            numberOfPeople,
            assignedWaiterId
        );

        res.status(201).send(`Reservation ${reservationId} created successfully`);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Get reservations by user ID
export const getReservationsByUserIdController = async (req, res) => {
    const { userId } = req.body;

    try {
        const reservations = await getReservationsByUserId(userId);
        if (reservations.length > 0) {
            res.status(200).json(reservations);
        } else {
            res.status(404).send("No reservations found for this user");
        }
    } catch (error) {
        console.error("Error fetching reservations by user ID:", error);
        res.status(500).send("Internal Server Error");
    }
};

// List all reservations
export const listReservationsController = async (req, res) => {
    try {
        const reservations = await listReservations();
        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error listing reservations:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update reservation status
export const updateReservationStatusController = async (req, res) => {
    const { reservationId, status } = req.body;

    try {
        await updateReservationStatus(reservationId, status);
        res.status(200).send("Reservation status updated successfully");
    } catch (error) {
        console.error("Error updating reservation status:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete reservation by ID
export const deleteReservationController = async (req, res) => {
    const { reservationId } = req.body;

    try {
        await deleteReservationById(reservationId);
        res.status(200).send("Reservation deleted successfully");
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).send("Internal Server Error");
    }
};
