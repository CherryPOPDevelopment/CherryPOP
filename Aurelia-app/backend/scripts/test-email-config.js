/**
 * Test Email Configuration
 * Checks if email credentials are properly configured
 */

require('dotenv').config();

console.log('\n========================================');
console.log('EMAIL CONFIGURATION CHECK');
console.log('========================================\n');

console.log('Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '❌ NOT SET');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '❌ NOT SET');
console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE || '❌ NOT SET');

console.log('\n========================================');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.log('\n❌ EMAIL CONFIGURATION IS INCOMPLETE!\n');
  console.log('This is why NO emails are being sent (not to Michelle, not to Jordan, not to anyone).\n');
  console.log('To fix this:');
  console.log('1. Open the file: c:\\Users\\miche\\Aurelia.V1\\.env');
  console.log('2. Add these lines (they may already be there but commented out):\n');
  console.log('   EMAIL_USER=Support@Aureliacontacts.com');
  console.log('   EMAIL_PASSWORD=your-actual-password-here');
  console.log('   EMAIL_HOST=smtp.titan.email');
  console.log('   EMAIL_PORT=587');
  console.log('   EMAIL_SECURE=false\n');
  console.log('3. Replace "your-actual-password-here" with the real password');
  console.log('4. Save the file');
  console.log('5. Restart the server\n');
  console.log('========================================\n');
  process.exit(1);
} else {
  console.log('\n✅ EMAIL CONFIGURATION LOOKS GOOD!\n');
  console.log('Now testing email connection...\n');
  
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  transporter.verify()
    .then(() => {
      console.log('✅ Email server connection SUCCESSFUL!');
      console.log('✅ Emails will be sent to the correct recipients.\n');
      console.log('========================================\n');
      process.exit(0);
    })
    .catch((err) => {
      console.log('❌ Email server connection FAILED!');
      console.log('Error:', err.message);
      console.log('\nThis means emails cannot be sent.');
      console.log('Please check:');
      console.log('1. EMAIL_USER is correct');
      console.log('2. EMAIL_PASSWORD is correct');
      console.log('3. EMAIL_HOST is correct');
      console.log('4. EMAIL_PORT is correct\n');
      console.log('========================================\n');
      process.exit(1);
    });
}
