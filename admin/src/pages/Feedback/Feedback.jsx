import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Feedback.css'

const FeedbackList = ({ url }) => {
    const [feedbackList, setFeedbackList] = useState([]);

    const fetchFeedbackList = async () => {
        try {
            const response = await axios.get(`${url}/api/feedback/list`);
            if (response.data.success) {
                setFeedbackList(response.data.feedbacks);
            } else {
                toast.error("Error fetching feedback list");
            }
        } catch (error) {
            console.error('Error fetching feedback list:', error);
            toast.error('Error fetching feedback list. Please try again.');
        }
    };

    useEffect(() => {
        fetchFeedbackList();
    }, []);

    const renderFeedbackText = (text) => {
        const words = text.split(' ');
        const wordRows = [];
        for (let i = 0; i < words.length; i +=10) {
            const row = words.slice(i, i + 10).join(' ');
            wordRows.push(row);
        }
        return wordRows.map((row, index) => <p key={index}>{row}</p>);
    };

    return (
        <div className="list add flex-col">
            <p>All Feedback List</p>
            <div className="list-table1">
                <div className="list-table-format1 title">
                    <b>User ID</b>
                    <b>Name</b>
                    <b>Data</b>
                    <b>Feedback</b>
                </div>
                {feedbackList.map((feedback, index) => (
                    <div key={index} className="list-table-format1">
                        <p>{feedback.UserID}</p>
                        <p>{feedback.c_name}</p>
                        <p>{feedback.created_at}</p>
                        <div>{renderFeedbackText(feedback.feedback_text)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;
