require('dotenv').config();
const { getOne, remove, getPool } = require('../config/mysql-database');

async function deleteTestUsers() {
  try {
    console.log('\n=== Deleting Test Users ===\n');

    // Test User 1
    const email1 = 'test@example.com';
    const username1 = 'testuser';
    
    const user1 = await getOne(
      'SELECT id, email, username FROM users WHERE email = ? OR username = ?',
      [email1, username1]
    );

    if (user1) {
      console.log(`Found Test User 1: ${user1.email} (${user1.username})`);
      
      // Delete user's contacts
      await remove('DELETE FROM contacts WHERE userId = ?', [user1.id]);
      console.log('  ✓ Deleted contacts');
      
      // Delete user's friendships
      await remove('DELETE FROM friendships WHERE userId = ? OR friendId = ?', [user1.id, user1.id]);
      console.log('  ✓ Deleted friendships');
      
      // Delete user
      await remove('DELETE FROM users WHERE id = ?', [user1.id]);
      console.log(`  ✓ Deleted user: ${user1.email}\n`);
    } else {
      console.log(`Test User 1 (${email1}) not found.\n`);
    }

    // Test User 2
    const email2 = 'demo@example.com';
    const username2 = 'demouser';
    
    const user2 = await getOne(
      'SELECT id, email, username FROM users WHERE email = ? OR username = ?',
      [email2, username2]
    );

    if (user2) {
      console.log(`Found Test User 2: ${user2.email} (${user2.username})`);
      
      // Delete user's contacts
      await remove('DELETE FROM contacts WHERE userId = ?', [user2.id]);
      console.log('  ✓ Deleted contacts');
      
      // Delete user's friendships
      await remove('DELETE FROM friendships WHERE userId = ? OR friendId = ?', [user2.id, user2.id]);
      console.log('  ✓ Deleted friendships');
      
      // Delete user
      await remove('DELETE FROM users WHERE id = ?', [user2.id]);
      console.log(`  ✓ Deleted user: ${user2.email}\n`);
    } else {
      console.log(`Test User 2 (${email2}) not found.\n`);
    }

    console.log('Test users deletion completed!\n');
    
  } catch (error) {
    console.error('Error deleting test users:', error.message);
    process.exit(1);
  } finally {
    // Wait a bit for database operations to complete
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

// Wait for database pool to initialize
const pool = getPool();
if (pool) {
  deleteTestUsers();
} else {
  // Wait a bit and try again
  setTimeout(() => {
    deleteTestUsers();
  }, 2000);
}
