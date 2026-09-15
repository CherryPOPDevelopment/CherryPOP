const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✓ Connected to MySQL');

    // Create database
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'aurelia_contacts'}`);
      console.log(`✓ Database ${process.env.DB_NAME || 'aurelia_contacts'} created/exists`);
    } catch (err) {
      console.error('Error creating database:', err.message);
    }

    // Switch to database
    await connection.query(`USE ${process.env.DB_NAME || 'aurelia_contacts'}`);
    console.log(`✓ Using database ${process.env.DB_NAME || 'aurelia_contacts'}`);

    // Create users table with interests column
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        bio TEXT,
        profilePicture LONGTEXT,
        birthday VARCHAR(10),
        phone VARCHAR(20),
        isVerified BOOLEAN DEFAULT FALSE,
        verificationCode VARCHAR(10),
        verificationCodeExpires DATETIME,
        interests JSON DEFAULT NULL,
        sharePreferences JSON,
        settings JSON,
        resetToken VARCHAR(255),
        resetTokenExpires DATETIME,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Users table created/exists');

    for (const column of [
      "ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'",
      'ADD COLUMN isVerified BOOLEAN DEFAULT FALSE',
      'ADD COLUMN verificationCode VARCHAR(10)',
      'ADD COLUMN verificationCodeExpires DATETIME'
    ]) {
      try {
        await connection.query(`ALTER TABLE users ${column}`);
      } catch (err) {
        if (!err.message.includes('Duplicate column name')) throw err;
      }
    }

    // Create contacts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        category VARCHAR(50),
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Contacts table created/exists');

    // Create friendships table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS friendships (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        friendId VARCHAR(36) NOT NULL,
        status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (friendId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_friendship (userId, friendId),
        INDEX idx_status (status),
        INDEX idx_userId (userId),
        INDEX idx_friendId (friendId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Friendships table created/exists');

    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now start your server with: npm start');

  } catch (error) {
    console.error('Database setup error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
