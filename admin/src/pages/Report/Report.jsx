import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import "./Report.css";


const TopSellingChart = ({ url }) => {
    const [period, setPeriod] = useState('today');
    const [topSellingData, setTopSellingData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${url}/api/report/${period}`);
                const data = response.data;
                setTopSellingData(data);
            } catch (error) {
                console.error('Error fetching top selling items:', error);
            }
        };

        fetchData();
    }, [url, period]);

    useEffect(() => {
        renderChart();
    }, [topSellingData]);

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    const renderChart = () => {
        
        const topItems = topSellingData.slice(0, 6);
        
        const labels = topItems.map(item => item.FoodID);
        const data = topItems.map(item => item.totalQuantity);
    
        const ctx = document.getElementById('topSellingChart');
        
       
        if (ctx) {
             
            if (Chart.getChart(ctx)) {
                Chart.getChart(ctx).destroy();
            }
    
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Quantity',
                        data: data,
                        backgroundColor: '#d1e76d',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    return (
        <div className="container">
            <h2>Top Selling Items</h2>
            <div className="select-container">
                <label htmlFor="period">Select Period:</label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="today">Today</option>
                    <option value="last">Last 3 Days</option>
                    <option value="week">Last Week</option>
                </select>
            </div>
            <div className="section">
                <h3>{period === 'today' ? 'Today' : period === 'last' ? 'Last 3 Days' : 'Last Week'}</h3>
            </div>
            <div className="chart-container">
                <canvas id="topSellingChart"></canvas>
            </div>
        </div>
    );
};

export default TopSellingChart;
