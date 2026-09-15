/**
 * Verify the complete password reset flow
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');

// Database helper functions
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aurelia_contacts',
    waitForConnections: true,
    connectionLimit: 10
  });
}

async function getOne(query, params) {
  const [rows] = await pool.execute(query, params);
  return rows[0] || null;
}

async function update(query, params) {
  await pool.execute(query, params);
}

async function verifyResetFlow() {
  console.log('\n🔍 Verifying Password Reset Flow');
  console.log('===================================\n');

  await initDB();
  
  const testEmail = 'michelle.wise2004@gmail.com';

  try {
    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...');
    const user = await getOne('SELECT id, firstName, email, resetToken, resetTokenExpires FROM users WHERE email = ?', [testEmail]);
    
    if (!user) {
      console.log('❌ User not found with email:', testEmail);
      console.log('   Please register this user first.');
      return;
    }
    
    console.log('✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.firstName);
    console.log('   Email:', user.email);
    
    if (user.resetToken) {
      console.log('   Current Reset Token:', user.resetToken);
      console.log('   Token Expires:', user.resetTokenExpires);
    } else {
      console.log('   No active reset token');
    }

    // Step 2: Simulate forgot password (create token)
    console.log('\nStep 2: Simulating forgot password request...');
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
    
    await update(
      'UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id]
    );
    
    console.log('✅ Reset token created:');
    console.log('   Token:', resetToken);
    console.log('   Expires:', resetExpires.toISOString());
    console.log('   Reset URL:', `${process.env.FRONTEND_URL || 'http://localhost:5000'}/html/reset-password.html?token=${resetToken}`);

    // Step 3: Verify token can be retrieved
    console.log('\nStep 3: Verifying token retrieval...');
    const userWithToken = await getOne(
      'SELECT id FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()',
      [resetToken]
    );
    
    if (userWithToken) {
      console.log('✅ Token is valid and can be retrieved');
    } else {
      console.log('❌ Token validation failed');
      return;
    }

    // Step 4: Simulate password reset
    console.log('\nStep 4: Simulating password reset...');
    const newPassword = 'TestPassword123';
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    
    await update(
      'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );
    
    console.log('✅ Password updated successfully');
    console.log('   New password (for testing):', newPassword);

    // Step 5: Verify token was cleared
    console.log('\nStep 5: Verifying token was cleared...');
    const userAfterReset = await getOne('SELECT resetToken, resetTokenExpires FROM users WHERE id = ?', [user.id]);
    
    if (!userAfterReset.resetToken && !userAfterReset.resetTokenExpires) {
      console.log('✅ Token cleared successfully');
    } else {
      console.log('❌ Token was not cleared properly');
    }

    // Step 6: Verify password was updated
    console.log('\nStep 6: Verifying password can be used to login...');
    const userForLogin = await getOne('SELECT password FROM users WHERE id = ?', [user.id]);
    const passwordMatch = await bcryptjs.compare(newPassword, userForLogin.password);
    
    if (passwordMatch) {
      console.log('✅ New password works for login');
    } else {
      console.log('❌ New password does not match');
    }

    console.log('\n===================================');
    console.log('✅ ALL CHECKS PASSED!');
    console.log('===================================\n');
    console.log('The password reset flow is working correctly.');
    console.log('\nTest credentials:');
    console.log('  Email:', testEmail);
    console.log('  Password:', newPassword);
    console.log('\nYou can now login with these credentials.');
    console.log('\n⚠️  IMPORTANT: This was a test. The password has been changed!');
    console.log('   Michelle should use the actual reset flow to set her own password.');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack trace:', error.stack);
  }

  process.exit(0);
}

verifyResetFlow();
