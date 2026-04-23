const express = require('express');
const db      = require('../db');
const router  = express.Router();

const ALLOWED_SECTIONS = ['hero', 'about', 'services', 'contact'];

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Forbidden.' });
}

// GET /api/content/:section  – public
router.get('/:section', async (req, res) => {
  const { section } = req.params;
  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ error: 'Unknown section.' });
  }
  try {
    const [rows] = await db.execute(
      'SELECT content FROM site_content WHERE section = ? LIMIT 1',
      [section]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found.' });
    return res.json(JSON.parse(rows[0].content));
  } catch (err) {
    console.error('Content fetch error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/content/:section  – admin only
router.put('/:section', isAdmin, async (req, res) => {
  const { section } = req.params;
  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ error: 'Unknown section.' });
  }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Body must be a JSON object.' });
  }
  // Sanitise: only allow string values
  const safe = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === 'string') safe[k] = v;
  }
  try {
    await db.execute(
      `INSERT INTO site_content (section, content) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [section, JSON.stringify(safe)]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Content update error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/content  – all sections (admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT section, content, updated_at FROM site_content');
    const result = {};
    rows.forEach(r => { result[r.section] = { ...JSON.parse(r.content), updated_at: r.updated_at }; });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
