const mysql = require('mysql');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'rsetaurant_new' 
});


const CREATE_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS foods (
        FoodID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL
    )
`;

const ALTER_TABLE_QUERY = `
    ALTER TABLE foods
    MODIFY COLUMN FoodID INT AUTO_INCREMENT PRIMARY KEY
`;

pool.query(CREATE_TABLE_QUERY, (err, results, fields) => {
    if (err) {
        console.error('Error creating foods table:', err);
        return;
    }
    console.log('Foods table created successfully');
});

pool.query(ALTER_TABLE_QUERY, (err, results, fields) => {
    if (err) {
        console.error('Error altering foods table:', err);
        return;
    }
    console.log('Foods table altered successfully');
});

const foodModel = {
    getAllFoods: (callback) => {
        const SELECT_ALL_QUERY = 'SELECT * FROM foods';
        pool.query(SELECT_ALL_QUERY, (error, results, fields) => {
            if (error) {
                console.error('Error retrieving foods:', error);
                callback(error, null);
                return;
            }
            callback(null, results);
        });
    },
    
};

module.exports = foodModel;
