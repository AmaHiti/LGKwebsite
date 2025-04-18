import pool from "../config/db.js";

// Create a reservation
const createReservation = async (userId, date, time, numberOfPeople, waiterId, status = "Pending") => {
    try {
        const reservationId = `RES-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const INSERT_QUERY = `
            INSERT INTO reservations (ReservationID, CustomerID, Date, Time, NumberOfPeople, WaiterID, Status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(INSERT_QUERY, [
            reservationId,
            userId,
            date,
            time,
            numberOfPeople,
            waiterId,
            status
        ]);

        return reservationId;
    } catch (error) {
        console.error("Error creating reservation:", error);
        throw error;
    }
};


// Get reservations by user ID
const getReservationsByUserId = async (userId) => {
    try {
        const SELECT_QUERY = `
            SELECT * FROM reservations
            WHERE CustomerID = ?
        `;

        const [reservations] = await pool.query(SELECT_QUERY, [userId]);
        return reservations;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
    }
};

// List all reservations
const listReservations = async () => {
    try {
        const [reservations] = await pool.query("SELECT * FROM reservations");
        return reservations;
    } catch (error) {
        console.error("Error listing reservations:", error);
        throw error;
    }
};

// Update reservation status
const updateReservationStatus = async (reservationId, status) => {
    try {
        const UPDATE_QUERY = `
            UPDATE reservations
            SET Status = ?
            WHERE ReservationID = ?
        `;

        await pool.query(UPDATE_QUERY, [status, reservationId]);
    } catch (error) {
        console.error("Error updating reservation status:", error);
        throw error;
    }
};

// Delete a reservation
const deleteReservationById = async (reservationId) => {
    try {
        const DELETE_QUERY = `
            DELETE FROM reservations
            WHERE ReservationID = ?
        `;

        await pool.query(DELETE_QUERY, [reservationId]);
    } catch (error) {
        console.error("Error deleting reservation:", error);
        throw error;
    }
};

export {
    createReservation,
    getReservationsByUserId,
    listReservations,
    updateReservationStatus,
    deleteReservationById
};
