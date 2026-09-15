/**
 * Monitor Destiny's Verification Status
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { getOne } = require('../config/mysql-database');

async function checkDestinyStatus() {
  const email = 'destinynevaeh1000@gmail.com';

  try {
    const user = await getOne(
      'SELECT id, email, firstName, isVerified, verificationCode, verificationCodeExpires FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.clear();
    console.log('\n========================================');
    console.log('📊 DESTINY\'S VERIFICATION STATUS');
    console.log('========================================\n');
    console.log('👤 Name:', user.firstName);
    console.log('📧 Email:', user.email);
    console.log('✅ Verified:', user.isVerified ? 'YES ✓' : 'NO (pending)');
    console.log('🔑 Current Code:', user.verificationCode || 'None (cleared after verification)');
    console.log('⏰ Code Expires:', user.verificationCodeExpires || 'N/A');
    console.log('\n========================================\n');

    if (user.isVerified) {
      console.log('🎉 SUCCESS! Destiny\'s account is verified!');
      console.log('✅ She can now login to the platform.\n');
      process.exit(0);
    } else {
      console.log('⏳ Waiting for Destiny to enter verification code...');
      console.log('📝 Expected code: 335631\n');
      console.log('This will check again in 5 seconds...\n');
      
      // Check again in 5 seconds
      setTimeout(checkDestinyStatus, 5000);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    setTimeout(checkDestinyStatus, 5000);
  }
}

console.log('Starting verification monitor...');
console.log('Press Ctrl+C to stop\n');
checkDestinyStatus();
