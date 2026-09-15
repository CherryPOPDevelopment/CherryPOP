require('dotenv').config();
const { getAll } = require('../config/mysql-database');

async function listUsers() {
  try {
    console.log('\n=== Users in Database ===\n');
    
    const users = await getAll(
      'SELECT id, username, email, firstName, lastName, createdAt FROM users ORDER BY createdAt DESC'
    );

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    console.log(`Total users: ${users.length}\n`);
    console.log('User List:');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt || 'N/A'}`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log('\nNote: Passwords are hashed and cannot be displayed.');
    console.log('To reset a password, use: node backend/scripts/reset-user-password.js\n');
    
  } catch (error) {
    console.error('Error listing users:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

listUsers();
