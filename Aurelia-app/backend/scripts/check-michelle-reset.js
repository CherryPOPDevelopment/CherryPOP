require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkMichelleReset() {
  console.log('\n=== Checking Michelle\'s Reset Token Status ===\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aurelia_contacts'
  });

  try {
    // Check Michelle's account
    const [users] = await connection.execute(
      'SELECT id, email, firstName, lastName, resetToken, resetTokenExpires FROM users WHERE email = ?',
      ['michelle.wise2004@gmail.com']
    );

    if (users.length === 0) {
      console.log('❌ Michelle\'s account not found!');
      return;
    }

    const user = users[0];
    console.log('✅ User found:', user.firstName, user.lastName);
    console.log('📧 Email:', user.email);
    console.log('🆔 ID:', user.id);
    
    if (user.resetToken) {
      console.log('\n🔑 Reset Token:', user.resetToken);
      console.log('⏰ Expires:', user.resetTokenExpires);
      
      const now = new Date();
      const expires = new Date(user.resetTokenExpires);
      
      if (expires > now) {
        const minutesLeft = Math.floor((expires - now) / 1000 / 60);
        console.log('✅ Token is VALID - expires in', minutesLeft, 'minutes');
        console.log('\n🔗 Reset Link:');
        console.log(`https://aureliacontacts.com/html/reset-password.html?token=${user.resetToken}`);
        console.log('\nOr for local testing:');
        console.log(`http://localhost:5000/html/reset-password.html?token=${user.resetToken}`);
      } else {
        console.log('❌ Token is EXPIRED');
        console.log('\n💡 Request a new password reset from the login page');
      }
    } else {
      console.log('\n⚠️  No active reset token');
      console.log('💡 Request a password reset from the login page');
    }

    // Check recent password resets
    console.log('\n--- Checking for recent password reset attempts ---');
    const [logs] = await connection.execute(
      'SELECT resetToken, resetTokenExpires, updatedAt FROM users WHERE email = ?',
      ['michelle.wise2004@gmail.com']
    );
    
    if (logs.length > 0) {
      const log = logs[0];
      console.log('Last update:', log.updatedAt || 'N/A');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkMichelleReset().catch(console.error);
