// Import PostgreSQL client
const { Pool } = require('pg');

// Create connection pool using environment variables
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'microloan',
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.stack);
    } else {
        console.log('✅ Successfully connected to PostgreSQL database');
        release();
    }
});

// Export pool for use in other files
module.exports = pool;