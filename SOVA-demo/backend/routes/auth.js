/**
 * demo/backend/routes/auth.js
 * Login / logout only — no registration, no 2FA, no password reset.
 * Credentials are validated against the hardcoded DEMO_USERS list.
 */

const express = require('express');
const router = express.Router();
const { findUserByIdentifier } = require('../data/mockData');

// GET /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  return res.render('auth/login', {
    user: null,
    message: req.query.error === '1' ? 'Invalid email or password.' : null,
    identifier: '',
    recaptchaSiteKey: '',
    recaptchaMode: 'v3'
  });
});

// POST /auth/login
router.post('/login', (req, res) => {
  const identifier = (req.body.email || '').trim();
  const password = (req.body.password || '').trim();

  const found = findUserByIdentifier(identifier);

  if (!found || found.password !== password) {
    return res.redirect('/auth/login?error=1');
  }

  // Build a session user object that mirrors the main app shape
  req.session.user = {
    id: found.id,
    username: found.username,
    email: found.email,
    role: found.role,
    isDemo: true,
    interface_theme: 'light'
  };

  req.session.city = req.session.city || 'DALLAS';

  // Redirect based on role (same logic as main app)
  const role = found.role.toLowerCase();
  if (role === 'admin' || role === 'management') return res.redirect('/admin');
  if (role === 'employee') return res.redirect('/employee');
  return res.redirect('/');
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

// Location selection (used after login when multiple cities exist)
const ALL_CITIES = ['DALLAS', 'AUSTIN'];

router.get('/location', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return res.render('auth/location-select', {
    user: req.session.user,
    identifier: req.session.user.email,
    message: null,
    cities: ALL_CITIES,
    selectedCity: req.session.city || 'DALLAS'
  });
});

router.post('/location', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const city = (req.body.city || '').toUpperCase();
  if (ALL_CITIES.includes(city)) req.session.city = city;

  const role = (req.session.user.role || '').toLowerCase();
  if (role === 'admin' || role === 'management') return res.redirect('/admin');
  if (role === 'employee') return res.redirect('/employee');
  return res.redirect('/');
});

// Block all registration / 2FA routes — not available in demo
router.get('/register', (req, res) =>
  res.render('error', { message: 'Registration is not available in the demo.' })
);
router.get('/register-customer', (req, res) =>
  res.render('error', { message: 'Registration is not available in the demo.' })
);
router.get('/register-employee', (req, res) =>
  res.render('error', { message: 'Registration is not available in the demo.' })
);
router.get('/2fa', (req, res) =>
  res.render('error', { message: 'Two-factor authentication is not available in the demo.' })
);
router.post('/2fa', (req, res) =>
  res.render('error', { message: 'Two-factor authentication is not available in the demo.' })
);

module.exports = router;
