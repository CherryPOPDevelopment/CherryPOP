require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

(async () => {
  // Connect without selecting a DB first so we can CREATE DATABASE
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'Database', 'schema.sql'), 'utf8');
    await conn.query(sql);
    console.log('✓ Full schema applied (database + all tables + seed data)');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
})();
