const express = require('express');
const { getAll, getOne, query, insert, update, remove } = require('../config/mysql-database');

const router = express.Router();

// Get all available interests (public endpoint - no auth required)
router.get('/', async (req, res) => {
  try {
    const interests = await getAll(
      'SELECT id, name, icon FROM interests ORDER BY name ASC'
    );
    res.json({ success: true, interests });
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
