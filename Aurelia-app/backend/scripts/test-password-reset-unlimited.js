/**
 * Test Password Reset Unlimited Attempts
 * Tests that forgot-password and reset-password work without rate limiting
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

async function testForgotPasswordUnlimited() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Testing Forgot Password - Unlimited Attempts${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  const testEmail = 'lynn@example.com'; // Change this to a real email in your database
  let successCount = 0;
  let failCount = 0;
  const attempts = 10; // Test 10 rapid requests

  console.log(`Sending ${attempts} rapid forgot-password requests to: ${testEmail}\n`);

  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email: testEmail
      });

      if (response.status === 200) {
        successCount++;
        console.log(`${colors.green}✓${colors.reset} Request ${i}/${attempts}: Success (${response.data.message})`);
      }
    } catch (error) {
      failCount++;
      if (error.response?.status === 429) {
        console.log(`${colors.red}✗${colors.reset} Request ${i}/${attempts}: Rate limited (429) - FAILED`);
        console.log(`${colors.red}  Error: ${error.response.data.error}${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Request ${i}/${attempts}: Error (${error.response?.status || 'network error'})`);
        console.log(`${colors.yellow}  ${error.response?.data?.error || error.message}${colors.reset}`);
      }
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n${colors.blue}Results:${colors.reset}`);
  console.log(`${colors.green}✓ Successful: ${successCount}/${attempts}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failCount}/${attempts}${colors.reset}`);

  if (failCount === 0) {
    console.log(`\n${colors.green}✓ PASSED: No rate limiting detected on forgot-password endpoint${colors.reset}`);
    return true;
  } else {
    console.log(`\n${colors.red}✗ FAILED: Rate limiting still active on forgot-password endpoint${colors.reset}`);
    return false;
  }
}

async function testResetPasswordUnlimited() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Testing Reset Password - Unlimited Attempts${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  // Using a dummy token for testing rate limiting only
  const dummyToken = 'test-token-12345';
  const dummyPassword = 'NewPassword123!';
  let successOrValidFailCount = 0; // Count successful attempts or expected validation errors
  let rateLimitFailCount = 0;
  const attempts = 10;

  console.log(`Sending ${attempts} rapid reset-password requests\n`);

  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, {
        token: dummyToken,
        newPassword: dummyPassword
      });

      if (response.status === 200) {
        successOrValidFailCount++;
        console.log(`${colors.green}✓${colors.reset} Request ${i}/${attempts}: Success`);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimitFailCount++;
        console.log(`${colors.red}✗${colors.reset} Request ${i}/${attempts}: Rate limited (429) - FAILED`);
        console.log(`${colors.red}  Error: ${error.response.data.error}${colors.reset}`);
      } else if (error.response?.status === 400) {
        // Expected error for invalid token - this is NOT a rate limit error
        successOrValidFailCount++;
        console.log(`${colors.green}✓${colors.reset} Request ${i}/${attempts}: Expected error (invalid token) - not rate limited`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Request ${i}/${attempts}: Other error (${error.response?.status || 'network error'})`);
        console.log(`${colors.yellow}  ${error.response?.data?.error || error.message}${colors.reset}`);
      }
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n${colors.blue}Results:${colors.reset}`);
  console.log(`${colors.green}✓ Non-rate-limited responses: ${successOrValidFailCount}/${attempts}${colors.reset}`);
  console.log(`${colors.red}✗ Rate-limited (429): ${rateLimitFailCount}/${attempts}${colors.reset}`);

  if (rateLimitFailCount === 0) {
    console.log(`\n${colors.green}✓ PASSED: No rate limiting detected on reset-password endpoint${colors.reset}`);
    return true;
  } else {
    console.log(`\n${colors.red}✗ FAILED: Rate limiting still active on reset-password endpoint${colors.reset}`);
    return false;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  Password Reset Unlimited Test Suite  ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);
  
  console.log(`\nTesting server at: ${BASE_URL}`);
  console.log(`\n${colors.yellow}Note: This test verifies that no 429 (Too Many Requests) errors occur${colors.reset}`);

  try {
    const forgotPasswordPassed = await testForgotPasswordUnlimited();
    const resetPasswordPassed = await testResetPasswordUnlimited();

    console.log(`\n${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}Final Results${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);

    if (forgotPasswordPassed && resetPasswordPassed) {
      console.log(`${colors.green}✓ ALL TESTS PASSED${colors.reset}`);
      console.log(`${colors.green}  Both forgot-password and reset-password work without rate limits${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗ SOME TESTS FAILED${colors.reset}`);
      console.log(`${colors.red}  Rate limiting may still be active${colors.reset}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}\nTest suite error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run tests
runTests();
