const mysql = require('mysql2/promise'); // Use the promise-based version

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connected to MySQL using connection pool');
        connection.release(); // Release connection back to pool
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Stop the app if DB is unreachable
    }
})();

module.exports = db;
