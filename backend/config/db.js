import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '1234@SQL', 
    database: 'retaurant_new' 
});

export default pool;
