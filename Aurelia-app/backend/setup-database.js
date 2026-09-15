require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Connect to MySQL without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ Connected to MySQL');

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'aurelia_contacts'}`);
    console.log('✓ Database created/verified');

    // Use database
    await connection.query(`USE ${process.env.DB_NAME || 'aurelia_contacts'}`);

    // Create users table with all profile fields
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
    console.log('✓ Users table created');
    
    // Add missing columns if they don't exist (for existing databases)
    try {
      await connection.query('ALTER TABLE users ADD COLUMN birthday DATE');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN interests TEXT');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN sharePreferences TEXT');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN settings TEXT');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN privacySettings TEXT');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn(e.message); }

    // Create contacts table
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
        preferredInfo VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_name (name)
      )
    `);
    console.log('✓ Contacts table created');

    // Create friendships table
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
    console.log('✓ Friendships table created');

    // Add missing profile columns if they don't exist
    console.log('\nAdding profile columns...');
    try {
      await connection.query('ALTER TABLE users ADD COLUMN birthday DATE');
      console.log('✓ Added birthday column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('birthday:', e.message); }
    
    try {
      await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
      console.log('✓ Added phone column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('phone:', e.message); }
    
    try {
      await connection.query('ALTER TABLE users ADD COLUMN interests TEXT');
      console.log('✓ Added interests column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('interests:', e.message); }
    
    try {
      await connection.query('ALTER TABLE users ADD COLUMN sharePreferences TEXT');
      console.log('✓ Added sharePreferences column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('sharePreferences:', e.message); }
    
    try {
      await connection.query('ALTER TABLE users ADD COLUMN settings TEXT');
      console.log('✓ Added settings column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('settings:', e.message); }
    
    try {
      await connection.query('ALTER TABLE users ADD COLUMN privacySettings TEXT');
      console.log('✓ Added privacySettings column');
    } catch (e) { if (!e.message.includes('Duplicate')) console.warn('privacySettings:', e.message); }

    await connection.end();
    console.log('\n✅ Database setup completed successfully!');
    console.log('📧 Support email: support@aureliacontacts.com');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MySQL is running (start it from XAMPP Control Panel)');
    console.error('   2. MySQL credentials in .env are correct');
    console.error('   3. MySQL port 3306 is not blocked');
    process.exit(1);
  }
}

setupDatabase();
