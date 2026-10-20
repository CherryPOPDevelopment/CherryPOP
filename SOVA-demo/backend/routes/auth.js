/**
 * demo/backend/routes/auth.js
 * Demo login, session-only registration, and simulated two-factor verification.
 * Credentials are validated against the hardcoded DEMO_USERS list.
 */

const express = require('express');
const { randomUUID } = require('crypto');
const router = express.Router();
const { DEMO_USERS, findUserByIdentifier } = require('../data/mockData');
const { getFeatureStore } = require('../data/demoFeatures');

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

  const found = findUserByIdentifier(identifier) ||
    (req.session.demoUsers || []).find(account =>
      account.email.toLowerCase() === identifier.toLowerCase() ||
      account.username.toLowerCase() === identifier.toLowerCase()
    );

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

  return res.redirect('/');
});

function renderRegistration(req, res, role, message = null) {
  const employee = role === 'employee';
  return res.render(employee ? 'auth/register-employee' : 'auth/register-customer', {
    user: req.session.user || null,
    message,
    formData: req.body || {},
    recaptchaSiteKey: ''
  });
}

function createDemoAccount(req, res, role) {
  const { email, password, passwordConfirm } = req.body;
  const employee = role === 'employee';
  const username = req.body.username || `${req.body.firstName || ''}.${req.body.lastName || ''}`;
  if (!username || !email || !password || password !== passwordConfirm) {
    return renderRegistration(req, res, role, 'Complete every field and make sure the passwords match.');
  }
  if (password.length < 8) return renderRegistration(req, res, role, 'Password must be at least 8 characters.');
  if (employee && req.body.inviteCode !== 'SOVA-DEMO') {
    return renderRegistration(req, res, role, 'Use the demo invite code SOVA-DEMO to preview an employee account.');
  }
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const sessionAccounts = req.session.demoUsers || [];
  const duplicate = DEMO_USERS.some(account =>
    account.email.toLowerCase() === normalizedEmail || account.username.toLowerCase() === normalizedUsername
  ) || sessionAccounts.some(account =>
    account.email.toLowerCase() === normalizedEmail || account.username.toLowerCase() === normalizedUsername
  );
  if (duplicate) return renderRegistration(req, res, role, 'That username or email is already in use.');

  const account = {
    id: `session-${randomUUID()}`,
    username: username.trim(),
    email: email.trim(),
    password,
    role,
    isDemo: true,
    interface_theme: 'light'
  };
  req.session.demoUsers = [...sessionAccounts, account];
  const features = getFeatureStore(req.session);
  features.users.unshift({
    id: account.id,
    title: account.username,
    detail: account.email,
    status: account.role,
    createdBy: 'Session registration'
  });
  features.profiles[account.id] = {
    username: account.username,
    email: account.email,
    role: account.role,
    bio: '',
    home_city: 'DALLAS',
    interface_theme: 'light'
  };
  req.session.user = {
    id: account.id,
    username: account.username,
    email: account.email,
    role: account.role,
    isDemo: true,
    interface_theme: 'light'
  };
  return res.redirect('/');
}

router.get('/register', (req, res) => renderRegistration(req, res, 'customer'));
router.get('/register-customer', (req, res) => renderRegistration(req, res, 'customer'));
router.post('/register', (req, res) => createDemoAccount(req, res, 'customer'));
router.post('/register-customer', (req, res) => createDemoAccount(req, res, 'customer'));
router.get('/register-employee', (req, res) => renderRegistration(req, res, 'employee'));
router.post('/register-employee', (req, res) => createDemoAccount(req, res, 'employee'));

router.get('/2fa', (req, res) => res.render('auth/two-factor', {
  user: req.session.user || null,
  identifier: req.session.user?.email || req.query.email || 'demo account',
  message: null,
  code: ''
}));
router.post('/2fa', (req, res) => {
  if (req.body.code === '123456') return res.redirect('/');
  return res.status(400).render('auth/two-factor', {
    user: req.session.user || null,
    identifier: req.session.user?.email || 'demo account',
    message: 'Use the demo verification code 123456.',
    code: req.body.code || ''
  });
});

module.exports = router;
