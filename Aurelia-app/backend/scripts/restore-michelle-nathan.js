require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getOne, insert } = require('../config/mysql-database');

async function restoreUsers() {
  try {
    console.log('\n=== Restoring Michelle and Nathan Accounts ===\n');

    // Michelle's account
    const michelleEmail = 'michelle.wise2004@gmail.com';
    const michelleUser = await getOne('SELECT id FROM users WHERE email = ?', [michelleEmail]);
    
    if (michelleUser) {
      console.log(`✓ Michelle's account already exists: ${michelleEmail}`);
    } else {
      console.log('Creating Michelle\'s account...');
      console.log('⚠️  You will need to set a password using the reset password feature.');
      
      const michelleId = uuidv4();
      // Create with a temporary password that needs to be reset
      const tempPassword = await bcryptjs.hash('TempPassword123!', 10);
      
      await insert(
        'INSERT INTO users (id, username, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [michelleId, 'michelle', michelleEmail, tempPassword, 'Michelle', 'Wise']
      );
      
      console.log(`✓ Created Michelle's account: ${michelleEmail}`);
      console.log(`   Username: michelle`);
      console.log(`   Temporary password: TempPassword123!`);
      console.log(`   ⚠️  Please change this password immediately after logging in!\n`);
    }

    // Nathan's account
    const nathanEmail = 'nathanlorenzen1@gmail.com';
    const nathanUser = await getOne('SELECT id FROM users WHERE email = ?', [nathanEmail]);
    
    if (nathanUser) {
      console.log(`✓ Nathan's account already exists: ${nathanEmail}`);
    } else {
      console.log('Creating Nathan\'s account...');
      console.log('⚠️  You will need to set a password using the reset password feature.');
      
      const nathanId = uuidv4();
      // Create with a temporary password that needs to be reset
      const tempPassword = await bcryptjs.hash('TempPassword123!', 10);
      
      await insert(
        'INSERT INTO users (id, username, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [nathanId, 'nathan', nathanEmail, tempPassword, 'Nathan', 'Lorenzen']
      );
      
      console.log(`✓ Created Nathan's account: ${nathanEmail}`);
      console.log(`   Username: nathan`);
      console.log(`   Temporary password: TempPassword123!`);
      console.log(`   ⚠️  Please change this password immediately after logging in!\n`);
    }

    console.log('\n✅ Accounts restored!');
    console.log('\n⚠️  IMPORTANT:');
    console.log('   1. Log in with the temporary password: TempPassword123!');
    console.log('   2. Immediately change your password in the Settings tab');
    console.log('   3. Your previous profile data (contacts, friends, etc.) cannot be recovered');
    console.log('   4. You will need to re-enter your profile information\n');
    
  } catch (error) {
    console.error('Error restoring accounts:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

restoreUsers();
