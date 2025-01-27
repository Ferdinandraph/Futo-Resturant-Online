const mysql = require('mysql2/promise'); // Use the promise-based version

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// You don't need to call connect here as the pool itself will be ready to use immediately.
console.log('Connected to MySQL using connection pool');

module.exports = db;
