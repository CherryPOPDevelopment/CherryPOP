/**
 * Test script to send a password reset email
 * Usage: node backend/scripts/test-reset-email.js <email>
 */

require('dotenv').config();
const { sendResetEmail } = require('../config/email');
const { v4: uuidv4 } = require('uuid');

async function testResetEmail() {
  // Get email from command line or use default
  const testEmail = process.argv[2] || 'michelle.wise2004@gmail.com';
  const testFirstName = 'Michelle';
  const testToken = uuidv4();

  console.log('\n📧 Testing Password Reset Email');
  console.log('================================');
  console.log(`To: ${testEmail}`);
  console.log(`Token: ${testToken}`);
  console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/html/reset-password.html?token=${testToken}`);
  console.log('\nSending email...\n');

  try {
    const result = await sendResetEmail(testEmail, testFirstName, testToken);
    
    if (result) {
      console.log('✅ SUCCESS! Password reset email sent successfully');
      console.log('\nCheck your inbox at:', testEmail);
      console.log('The email should arrive within a few minutes.');
      console.log('\nNote: Check spam folder if you don\'t see it in inbox.');
    } else {
      console.log('❌ FAILED! Email was not sent.');
      console.log('\nPossible reasons:');
      console.log('1. Email credentials not configured in .env file');
      console.log('2. SMTP connection blocked by firewall');
      console.log('3. Invalid email credentials');
      console.log('\nPlease check your .env file and ensure:');
      console.log('- EMAIL_USER is set');
      console.log('- EMAIL_PASSWORD is set');
      console.log('- EMAIL_HOST is correct');
      console.log('- EMAIL_PORT is correct (587 or 465)');
      console.log('- Firewall allows SMTP connections');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\nPlease verify your email configuration in .env file');
  }
}

testResetEmail();
