const express = require('express');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const db      = require('../db');
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendUsernameReminderEmail,
} = require('../mailer');
const router  = express.Router();

// POST /api/auth/register  – public, creates client account
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required.' });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  if (username.length < 3 || username.length > 50 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3–50 characters and contain only letters, numbers, or underscores.' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'Username or email already in use.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), hash, 'client']
    );

    const user = { id: result.insertId, username: username.trim(), email: email.trim().toLowerCase(), role: 'client' };
    req.session.user = user;

    // Welcome email — fire and forget
    sendWelcomeEmail({ username: user.username, email: user.email })
      .catch(err => console.error('[mailer] Welcome email failed:', err));

    return res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, password_hash, role FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };
    return res.json({ success: true, user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// GET /api/auth/check
router.get('/check', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

// POST /api/auth/forgot-password  – public, sends reset link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Always return success to avoid leaking whether an email exists
  res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });

  if (!email) return;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) return;

  try {
    const [rows] = await db.execute(
      'SELECT id, username, email FROM users WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );
    if (!rows.length) return;

    const user = rows[0];
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.execute(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    const resetUrl = `${process.env.SITE_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
    sendPasswordResetEmail({ email: user.email, username: user.username }, resetUrl)
      .catch(err => console.error('[mailer] Reset email failed:', err));
  } catch (err) {
    console.error('Forgot-password error:', err);
  }
});

// POST /api/auth/reset-password  – public, validates token and updates password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const [rows] = await db.execute(
      `SELECT t.id, t.user_id, t.expires_at, t.used
       FROM password_reset_tokens t
       WHERE t.token_hash = ? LIMIT 1`,
      [tokenHash]
    );

    if (!rows.length || rows[0].used || new Date(rows[0].expires_at) < new Date()) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
    }

    const { id: tokenId, user_id } = rows[0];
    const newHash = await bcrypt.hash(password, 12);

    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user_id]);
    await db.execute('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [tokenId]);

    return res.json({ success: true });
  } catch (err) {
    console.error('Reset-password error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/forgot-username  – public, emails username reminder
router.post('/forgot-username', async (req, res) => {
  // Always return success to avoid leaking account existence
  res.json({ success: true, message: 'If that email is registered, your username has been sent.' });

  const { email } = req.body;
  if (!email) return;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) return;

  try {
    const [rows] = await db.execute(
      'SELECT username, email FROM users WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );
    if (!rows.length) return;
    sendUsernameReminderEmail({ email: rows[0].email, username: rows[0].username })
      .catch(err => console.error('[mailer] Username reminder failed:', err));
  } catch (err) {
    console.error('Forgot-username error:', err);
  }
});

module.exports = router;
