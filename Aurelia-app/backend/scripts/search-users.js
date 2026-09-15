require('dotenv').config();
const { getAll, getOne } = require('../config/mysql-database');

async function searchUsers() {
  try {
    console.log('\n=== Searching for Users ===\n');
    
    // Search for specific emails
    const emails = ['michelle.wise2004@gmail.com', 'nathanlorenzen1@gmail.com'];
    
    for (const email of emails) {
      const user = await getOne(
        'SELECT id, username, email, firstName, lastName, createdAt FROM users WHERE email = ?',
        [email]
      );
      
      if (user) {
        console.log(`✓ Found user: ${email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   User ID: ${user.id}`);
        console.log(`   Created: ${user.createdAt}\n`);
      } else {
        console.log(`✗ User not found: ${email}\n`);
      }
    }
    
    // List all users
    console.log('All users in database:');
    console.log('─'.repeat(80));
    const allUsers = await getAll(
      'SELECT id, username, email, firstName, lastName, createdAt FROM users ORDER BY createdAt DESC'
    );
    
    if (allUsers.length === 0) {
      console.log('No users found in database.\n');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.username}) - ${user.firstName} ${user.lastName}`);
      });
    }
    
    // Check database name
    const dbInfo = await getOne('SELECT DATABASE() as db');
    console.log(`\nCurrent database: ${dbInfo?.db || 'unknown'}`);
    
  } catch (error) {
    console.error('Error searching users:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

searchUsers();
