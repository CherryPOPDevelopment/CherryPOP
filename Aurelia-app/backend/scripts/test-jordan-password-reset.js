/**
 * Test Password Reset Email for Jordan
 * Sends a real password reset email to Jordan's email address
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const JORDAN_EMAIL = 'jacksonsky101@gmail.com';

async function testJordanPasswordReset() {
  console.log('\n========================================');
  console.log('TESTING PASSWORD RESET FOR JORDAN');
  console.log('========================================\n');
  
  console.log(`📧 Jordan's email: ${JORDAN_EMAIL}`);
  console.log('📧 Sending password reset request...\n');

  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, {
      email: JORDAN_EMAIL
    });

    if (response.status === 200) {
      console.log('✅ Password reset request successful!');
      console.log('✅ Response:', response.data);
      console.log('\n========================================');
      console.log('CHECK JORDAN\'S EMAIL INBOX');
      console.log('========================================\n');
      console.log(`Email should be sent to: ${JORDAN_EMAIL}`);
      console.log('Subject: "Aurelia Contacts - Password reset"');
      console.log('\nIf the email went to Michelle instead, that means:');
      console.log('1. There is a catch-all on the email server');
      console.log('2. There is an email forwarding rule');
      console.log('3. The email server is misconfigured\n');
      console.log('Check the server logs to see exactly where the email was sent.');
      console.log('Look for the "📧 === EMAIL SENDING DEBUG ===" section.\n');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testJordanPasswordReset();
