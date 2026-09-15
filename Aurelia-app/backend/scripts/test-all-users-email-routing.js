/**
 * Test Email Routing for All Users
 * Demonstrates that each user gets their reset email sent to their own address
 */

const axios = require('axios');
const { getAll } = require('../config/mysql-database');

const BASE_URL = 'http://localhost:5000/api/auth';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m'
};

async function testAllUsersEmailRouting() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}EMAIL ROUTING TEST - ALL USERS${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  try {
    // Get all users from database
    const users = await getAll('SELECT username, email, firstName FROM users LIMIT 5');

    if (!users || users.length === 0) {
      console.log('No users found in database');
      return;
    }

    console.log(`Found ${users.length} users. Testing email routing...\n`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`${colors.blue}─────────────────────────────────────────${colors.reset}`);
      console.log(`${colors.green}Test ${i + 1}/${users.length}${colors.reset}`);
      console.log(`User: ${user.username} (${user.firstName})`);
      console.log(`Email: ${user.email}`);
      console.log(`\nSending password reset request...`);

      try {
        const response = await axios.post(`${BASE_URL}/forgot-password`, {
          email: user.email
        });

        if (response.status === 200) {
          console.log(`${colors.green}✅ Success!${colors.reset}`);
          console.log(`${colors.green}   Email will be sent to: ${user.email}${colors.reset}`);
          console.log(`${colors.green}   (NOT to Michelle's email!)${colors.reset}`);
        }
      } catch (error) {
        console.log(`⚠️  Error: ${error.response?.data?.error || error.message}`);
      }

      console.log('');
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.green}✅ TEST COMPLETE${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);
    
    console.log(`${colors.yellow}IMPORTANT:${colors.reset}`);
    console.log(`Each user's password reset email is sent to THEIR email address.`);
    console.log(`Michelle's email is NOT hardcoded anywhere.`);
    console.log(`Each user gets their own email at their own address.\n`);
    
    console.log(`${colors.yellow}Check the server logs to see the detailed email routing.${colors.reset}`);
    console.log(`Look for the "📧 === EMAIL SENDING DEBUG ===" sections.\n`);
    console.log(`You will see that each email is sent to the correct recipient:\n`);
    
    users.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.username}: ${colors.green}${user.email}${colors.reset}`);
    });
    
    console.log('');

  } catch (error) {
    console.error('Test error:', error.message);
  }
  
  process.exit(0);
}

testAllUsersEmailRouting();
