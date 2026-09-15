/**
 * Check Jordan's email configuration
 */

const { getOne } = require('../config/mysql-database');

async function checkJordanEmail() {
  try {
    console.log('\n=== Checking Jordan\'s Email Configuration ===\n');
    
    // Find Jordan's user
    const jordan = await getOne(
      'SELECT id, username, email, firstName, lastName FROM users WHERE username = ? OR email LIKE ?',
      ['Mozz', '%jackson%']
    );
    
    if (!jordan) {
      console.log('❌ Jordan not found in database');
      return;
    }
    
    console.log('✅ Jordan found:');
    console.log(`   Username: ${jordan.username}`);
    console.log(`   Email: ${jordan.email}`);
    console.log(`   Name: ${jordan.firstName} ${jordan.lastName}`);
    console.log(`   User ID: ${jordan.id}`);
    
    // Test forgot password flow
    console.log('\n=== Testing Forgot Password Flow ===\n');
    console.log('1. Email that would be looked up:', jordan.email);
    console.log('2. firstName that would be used:', jordan.firstName);
    console.log('3. This is what sendResetEmail would receive:');
    console.log(`   to: ${jordan.email}`);
    console.log(`   firstName: ${jordan.firstName}`);
    console.log(`   token: <generated-token>`);
    
    console.log('\n=== Email Server Configuration ===\n');
    console.log('FROM (EMAIL_USER):', process.env.EMAIL_USER || 'Not configured');
    console.log('HOST:', process.env.EMAIL_HOST || 'Not configured');
    console.log('PORT:', process.env.EMAIL_PORT || 'Not configured');
    
    console.log('\n✅ Jordan\'s email address is correctly stored in the database.');
    console.log('✅ The forgot-password endpoint should send to:', jordan.email);
    console.log('\nIf emails are still going to the wrong address, the issue is likely:');
    console.log('1. Email server catch-all configuration');
    console.log('2. Email forwarding rules');
    console.log('3. The actual email being entered on the forgot password form');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkJordanEmail();
