const { getOne } = require('../config/mysql-database');

async function checkMichelleProfile() {
  try {
    console.log('=== Checking Michelle\'s Profile ===\n');
    
    // Find Michelle by email
    const user = await getOne(
      'SELECT * FROM users WHERE email LIKE ? OR firstName LIKE ? OR username LIKE ?',
      ['%michelle%', '%michelle%', '%michelle%']
    );
    
    if (!user) {
      console.log('❌ Michelle not found in database');
      console.log('\nSearching all users...');
      const { getAll } = require('../config/mysql-database');
      const allUsers = await getAll('SELECT id, username, email, firstName, lastName FROM users LIMIT 10');
      console.log('Users in database:', allUsers);
      return;
    }
    
    console.log('✓ User found!');
    console.log('\nProfile Data:');
    console.log('  ID:', user.id);
    console.log('  Username:', user.username);
    console.log('  Email:', user.email);
    console.log('  First Name:', user.firstName);
    console.log('  Last Name:', user.lastName);
    console.log('  Phone:', user.phone || '(not set)');
    console.log('  Birthday:', user.birthday || '(not set)');
    console.log('  Bio:', user.bio || '(not set)');
    console.log('  Profile Picture:', user.profilePicture ? `YES (${user.profilePicture.length} chars)` : '(not set)');
    console.log('  Interests:', user.interests || '(not set)');
    console.log('  Created:', user.createdAt);
    console.log('  Email Verified:', user.emailVerified);
    
    console.log('\n=== Checking if firstName/lastName are empty ===');
    if (!user.firstName || user.firstName.trim() === '') {
      console.log('❌ firstName is EMPTY or NULL!');
    } else {
      console.log('✓ firstName has value:', user.firstName);
    }
    
    if (!user.lastName || user.lastName.trim() === '') {
      console.log('❌ lastName is EMPTY or NULL!');
    } else {
      console.log('✓ lastName has value:', user.lastName);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMichelleProfile();
