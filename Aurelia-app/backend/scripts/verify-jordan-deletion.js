/**
 * Verify Jordan's Account Deletion
 * Checks all tables for any traces of Jordan's account
 */

const db = require('../config/mysql-database');

const JORDAN_EMAIL = 'jacksonsky101@gmail.com';
const JORDAN_USERNAME = 'jordan';

async function verifyJordanDeletion() {
  try {
    console.log('\n=== VERIFYING JORDAN\'S ACCOUNT DELETION ===\n');
    
    const pool = db.getPool();
    if (!pool) {
      console.error('❌ Database pool not initialized');
      process.exit(1);
    }

    let foundAnyData = false;

    // Check users table
    console.log('1. Checking users table...');
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username LIKE ?',
      [JORDAN_EMAIL, '%jordan%']
    );
    
    if (users.length > 0) {
      console.log('❌ FOUND USER DATA:');
      users.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
      });
      foundAnyData = true;
    } else {
      console.log('✅ No user records found for Jordan');
    }

    // Check contacts table (as owner)
    console.log('\n2. Checking contacts table (owned by Jordan)...');
    const [contacts] = await pool.query(
      'SELECT c.* FROM contacts c JOIN users u ON c.userId = u.id WHERE u.email = ? OR u.username LIKE ?',
      [JORDAN_EMAIL, '%jordan%']
    );
    
    if (contacts.length > 0) {
      console.log(`❌ FOUND ${contacts.length} CONTACT(S) owned by Jordan`);
      foundAnyData = true;
    } else {
      console.log('✅ No contacts owned by Jordan');
    }

    // Check friendships table
    console.log('\n3. Checking friendships table (Jordan as friend or user)...');
    try {
      const [friendships] = await pool.query(
        `SELECT f.* FROM friendships f 
         JOIN users u1 ON f.userId = u1.id 
         LEFT JOIN users u2 ON f.friendId = u2.id 
         WHERE u1.email = ? OR u1.username LIKE ? OR u2.email = ? OR u2.username LIKE ?`,
        [JORDAN_EMAIL, '%jordan%', JORDAN_EMAIL, '%jordan%']
      );
      
      if (friendships.length > 0) {
        console.log(`❌ FOUND ${friendships.length} FRIENDSHIP(S) involving Jordan`);
        foundAnyData = true;
      } else {
        console.log('✅ No friendships involving Jordan');
      }
    } catch (error) {
      console.log('   (Table may not exist, skipping)');
    }

    // Check user_interests table
    console.log('\n4. Checking user_interests table...');
    try {
      const [interests] = await pool.query(
        `SELECT ui.* FROM user_interests ui 
         JOIN users u ON ui.userId = u.id 
         WHERE u.email = ? OR u.username LIKE ?`,
        [JORDAN_EMAIL, '%jordan%']
      );
      
      if (interests.length > 0) {
        console.log(`❌ FOUND ${interests.length} USER INTEREST(S) for Jordan`);
        foundAnyData = true;
      } else {
        console.log('✅ No user interests for Jordan');
      }
    } catch (error) {
      console.log('   (Table may not exist, skipping)');
    }

    // Check verification_tokens table
    console.log('\n5. Checking verification_tokens table...');
    try {
      const [tokens] = await pool.query(
        'SELECT * FROM verification_tokens WHERE email = ?',
        [JORDAN_EMAIL]
      );
      
      if (tokens.length > 0) {
        console.log(`❌ FOUND ${tokens.length} VERIFICATION TOKEN(S) for Jordan`);
        foundAnyData = true;
      } else {
        console.log('✅ No verification tokens for Jordan');
      }
    } catch (error) {
      console.log('   (Table may not exist, skipping)');
    }

    // Check password_reset_tokens table (if exists)
    console.log('\n6. Checking password_reset_tokens table...');
    try {
      const [resetTokens] = await pool.query(
        'SELECT * FROM password_reset_tokens WHERE email = ?',
        [JORDAN_EMAIL]
      );
      
      if (resetTokens.length > 0) {
        console.log(`❌ FOUND ${resetTokens.length} PASSWORD RESET TOKEN(S) for Jordan`);
        foundAnyData = true;
      } else {
        console.log('✅ No password reset tokens for Jordan');
      }
    } catch (error) {
      console.log('   (Table may not exist, skipping)');
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    if (foundAnyData) {
      console.log('\n❌ VERIFICATION FAILED: Jordan\'s data still exists in the database!');
      console.log('   Account has NOT been permanently deleted.\n');
      process.exit(1);
    } else {
      console.log('\n✅ VERIFICATION SUCCESSFUL: Jordan\'s account has been permanently deleted!');
      console.log('   No traces of Jordan found in any table.\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the verification
verifyJordanDeletion();
