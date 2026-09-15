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
      connectTimeout: 5000,
      enableKeepAlive: true
    });

    console.log('Aurelia database pool initialized');

    // Validate critical environment variables
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    
    // Check for localhost in production (common Railway error)
    if (process.env.NODE_ENV === 'production' && (dbHost === 'localhost' || dbHost === '127.0.0.1')) {
      throw new Error('❌ Cannot use "localhost" as DB_HOST in production! Use your actual database hostname.');
    }
    
    pool = mysql.createPool({
      host: dbHost || 'localhost',
      user: dbUser || 'root',
      password: dbPassword || '',
      database: dbName || 'aurelia_contacts',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
      charset: 'utf8mb4',
      connectTimeout: 10000
    });

    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✓ Connected to MySQL database');
    await initializeTables();
    return pool;
  } catch (error) {
    console.error('\n❌ ═════════════════════════════════════════════════════════');
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.error('❌ ═════════════════════════════════════════════════════════');
    console.error(`Error: ${error.message}`);
    console.error(`Code: ${error.code || 'Unknown'}`);
    console.error('\n📋 Current Configuration:');
    console.error(`   DB_HOST: ${process.env.DB_HOST || '❌ NOT SET'}`);
    console.error(`   DB_USER: ${process.env.DB_USER || '❌ NOT SET'}`);
    console.error(`   DB_NAME: ${process.env.DB_NAME || '❌ NOT SET'}`);
    console.error(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✓ SET' : '❌ NOT SET'}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Verify database credentials are correct');
    console.error('   2. Ensure database is accessible from this server');
    console.error('   3. Check firewall/security group settings');
    console.error('   4. For Railway: Database must be internet-accessible');
    console.error('   5. Cannot use "localhost" for Railway deployments');
    console.error('\n📖 Detailed fix guide: docs/FIX_ERROR_1033_NOW.md');
    console.error('❌ ═════════════════════════════════════════════════════════\n');
    
    // In production, this is critical - we should exit
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️  PRODUCTION MODE: Exiting due to database failure');
      console.error('⚠️  Fix database connection and redeploy');
      process.exit(1); // Exit so Railway shows the error
    } else {
      console.error('⚠️  DEVELOPMENT MODE: Server will continue but database operations will fail');
      return null;
    }
  }
}

async function initializeTables() {
  const connection = await pool.getConnection();
  try {
    // Users table with all profile fields
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        bio TEXT,
        profilePicture LONGTEXT,
        birthday DATE,
        phone VARCHAR(20),
        interests TEXT,
        sharePreferences TEXT,
        settings TEXT,
        privacySettings TEXT,
        resetToken VARCHAR(36),
        resetTokenExpires DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      )
    `);
    console.log('✓ Users table ready');

    // Add missing columns if they don't exist (MySQL doesn't support IF NOT EXISTS for ALTER TABLE)
    const columnsToAdd = [
      { name: 'birthday', type: 'DATE' },
      { name: 'phone', type: 'VARCHAR(20)' },
      { name: 'interests', type: 'TEXT' },
      { name: 'sharePreferences', type: 'TEXT' },
      { name: 'settings', type: 'TEXT' },
      { name: 'privacySettings', type: 'TEXT' },
      { name: 'usernameChangeCount', type: 'INT DEFAULT 0' },
      { name: 'lastUsernameChange', type: 'DATETIME' }
    ];

    // Check existing columns
    const [existingColumns] = await connection.query('DESCRIBE users');
    const columnNames = existingColumns.map(col => col.Field);

    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        try {
          await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
          console.log(`✓ Added column: ${col.name}`);
        } catch (err) {
          console.warn(`Could not add column ${col.name}:`, err.message);
        }
      }
    }

    // Contacts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        category VARCHAR(50) DEFAULT 'Other',
        notes TEXT,
        interests TEXT,
        preferredInfo VARCHAR(255),
        isFavorite TINYINT(1) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_name (name)
      )
    `);
    
    // Add interests column if it doesn't exist
    const [contactColumns] = await connection.query('DESCRIBE contacts');
    const contactColumnNames = contactColumns.map(col => col.Field);
    if (!contactColumnNames.includes('interests')) {
      try {
        await connection.query('ALTER TABLE contacts ADD COLUMN interests TEXT');
        console.log('✓ Added interests column to contacts table');
      } catch (err) {
        console.warn('Could not add interests column:', err.message);
      }
    }
    console.log('✓ Contacts table ready');

    // Friendships table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS friendships (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        friendId VARCHAR(36) NOT NULL,
        status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_friendship (userId, friendId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (friendId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_friendId (friendId),
        INDEX idx_status (status)
      )
    `);
    console.log('✓ Friendships table ready');
  } catch (error) {
    console.error('Table initialization error:', error.message);
  } finally {
    connection.release();
  }
}

// Promisify database operations (compatible with SQLite interface)
const dbGet = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('dbGet error:', error.message);
    throw error;
  }
};

const dbAll = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      return rows || [];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('dbAll error:', error.message);
    throw error;
  }
};

const dbRun = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(sql, params);
      return { lastID: result.insertId, changes: result.affectedRows };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('dbRun error:', error.message);
    throw error;
  }
};

// Alternative interface (for compatibility)
async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

async function getOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

async function getAll(sql, params = []) {
  return await query(sql, params);
}

async function insert(sql, params = []) {
  return await query(sql, params);
}

async function update(sql, params = []) {
  return await query(sql, params);
}

async function remove(sql, params = []) {
  return await query(sql, params);
}

// Initialize on require
initializePool().catch(err => {
  console.error('Failed to initialize database pool:', err.message);
});

module.exports = { 
  dbGet, 
  dbAll, 
  dbRun, 
  pool,
  getPool: () => pool,
  // Alternative interface
  query,
  getOne,
  getAll,
  insert,
  update,
  remove
};
