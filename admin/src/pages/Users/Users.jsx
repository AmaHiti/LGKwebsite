import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Users.css'

const UserList = ({ url }) => {
    const [userList, setUserList] = useState([]);

    const fetchUserList = async () => {
        try {
            const response = await axios.get(`${url}/api/user/users`);
            if (response.data.success) {
                setUserList(response.data.users);
            } else {
                toast.error("Error fetching user list");
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
            toast.error('Error fetching user list. Please try again.');
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    return (
        <div className="list add flex-col">
            <p>All Users List</p>
            <div className="list-table2">
                <div className="list-table-format2 title">
                    <b>User ID</b>
                    <b>Name</b>
                    <b>Email</b>
                    <b>Contact No</b>
                </div>
                {userList.map((user, index) => (
                    <div key={index} className="list-table-format2">
                        <p>{user.CustomerID}</p>
                        <p>{user.customer_name}</p>
                        <p>{user.email}</p>
                        <p>{user.tel_num}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
