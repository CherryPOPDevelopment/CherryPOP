const mysql = require('mysql2/promise');
require('dotenv').config();

// Create pool with better error handling
let pool = null;

async function initializePool() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aurelia_contacts',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0
    });

    console.log('✓ Database pool initialized');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
}

// Initialize on require
initializePool().catch(err => {
  console.error('Failed to initialize database pool:', err.message);
});

module.exports = pool;
