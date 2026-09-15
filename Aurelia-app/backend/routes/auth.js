require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const { getOne, getAll, insert, update } = require('../config/mysql-database');
const { generateToken } = require('../middleware/auth');
const { sendWelcomeEmail, sendResetEmail, sendLoginCodeEmail } = require('../config/email');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, age, birthday, phone } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !age) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 13 || numericAge > 120) {
      return res.status(400).json({ error: 'You must be at least 13 years old to register' });
    }

    const storedBirthday = birthday || (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - numericAge, 0, 1);
      return date.toISOString().slice(0, 10);
    })();

    // Validate birthday - must be at least 13 years old
    const birthDate = new Date(storedBirthday);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 13) {
      return res.status(400).json({ error: 'You must be at least 13 years old to register' });
    }

    // Check if user exists
    const existing = await getOne(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const userId = uuidv4();

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Create user with birthday, phone, and verification code
    await insert(
      'INSERT INTO users (id, username, email, password, firstName, lastName, birthday, phone, isVerified, verificationCode, verificationCodeExpires, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, ?, ?, NOW())',
      [userId, username, email, hashedPassword, firstName, lastName, storedBirthday, phone || null, verificationCode, verificationExpires]
    );

    console.log('✅ User created with verification code:', verificationCode);

    // Send welcome email with verification code (non-blocking)
    try {
      await sendWelcomeEmail(email, firstName, verificationCode);
      console.log('✅ Welcome email sent with verification code');
    } catch (e) {
      console.warn('⚠️ Welcome email failed:', e && e.message ? e.message : e);
    }

    // Return response without token (user needs to verify first)
    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email for the verification code.',
      requiresVerification: true,
      email: email
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Resend Verification Code
router.post('/resend-verification', async (req, res) => {
  try {
    console.log('\n=== RESEND VERIFICATION REQUEST ===');
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getOne(
      'SELECT id, email, firstName, isVerified FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      // Don't reveal if user exists
      return res.json({ success: true, message: 'If the email exists, a new code has been sent.' });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: 'Email already verified. You can login now.' });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await update(
      'UPDATE users SET verificationCode = ?, verificationCodeExpires = ? WHERE id = ?',
      [verificationCode, verificationExpires, user.id]
    );

    console.log('✅ New verification code generated:', verificationCode);

    // Send new verification email
    try {
      await sendWelcomeEmail(email, user.firstName, verificationCode);
      console.log('✅ Verification email resent');
    } catch (e) {
      console.warn('⚠️ Email send failed:', e.message);
    }

    res.json({ success: true, message: 'New verification code sent! Check your email.' });
  } catch (error) {
    console.error('❌ Resend verification error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('=== EMAIL VERIFICATION REQUEST ===');
    console.log('========================================');
    
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code required' });
    }

    console.log('📧 Email:', email);
    console.log('🔑 Code:', code);

    // Find user by email
    const user = await getOne(
      'SELECT id, email, firstName, isVerified, verificationCode, verificationCodeExpires FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ error: 'Invalid email or verification code' });
    }

    console.log('✅ User found:', user.firstName);
    console.log('   Already verified:', user.isVerified);
    console.log('   Expected code:', user.verificationCode);
    console.log('   Code expires:', user.verificationCodeExpires);

    // Check if already verified
    if (user.isVerified) {
      console.log('✅ User already verified');
      return res.json({ 
        success: true, 
        message: 'Email already verified. You can login now.',
        alreadyVerified: true
      });
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      console.log('❌ Verification code mismatch');
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if code expired
    const now = new Date();
    const expires = new Date(user.verificationCodeExpires);
    if (now > expires) {
      console.log('❌ Verification code expired');
      return res.status(400).json({ 
        error: 'Verification code expired. Please request a new one.',
        expired: true
      });
    }

    // Verify the user
    await update(
      'UPDATE users SET isVerified = TRUE, verificationCode = NULL, verificationCodeExpires = NULL WHERE id = ?',
      [user.id]
    );

    console.log('✅ User verified successfully!');
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      verified: true
    });
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Username/email and password required' });
    }

    console.log('Login attempt for:', email);
    const trimmedInput = email.trim();
    console.log('Trimmed input:', trimmedInput);
    console.log('Input length:', trimmedInput.length);

    // Find user by email OR username (case-insensitive)
    // Use a single query with OR for better performance and reliability
    const lowerInput = trimmedInput.toLowerCase();
    
    // Query for user by email OR username (case-insensitive)
    const user = await getOne(
      'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?', 
      [lowerInput, lowerInput]
    );

    if (!user) {
      console.log('❌ User not found for:', trimmedInput);
      console.log('   Searched as email (case-insensitive):', lowerInput);
      console.log('   Searched as username (case-insensitive):', lowerInput);
      
      // Debug: Check if any users exist with similar usernames/emails
      try {
        const allUsers = await getAll('SELECT username, email FROM users LIMIT 10');
        console.log('   Sample users in database:');
        allUsers.forEach(u => {
          console.log('     - Username:', u.username, 'Email:', u.email);
        });
      } catch (debugError) {
        console.log('   Could not fetch sample users for debugging');
      }
      
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    console.log('✅ User found:', user.id);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    console.log('   Verified:', user.isVerified);
    console.log('   Input matched email:', lowerInput === user.email.toLowerCase());
    console.log('   Input matched username:', lowerInput === user.username.toLowerCase());

    // Check if email is verified
    if (!user.isVerified) {
      console.log('❌ Email not verified');
      return res.status(403).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification code.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check if password exists and is a valid hash
    if (!user.password || user.password.length < 10) {
      console.error('❌ Invalid password hash in database for user:', user.id);
      console.error('   Password length:', user.password ? user.password.length : 0);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('🔐 Comparing password...');
    console.log('   Password provided:', password ? 'Yes (length: ' + password.length + ')' : 'No');
    console.log('   Stored hash length:', user.password.length);

    // Compare password
    const passwordMatch = await bcryptjs.compare(password, user.password);

    console.log('   Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('❌ Password mismatch for user:', user.id);
      console.log('   Username:', user.username);
      console.log('   Email:', user.email);
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    console.log('Login successful for user:', user.id);

    const token = generateToken(user.id);
    
    // Format birthday as YYYY-MM-DD for HTML date input
    const formattedBirthday = user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : null;
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        birthday: formattedBirthday,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Login error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Request Login Code (for Electron app)
router.post('/request-login-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Find user by email OR username (case-insensitive)
    const user = await getOne(
      'SELECT id, email, firstName, isVerified FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)',
      [email, email]
    );

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, a login code has been sent.' 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email first. Check your inbox for the verification code.' 
      });
    }

    // Generate 6-digit login code
    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store login code in database (reuse verificationCode fields)
    await update(
      'UPDATE users SET verificationCode = ?, verificationCodeExpires = ? WHERE id = ?',
      [loginCode, codeExpires, user.id]
    );

    console.log('✅ Login code generated for user:', user.id, 'Code:', loginCode);

    // Send login code email (non-blocking)
    sendLoginCodeEmail(user.email, user.firstName, loginCode)
      .then(() => {
        console.log('✅ Login code email sent to:', user.email);
      })
      .catch(err => {
        console.error('❌ Failed to send login code email:', err);
      });

    res.json({ 
      success: true, 
      message: 'Login code sent! Check your email.' 
    });
  } catch (error) {
    console.error('Request login code error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Login with Code (for Electron app)
router.post('/login-with-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code required' });
    }

    // Find user by email OR username (case-insensitive)
    const user = await getOne(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)',
      [email, email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or code' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email first. Check your inbox for the verification code.' 
      });
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      return res.status(401).json({ error: 'Invalid login code' });
    }

    // Check if code expired
    if (user.verificationCodeExpires) {
      const now = new Date();
      const expires = new Date(user.verificationCodeExpires);
      if (now > expires) {
        return res.status(401).json({ 
          error: 'Login code expired. Please request a new one.',
          expired: true
        });
      }
    }

    console.log('✅ Login with code successful for user:', user.id);

    // Clear the login code after successful use
    await update(
      'UPDATE users SET verificationCode = NULL, verificationCodeExpires = NULL WHERE id = ?',
      [user.id]
    );

    const token = generateToken(user.id);
    
    // Format birthday as YYYY-MM-DD for HTML date input
    const formattedBirthday = user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : null;
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        birthday: formattedBirthday,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login with code error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('=== FORGOT PASSWORD REQUEST ===');
    console.log('========================================');
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('📧 Email from request body:', email);
    console.log('📧 Email type:', typeof email);
    console.log('📧 Email length:', email.length);
    
    console.log('\n🔍 Looking up user in database...');
    const user = await getOne('SELECT id, firstName, email FROM users WHERE email = ?', [email]);

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }

    console.log('✅ User found in database:');
    console.log('   Username/ID:', user.id);
    console.log('   First Name:', user.firstName);
    console.log('   Email (from DB):', user.email);
    console.log('   Email (from request):', email);
    console.log('   Emails match:', user.email === email);

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000).toISOString();

    console.log('\n🔑 Generating reset token...');
    console.log('   Token:', resetToken.substring(0, 8) + '...');
    console.log('   Expires:', resetExpires);

    await update(
      'UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id]
    );

    console.log('✅ Reset token saved to database');

    console.log('\n📧 Preparing to send reset email...');
    console.log('   TO (parameter 1):', email);
    console.log('   FIRST NAME (parameter 2):', user.firstName);
    console.log('   TOKEN (parameter 3):', resetToken.substring(0, 8) + '...');
    
    try {
      await sendResetEmail(email, user.firstName, resetToken);
      console.log('✅ sendResetEmail completed for:', email);
    } catch (e) {
      console.warn('⚠️ Reset email failed:', e && e.message ? e.message : e);
    }

    console.log('========================================\n');
    res.json({ success: true, message: 'Reset link sent' });
  } catch (error) {
    console.error('❌ Forgot password error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    console.log('=== Password Reset Request ===');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Token received:', req.body.token ? `${req.body.token.substring(0, 8)}...` : 'MISSING');
    console.log('Password received:', req.body.newPassword ? `Yes (${req.body.newPassword.length} chars)` : 'MISSING');
    
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      console.error('Missing required fields - token:', !!token, 'newPassword:', !!newPassword);
      return res.status(400).json({ error: 'Token and password required' });
    }

    console.log('Looking up user with token...');
    const user = await getOne(
      'SELECT id, email, firstName, resetTokenExpires FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()',
      [token]
    );

    if (!user) {
      console.error('Token validation failed - token not found or expired');
      // Check if token exists but is expired
      const expiredUser = await getOne(
        'SELECT id, email, resetTokenExpires FROM users WHERE resetToken = ?',
        [token]
      );
      if (expiredUser) {
        console.error('Token found but expired. Expires:', expiredUser.resetTokenExpires);
        return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
      }
      return res.status(400).json({ error: 'Invalid reset link. Please request a new one.' });
    }

    console.log('User found:', user.email, '- Updating password...');
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await update(
      'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    console.log('Password reset successful for:', user.email);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
