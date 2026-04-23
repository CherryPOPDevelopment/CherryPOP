const express = require('express');
const db      = require('../db');
const router  = express.Router();

const VALID_SERVICES = ['website', 'app', 'shop'];
const VALID_STATUSES  = ['new', 'in_review', 'accepted', 'completed', 'declined'];

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden.' });
}

// POST /api/inquiries  – public, submit a new inquiry
router.post('/', async (req, res) => {
  const { name, email, service_type, budget, message } = req.body;

  if (!name || !email || !service_type || !message) {
    return res.status(400).json({ error: 'name, email, service_type, and message are required.' });
  }

  if (!VALID_SERVICES.includes(service_type)) {
    return res.status(400).json({ error: 'Invalid service_type.' });
  }

  // Basic email format guard
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO inquiries (name, email, service_type, budget, message) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), service_type, budget ? budget.trim() : null, message.trim()]
    );
    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Inquiry insert error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/inquiries  – admin only, list all inquiries
router.get('/', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM inquiries ORDER BY created_at DESC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Inquiries fetch error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/inquiries/:id  – admin only, update status
router.patch('/:id', isAdmin, async (req, res) => {
  const { status } = req.body;
  const { id }     = req.params;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    await db.execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Inquiry update error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
