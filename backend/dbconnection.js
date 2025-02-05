const mysql = require('mysql2/promise'); // Use the promise-based version

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

if (db){
    console.log('Connected to MySQL using connection pool');
} else {
    console.log('not connected successfully')
}

module.exports = db;
