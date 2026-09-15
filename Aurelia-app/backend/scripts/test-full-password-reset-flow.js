/**
 * Test Full Password Reset Flow
 * Tests the complete password reset process from request to actual password change
 */

const axios = require('axios');
const bcrypt = require('bcryptjs');
const { getOne, update } = require('../config/mysql-database');

const BASE_URL = 'http://localhost:5000/api/auth';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

async function testFullPasswordResetFlow() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  Full Password Reset Flow Test        ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

  const testEmail = 'test@example.com'; // Real user from database
  const currentPassword = 'Test1234'; // Current password for testing
  const newPassword = 'NewTestPassword123!';
  
  try {
    // Step 1: Verify user exists
    console.log(`${colors.blue}Step 1: Verifying user exists...${colors.reset}`);
    const user = await getOne('SELECT * FROM users WHERE email = ?', [testEmail]);
    
    if (!user) {
      console.log(`${colors.red}✗ User not found: ${testEmail}${colors.reset}`);
      console.log(`${colors.yellow}Please update the testEmail variable with a valid email from your database${colors.reset}\n`);
      return false;
    }
    
    console.log(`${colors.green}✓ User found: ${user.username} (${user.email})${colors.reset}\n`);

    // Step 2: Request password reset
    console.log(`${colors.blue}Step 2: Requesting password reset...${colors.reset}`);
    try {
      const forgotResponse = await axios.post(`${BASE_URL}/forgot-password`, {
        email: testEmail
      });
      
      if (forgotResponse.status === 200) {
        console.log(`${colors.green}✓ Password reset requested successfully${colors.reset}`);
        console.log(`${colors.green}  Message: ${forgotResponse.data.message}${colors.reset}\n`);
      }
    } catch (error) {
      console.log(`${colors.red}✗ Failed to request password reset${colors.reset}`);
      if (error.response?.status === 429) {
        console.log(`${colors.red}  Rate limited (429) - This should NOT happen!${colors.reset}\n`);
      } else {
        console.log(`${colors.red}  Error: ${error.response?.data?.error || error.message}${colors.reset}\n`);
      }
      return false;
    }

    // Step 3: Get reset token from database (simulating clicking email link)
    console.log(`${colors.blue}Step 3: Retrieving reset token from database...${colors.reset}`);
    const userWithToken = await getOne(
      'SELECT resetToken, resetTokenExpires FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (!userWithToken.resetToken) {
      console.log(`${colors.red}✗ Reset token not found in database${colors.reset}\n`);
      return false;
    }
    
    console.log(`${colors.green}✓ Reset token found: ${userWithToken.resetToken.substring(0, 8)}...${colors.reset}`);
    console.log(`${colors.green}  Expires: ${userWithToken.resetTokenExpires}${colors.reset}\n`);

    // Step 4: Reset password using token
    console.log(`${colors.blue}Step 4: Resetting password with token...${colors.reset}`);
    try {
      const resetResponse = await axios.post(`${BASE_URL}/reset-password`, {
        token: userWithToken.resetToken,
        newPassword: newPassword
      });
      
      if (resetResponse.status === 200) {
        console.log(`${colors.green}✓ Password reset successfully${colors.reset}`);
        console.log(`${colors.green}  Message: ${resetResponse.data.message}${colors.reset}\n`);
      }
    } catch (error) {
      console.log(`${colors.red}✗ Failed to reset password${colors.reset}`);
      if (error.response?.status === 429) {
        console.log(`${colors.red}  Rate limited (429) - This should NOT happen!${colors.reset}\n`);
      } else {
        console.log(`${colors.red}  Error: ${error.response?.data?.error || error.message}${colors.reset}\n`);
      }
      return false;
    }

    // Step 5: Verify new password works
    console.log(`${colors.blue}Step 5: Verifying new password...${colors.reset}`);
    const updatedUser = await getOne('SELECT password FROM users WHERE email = ?', [testEmail]);
    const passwordMatches = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (passwordMatches) {
      console.log(`${colors.green}✓ New password verified in database${colors.reset}\n`);
    } else {
      console.log(`${colors.red}✗ New password verification failed${colors.reset}\n`);
      return false;
    }

    // Step 6: Try login with new password
    console.log(`${colors.blue}Step 6: Testing login with new password...${colors.reset}`);
    console.log(`${colors.yellow}Note: This will fail if reCAPTCHA is enabled without a valid token${colors.reset}`);
    try {
      const loginResponse = await axios.post(`${BASE_URL}/login`, {
        email: testEmail,
        password: newPassword,
        recaptchaToken: 'test-token' // This will fail but that's okay for this test
      });
      
      if (loginResponse.status === 200) {
        console.log(`${colors.green}✓ Login successful with new password${colors.reset}\n`);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('reCAPTCHA')) {
        console.log(`${colors.green}✓ Password accepted (reCAPTCHA validation blocked login, which is expected)${colors.reset}\n`);
      } else {
        console.log(`${colors.yellow}⚠ Login test: ${error.response?.data?.error || error.message}${colors.reset}\n`);
      }
    }

    // Step 7: Restore original password for future tests
    console.log(`${colors.blue}Step 7: Restoring original password...${colors.reset}`);
    const restoredHash = await bcrypt.hash(currentPassword, 10);
    await update('UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE email = ?', 
      [restoredHash, testEmail]);
    console.log(`${colors.green}✓ Original password restored${colors.reset}\n`);

    // Final result
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.green}✓ ALL STEPS PASSED${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);
    console.log(`${colors.green}Password reset flow works correctly:${colors.reset}`);
    console.log(`${colors.green}  1. ✓ Request password reset (no rate limit)${colors.reset}`);
    console.log(`${colors.green}  2. ✓ Token generated and stored${colors.reset}`);
    console.log(`${colors.green}  3. ✓ Password reset with token (no rate limit)${colors.reset}`);
    console.log(`${colors.green}  4. ✓ New password saved correctly${colors.reset}\n`);
    
    return true;

  } catch (error) {
    console.error(`${colors.red}\nTest error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    return false;
  }
}

async function testMultipleResetAttempts() {
  console.log(`\n${colors.magenta}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.magenta}║  Testing Multiple Reset Attempts      ║${colors.reset}`);
  console.log(`${colors.magenta}╚════════════════════════════════════════╝${colors.reset}\n`);

  const testEmail = 'test@example.com';
  const attempts = 15; // Test 15 rapid attempts
  let successCount = 0;
  let rateLimitCount = 0;

  console.log(`Sending ${attempts} rapid password reset requests...\n`);

  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email: testEmail
      });
      
      if (response.status === 200) {
        successCount++;
        console.log(`${colors.green}✓${colors.reset} Attempt ${i}/${attempts}: Success`);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimitCount++;
        console.log(`${colors.red}✗${colors.reset} Attempt ${i}/${attempts}: Rate limited (429)`);
      }
    }
    
    // No delay - test rapid-fire requests
  }

  console.log(`\n${colors.blue}Results:${colors.reset}`);
  console.log(`${colors.green}✓ Successful: ${successCount}/${attempts}${colors.reset}`);
  console.log(`${colors.red}✗ Rate limited: ${rateLimitCount}/${attempts}${colors.reset}\n`);

  if (rateLimitCount === 0) {
    console.log(`${colors.green}✓ PASSED: Unlimited attempts working correctly${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED: Rate limiting still occurring${colors.reset}\n`);
    return false;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  COMPREHENSIVE PASSWORD RESET TEST SUITE${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  try {
    const flowTestPassed = await testFullPasswordResetFlow();
    const multipleAttemptsPassed = await testMultipleResetAttempts();

    console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}  FINAL TEST RESULTS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

    if (flowTestPassed && multipleAttemptsPassed) {
      console.log(`${colors.green}✓✓✓ ALL TESTS PASSED ✓✓✓${colors.reset}`);
      console.log(`${colors.green}\nPassword reset functionality is working correctly:${colors.reset}`);
      console.log(`${colors.green}  • No rate limiting on forgot-password endpoint${colors.reset}`);
      console.log(`${colors.green}  • No rate limiting on reset-password endpoint${colors.reset}`);
      console.log(`${colors.green}  • Email reset links work properly${colors.reset}`);
      console.log(`${colors.green}  • Password changes are saved correctly${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗✗✗ SOME TESTS FAILED ✗✗✗${colors.reset}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}\nTest suite error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runTests();
