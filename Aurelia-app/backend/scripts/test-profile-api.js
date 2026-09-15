const { getOne } = require('../config/mysql-database');

async function testProfileAPI() {
  try {
    console.log('=== Testing Profile API Query ===\n');
    
    // Find Michelle
    const user = await getOne(
      'SELECT id, username, email, firstName, lastName, bio, profilePicture, birthday, phone, interests, sharePreferences, settings, privacySettings, createdAt, usernameChangeCount, lastUsernameChange FROM users WHERE email = ?',
      ['michelle.wise2004@gmail.com']
    );
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✓ Query successful!');
    console.log('\nAPI Response (what frontend receives):');
    console.log(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        phone: user.phone,
        birthday: user.birthday,
        profilePicture: user.profilePicture ? '(has picture)' : null
      },
      usernameChangesRemaining: 2
    }, null, 2));
    
    console.log('\n=== Checking Field Values ===');
    console.log('firstName:', JSON.stringify(user.firstName), '(type:', typeof user.firstName + ')');
    console.log('lastName:', JSON.stringify(user.lastName), '(type:', typeof user.lastName + ')');
    console.log('email:', JSON.stringify(user.email), '(type:', typeof user.email + ')');
    console.log('username:', JSON.stringify(user.username), '(type:', typeof user.username + ')');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testProfileAPI();
