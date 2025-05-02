const mysql = require('mysql');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'rsetaurant_new' 
});

const CREATE_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        cartData TEXT
    )
`;

pool.query(CREATE_TABLE_QUERY, (err, results, fields) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created successfully');
});

const userModel = {
    createUser: (userData, callback) => {
        const { name, email, password, cartData } = userData;
        const INSERT_USER_QUERY = `
            INSERT INTO users (name, email, password, cartData)
            VALUES (?, ?, ?, ?)
        `;
        const values = [name, email, password, JSON.stringify(cartData)];
        pool.query(INSERT_USER_QUERY, values, (error, results, fields) => {
            if (error) {
                console.error('Error creating user:', error);
                callback(error, null);
                return;
            }
            callback(null, results.insertId);
        });
    },
    
};

module.exports = userModel;
