import pool from "../config/db.js";

const feedbackModel = {
    addFeedback: async (userId, c_name, feedbackText) => {
        const INSERT_FEEDBACK_QUERY = `
            INSERT INTO feedbacks (CustomerID, customer_name,feedback_text)
            VALUES (?, ?,?)
        `;
        try {
            await pool.query(INSERT_FEEDBACK_QUERY, [userId,c_name, feedbackText]);
        } catch (error) {
            console.error('Error adding feedback:', error);
            throw error;
        }
    },
    deleteFeedback: async (userId) => {
        const DELETE_FEEDBACK_QUERY = 'DELETE FROM feedbacks WHERE CustomerID = ?';
        try {
            await pool.query(DELETE_FEEDBACK_QUERY, [userId]);
        } catch (error) {
            console.error('Error deleting feedback:', error);
            throw error;
        }
    },
    listFeedbacks: async () => {
        const SELECT_FEEDBACKS_QUERY = 'SELECT * FROM feedbacks';
        try {
            const [feedbacks] = await pool.query(SELECT_FEEDBACKS_QUERY);
            return feedbacks;
        } catch (error) {
            console.error('Error listing feedbacks:', error);
            throw error;
        }
    }
};

export default feedbackModel;
