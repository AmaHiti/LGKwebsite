import feedbackModel from '../models/feedbackModel.js';

const addFeedback = async (req, res) => {
    try {
        const { userId, c_name,feedbackText } = req.body;
        await feedbackModel.addFeedback(userId, c_name,feedbackText);
        res.json({ success: true, message: "Feedback Added" });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ success: false, message: "Error adding feedback" });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const { userId } = req.body;
        await feedbackModel.deleteFeedback(userId);
        res.json({ success: true, message: "Feedback Deleted" });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ success: false, message: "Error deleting feedback" });
    }
};

const listFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.listFeedbacks();
        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error('Error listing feedbacks:', error);
        res.status(500).json({ success: false, message: "Error listing feedbacks" });
    }
};

export { addFeedback, deleteFeedback, listFeedbacks };
