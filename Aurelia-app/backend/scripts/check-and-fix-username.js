require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { getOne, getAll, update } = require('../config/mysql-database');

async function checkAndFixUsername() {
  try {
    console.log('\n=== Checking User Data ===\n');

    // Get all users to see what's stored
    const users = await getAll(
      'SELECT id, username, firstName, lastName, email FROM users ORDER BY createdAt DESC LIMIT 20'
    );

    console.log('Current users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Username: "${user.username}"`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log('');
    });

    // Check for Michelle/Cherry specifically
    const michelle = await getOne(
      'SELECT id, username, firstName, lastName, email FROM users WHERE firstName LIKE ? OR username LIKE ? OR email LIKE ?',
      ['%michelle%', '%michelle%', '%michelle%']
    );

    if (michelle) {
      console.log('\n🔍 Found user with "michelle":');
      console.log(`   ID: ${michelle.id}`);
      console.log(`   Email: ${michelle.email}`);
      console.log(`   Username: "${michelle.username}"`);
      console.log(`   FirstName: ${michelle.firstName}`);
      console.log(`   LastName: ${michelle.lastName}`);

      // Ask if username should be "cherry"
      console.log('\n⚠️  If the username should be "cherry" instead of "' + michelle.username + '",');
      console.log('    run this script with the fix flag:');
      console.log(`    node backend/scripts/check-and-fix-username.js fix ${michelle.email} cherry`);
    }

    const cherry = await getOne(
      'SELECT id, username, firstName, lastName, email FROM users WHERE username = ?',
      ['cherry']
    );

    if (cherry) {
      console.log('\n✅ Found user with username "cherry":');
      console.log(`   Email: ${cherry.email}`);
      console.log(`   FirstName: ${cherry.firstName}`);
    }

    console.log('\n=== Check Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function fixUsername(email, newUsername) {
  try {
    console.log(`\n=== Updating Username ===\n`);
    console.log(`Email: ${email}`);
    console.log(`New Username: ${newUsername}\n`);

    // Check if user exists
    const user = await getOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      console.log('❌ User not found with that email');
      process.exit(1);
    }

    console.log(`Current username: "${user.username}"`);

    // Check if new username is already taken
    const existing = await getOne('SELECT * FROM users WHERE username = ? AND email != ?', [newUsername, email]);
    if (existing) {
      console.log('❌ Username already taken by another user');
      process.exit(1);
    }

    // Update username
    await update(
      'UPDATE users SET username = ? WHERE email = ?',
      [newUsername, email]
    );

    console.log(`✅ Username updated to "${newUsername}"`);
    console.log('\n⚠️  The user needs to log out and log back in to see the change.');
    console.log('   Or clear browser localStorage and refresh the page.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args[0] === 'fix' && args[1] && args[2]) {
  fixUsername(args[1], args[2]);
} else {
  checkAndFixUsername();
}
