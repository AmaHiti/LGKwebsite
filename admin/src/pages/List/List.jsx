import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.foods); 
            } else {
                toast.error("Error fetching food list");
            }
        } catch (error) {
            console.error('Error fetching list:', error);
            toast.error('Error fetching food list. Please try again.');
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { foodId }); 
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error removing food:', error);
            toast.error('Error removing food. Please try again.');
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <p>All Food List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>FoodID</b>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className="list-table-format">
                        <p>{item.FoodID}</p>
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>Rs.{item.price}</p>
                        <button onClick={() => removeFood(item.FoodID)} className="cursor">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default List;
