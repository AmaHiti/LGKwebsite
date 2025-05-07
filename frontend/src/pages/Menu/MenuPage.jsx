import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MenuPage.css';
import { menu_list } from '../../assets/assets'; // assumes local categories + images

const MenuPage = ({ url }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [category, setCategory] = useState('All');

    // Fetch menu items from backend
    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setMenuItems(response.data.foods);
            } else {
                toast.error("Error fetching menu items");
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            toast.error('Error fetching menu items. Please try again.');
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Filter menu items by selected category
    const filteredItems = category === "All"
        ? menuItems
        : menuItems.filter(item => item.category === category);

    return (
        <div className="menu-page">
            <h2>Our Menu</h2>

            {/* Inline Category Filter Section (like ExploreMenu) */}
            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                        className="explore-menu-list-item"
                    >
                        <img
                            className={category === item.menu_name ? "active" : ""}
                            src={item.menu_image}
                            alt={item.menu_name}
                        />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
            <hr />

            {/* Filtered Menu Items */}
            <div className="menu-items">
                {filteredItems.length === 0 ? (
                    <p>No items available.</p>
                ) : (
                    filteredItems.map((item, index) => (
                        <div key={index} className="menu-item">
                            <img src={`${url}/images/${item.image}`} alt={item.name} className="menu-item-img" />
                            <div className="menu-item-info">
                                <h3>{item.name}</h3>
                                <p>{item.category}</p>
                                <p>Rs. {item.price}</p>
                                <button className="add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MenuPage;
