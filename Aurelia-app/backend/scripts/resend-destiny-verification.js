/**
 * Resend Verification Code for Destiny
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { getOne, update } = require('../config/mysql-database');
const { sendWelcomeEmail } = require('../config/email');

async function resendDestinyVerification() {
  console.log('\n========================================');
  console.log('RESENDING VERIFICATION FOR DESTINY');
  console.log('========================================\n');

  const email = 'destinynevaeh1000@gmail.com';

  try {
    // Get Destiny's user record
    const user = await getOne(
      'SELECT id, email, firstName, isVerified FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.firstName);
    console.log('   Email:', user.email);
    console.log('   Already verified:', user.isVerified);

    if (user.isVerified) {
      console.log('\n✅ User already verified! No action needed.');
      return;
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    console.log('\n🔑 New verification code:', verificationCode);
    console.log('   Expires:', verificationExpires);

    // Update database
    await update(
      'UPDATE users SET verificationCode = ?, verificationCodeExpires = ? WHERE id = ?',
      [verificationCode, verificationExpires, user.id]
    );

    console.log('✅ Database updated');

    // Send email
    console.log('\n📧 Sending verification email...');
    try {
      await sendWelcomeEmail(email, user.firstName, verificationCode);
      console.log('✅ Email sent successfully!');
    } catch (e) {
      console.warn('⚠️ Email send failed:', e.message);
    }

    console.log('\n========================================');
    console.log('✅ NEW VERIFICATION CODE SENT!');
    console.log('========================================\n');
    console.log('Tell Destiny to:');
    console.log('1. Check her email at:', email);
    console.log('2. Use verification code:', verificationCode);
    console.log('3. Go to the verification page on your domain');
    console.log('4. Enter the code and verify\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

resendDestinyVerification();
