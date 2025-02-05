const mysql = require('mysql2/promise');

const isProduction = process.env.NODE_ENV === 'production';

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant_online',
    port: process.env.DB_PORT || 3306,
    ssl: isProduction ? {
        rejectUnauthorized: true,
        ca: process.env.AIVEN_CA_CERT // The certificate from the environment variable
        } : false, // Use SSL only in production
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log(`✅ Connected to ${isProduction ? 'Aiven MySQL' : 'Local MySQL'}`);
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
})();

module.exports = db;
