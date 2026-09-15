require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getOne, insert } = require('../config/mysql-database');

async function createTestUser() {
  try {
    console.log('\n=== Creating Test Users ===\n');

    // Test User 1
    const email1 = 'test@example.com';
    const username1 = 'testuser';
    const password1 = 'Test1234';
    
    // Check if user exists
    const existing1 = await getOne(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email1, username1]
    );

    if (existing1) {
      console.log(`User ${email1} already exists.`);
    } else {
      const hashedPassword1 = await bcryptjs.hash(password1, 10);
      const userId1 = uuidv4();
      
      await insert(
        'INSERT INTO users (id, username, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId1, username1, email1, hashedPassword1, 'Test', 'User']
      );
      
      console.log('✓ Created Test User 1:');
      console.log(`   Email: ${email1}`);
      console.log(`   Username: ${username1}`);
      console.log(`   Password: ${password1}`);
      console.log(`   Name: Test User\n`);
    }

    // Test User 2
    const email2 = 'demo@example.com';
    const username2 = 'demouser';
    const password2 = 'Demo1234';
    
    const existing2 = await getOne(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email2, username2]
    );

    if (existing2) {
      console.log(`User ${email2} already exists.`);
    } else {
      const hashedPassword2 = await bcryptjs.hash(password2, 10);
      const userId2 = uuidv4();
      
      await insert(
        'INSERT INTO users (id, username, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId2, username2, email2, hashedPassword2, 'Demo', 'User']
      );
      
      console.log('✓ Created Test User 2:');
      console.log(`   Email: ${email2}`);
      console.log(`   Username: ${username2}`);
      console.log(`   Password: ${password2}`);
      console.log(`   Name: Demo User\n`);
    }

    console.log('Test users created successfully!\n');
    
  } catch (error) {
    console.error('Error creating test users:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createTestUser();
