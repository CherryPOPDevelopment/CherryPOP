const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getAll, getOne, insert, update, remove } = require('../config/mysql-database');

const router = express.Router();

// Get all contacts for user
router.get('/', async (req, res) => {
  try {
    const contacts = await getAll(
      'SELECT * FROM contacts WHERE userId = ? ORDER BY name ASC',
      [req.userId]
    );
    res.json({ success: true, contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get single contact
router.get('/:contactId', async (req, res) => {
  try {
    const contact = await getOne(
      'SELECT * FROM contacts WHERE id = ? AND userId = ?',
      [req.params.contactId, req.userId]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, category, notes, interests, preferredInfo } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const contactId = uuidv4();

    await insert(
      `INSERT INTO contacts 
       (id, userId, name, email, phone, address, category, notes, interests, preferredInfo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [contactId, req.userId, name, email, phone || null, address || null, category || 'Other', notes || null, interests || null, preferredInfo || null]
    );

    res.status(201).json({
      success: true,
      contact: { id: contactId, userId: req.userId, name, email, phone, address, category, notes, interests, preferredInfo }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update contact
router.put('/:contactId', async (req, res) => {
  try {
    const { name, email, phone, address, category, notes, interests, preferredInfo } = req.body;

    // Check ownership
    const existing = await getOne(
      'SELECT id FROM contacts WHERE id = ? AND userId = ?',
      [req.params.contactId, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await update(
      `UPDATE contacts 
       SET name = ?, email = ?, phone = ?, address = ?, category = ?, notes = ?, interests = ?, preferredInfo = ? 
       WHERE id = ?`,
      [name, email, phone || null, address || null, category, notes || null, interests || null, preferredInfo || null, req.params.contactId]
    );

    res.json({ success: true, message: 'Contact updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
router.delete('/:contactId', async (req, res) => {
  try {
    await remove(
      'DELETE FROM contacts WHERE id = ? AND userId = ?',
      [req.params.contactId, req.userId]
    );

    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
