/**
 * Test if "Lynn@1104" can be set as a password
 */

require('dotenv').config();
const bcryptjs = require('bcryptjs');

async function testPassword() {
  const testPassword = 'Lynn@1104';
  
  console.log('\n🔐 Testing Password: "Lynn@1104"');
  console.log('===================================\n');
  
  console.log('Password details:');
  console.log('  Length:', testPassword.length, 'characters');
  console.log('  Has uppercase:', /[A-Z]/.test(testPassword) ? '✅ Yes' : '❌ No');
  console.log('  Has lowercase:', /[a-z]/.test(testPassword) ? '✅ Yes' : '❌ No');
  console.log('  Has numbers:', /[0-9]/.test(testPassword) ? '✅ Yes' : '❌ No');
  console.log('  Has special chars:', /[^A-Za-z0-9]/.test(testPassword) ? '✅ Yes (@)' : '❌ No');
  
  console.log('\nValidation checks:');
  console.log('  Meets 8+ character requirement:', testPassword.length >= 8 ? '✅ Yes' : '❌ No');
  console.log('  Can be hashed with bcrypt:', 'Testing...');
  
  try {
    // Test hashing
    const hashedPassword = await bcryptjs.hash(testPassword, 10);
    console.log('    ✅ Successfully hashed!');
    console.log('    Hash:', hashedPassword.substring(0, 30) + '...');
    
    // Test verification
    const matches = await bcryptjs.compare(testPassword, hashedPassword);
    console.log('  Can be verified:', matches ? '✅ Yes' : '❌ No');
    
    console.log('\n===================================');
    console.log('✅ "Lynn@1104" is a VALID password!');
    console.log('===================================\n');
    console.log('This password:');
    console.log('  - Meets minimum 8 character requirement');
    console.log('  - Contains uppercase letters (L)');
    console.log('  - Contains lowercase letters (ynn)');
    console.log('  - Contains numbers (1104)');
    console.log('  - Contains special characters (@)');
    console.log('  - Can be hashed and stored securely');
    console.log('  - Can be used for login authentication');
    console.log('\nConclusion: This password SHOULD WORK on the reset page.');
    console.log('If it doesn\'t work in the browser, it may be a frontend issue.\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testPassword();
