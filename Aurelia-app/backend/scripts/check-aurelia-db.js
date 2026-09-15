require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkAureliaDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('\n=== Checking "aurelia" Database ===\n');

    await connection.query('USE aurelia');
    
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log('Tables in "aurelia" database:', tableNames.join(', '));

    if (tableNames.includes('users')) {
      const [users] = await connection.query('SELECT email, username, firstName, lastName, createdAt FROM users ORDER BY createdAt DESC');
      
      console.log(`\nFound ${users.length} user(s) in "aurelia" database:\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.username})`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Created: ${user.createdAt}\n`);
      });

      // Check for the specific users
      const [michelle] = await connection.query('SELECT * FROM users WHERE email = ?', ['michelle.wise2004@gmail.com']);
      const [nathan] = await connection.query('SELECT * FROM users WHERE email = ?', ['nathanlorenzen1@gmail.com']);

      if (michelle.length > 0) {
        console.log('✓ Found Michelle in "aurelia" database!');
      }
      if (nathan.length > 0) {
        console.log('✓ Found Nathan in "aurelia" database!');
      }
    } else {
      console.log('No "users" table found in "aurelia" database.');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkAureliaDB();
