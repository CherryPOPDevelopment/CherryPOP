require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkAllDatabases() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('\n=== Checking All Databases ===\n');

    // List all databases
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('Available databases:');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });

    // Check each database for users
    console.log('\n=== Searching for Users in All Databases ===\n');
    
    for (const dbRow of databases) {
      const dbName = dbRow.Database;
      
      // Skip system databases
      if (['information_schema', 'performance_schema', 'mysql', 'sys'].includes(dbName)) {
        continue;
      }

      try {
        await connection.query(`USE ${dbName}`);
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        
        if (tableNames.includes('users')) {
          const [users] = await connection.query('SELECT email, username, firstName, lastName, createdAt FROM users');
          
          if (users.length > 0) {
            console.log(`\n📊 Database: ${dbName}`);
            console.log(`   Found ${users.length} user(s):`);
            users.forEach(user => {
              console.log(`   - ${user.email} (${user.username}) - ${user.firstName} ${user.lastName}`);
            });
          }
        }
      } catch (err) {
        // Skip databases we can't access
      }
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkAllDatabases();
