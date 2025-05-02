

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'rsetaurant_new' 
});

const CREATE_ADMIN_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS admins (
        AdminID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

pool.query(CREATE_ADMIN_TABLE_QUERY, (err, results, fields) => {
    if (err) {
        console.error('Error creating admins table:', err);
        return;
    }
    console.log('Admins table created successfully');
});

const adminModel = {
    createAdmin: (adminData, callback) => {
        const { username, email, password } = adminData;
        const INSERT_ADMIN_QUERY = `
            INSERT INTO admins (username, email, password)
            VALUES (?, ?, ?)
        `;
        const values = [username, email, password];
        pool.query(INSERT_ADMIN_QUERY, values, (error, results, fields) => {
            if (error) {
                console.error('Error creating admin:', error);
                callback(error, null);
                return;
            }
            callback(null, results.insertId);
        });
    },
};

module.exports = adminModel;
