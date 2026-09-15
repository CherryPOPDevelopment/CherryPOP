const express = require('express');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getOne, getAll, update, remove } = require('../config/mysql-database');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await getOne(
      'SELECT id, username, email, firstName, lastName, bio, profilePicture, birthday, phone, interests, sharePreferences, settings, privacySettings, createdAt, usernameChangeCount, lastUsernameChange FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format birthday as YYYY-MM-DD for HTML date input
    if (user.birthday) {
      const birthDate = new Date(user.birthday);
      user.birthday = birthDate.toISOString().split('T')[0];
    }

    // Calculate username changes remaining this month
    const now = new Date();
    const lastChange = user.lastUsernameChange ? new Date(user.lastUsernameChange) : null;
    const isSameMonth = lastChange ? (now.getFullYear() === lastChange.getFullYear() && now.getMonth() === lastChange.getMonth()) : false;
    const usernameChangesRemaining = isSameMonth ? Math.max(0, 2 - (user.usernameChangeCount || 0)) : 2;

    res.json({ success: true, user, usernameChangesRemaining });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, email, bio, profilePicture, birthday, phone, username, interests, sharePreferences, settings, privacySettings } = req.body;

    console.log('Updating profile for user:', req.userId);
    console.log('Profile data received:', { firstName, lastName, email, bio, profilePicture, birthday, phone, username, interests: interests ? 'YES' : 'NO' });

    // Get existing user data
    const existingUser = await getOne(
      'SELECT username, birthday, usernameChangeCount, lastUsernameChange FROM users WHERE id = ?',
      [req.userId]
    );

    // BIRTHDAY: Completely block any changes to birthday
    if (birthday !== undefined && existingUser && existingUser.birthday) {
      const existingBirthdayStr = existingUser.birthday ? new Date(existingUser.birthday).toISOString().split('T')[0] : null;
      const newBirthdayStr = birthday ? (birthday instanceof Date ? birthday.toISOString().split('T')[0] : birthday) : null;
      
      if (existingBirthdayStr && newBirthdayStr && existingBirthdayStr !== newBirthdayStr) {
        return res.status(400).json({ 
          error: 'Birthday cannot be changed once it\'s set. If your birthday is incorrect, please contact support for assistance.' 
        });
      }
    }

    // USERNAME: Check if username change is allowed (2 times per month)
    if (username !== undefined && existingUser && username !== existingUser.username) {
      const now = new Date();
      const changeCount = existingUser.usernameChangeCount || 0;
      const lastChange = existingUser.lastUsernameChange ? new Date(existingUser.lastUsernameChange) : null;
      
      // Check if we're in the same month
      if (lastChange) {
        const isSameMonth = now.getFullYear() === lastChange.getFullYear() && now.getMonth() === lastChange.getMonth();
        
        if (isSameMonth && changeCount >= 2) {
          return res.status(400).json({ 
            error: 'You can only change your username 2 times per month. Please try again next month.',
            usernameChangesRemaining: 0
          });
        }
        
        // Reset counter if it's a new month
        if (!isSameMonth) {
          await update(
            'UPDATE users SET usernameChangeCount = 0 WHERE id = ?',
            [req.userId]
          );
        }
      }
      
      // Check if username is already taken
      const usernameTaken = await getOne(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.userId]
      );
      
      if (usernameTaken) {
        return res.status(409).json({ error: 'Username is already taken' });
      }
    }

    // Handle interests - ensure it's stored as JSON
    const interestsData = interests ? (typeof interests === 'string' ? interests : JSON.stringify(interests)) : null;

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (firstName !== undefined) {
      updateFields.push('firstName = ?');
      updateValues.push(firstName || '');
    }
    if (lastName !== undefined) {
      updateFields.push('lastName = ?');
      updateValues.push(lastName || '');
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email || '');
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio || '');
    }
    if (profilePicture !== undefined) {
      updateFields.push('profilePicture = ?');
      updateValues.push(profilePicture || '');
    }
    // Only allow birthday to be set if it's not already set - NEVER allow changes
    if (birthday !== undefined && (!existingUser || !existingUser.birthday)) {
      updateFields.push('birthday = ?');
      updateValues.push(birthday || null);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone || '');
    }
    // USERNAME: Update with change tracking
    if (username !== undefined && existingUser && username !== existingUser.username) {
      updateFields.push('username = ?');
      updateValues.push(username);
      
      // Increment username change count and update timestamp
      const now = new Date();
      const lastChange = existingUser.lastUsernameChange ? new Date(existingUser.lastUsernameChange) : null;
      const isSameMonth = lastChange ? (now.getFullYear() === lastChange.getFullYear() && now.getMonth() === lastChange.getMonth()) : false;
      const newCount = isSameMonth ? (existingUser.usernameChangeCount || 0) + 1 : 1;
      
      updateFields.push('usernameChangeCount = ?');
      updateValues.push(newCount);
      updateFields.push('lastUsernameChange = NOW()');
      
      console.log(`Username changed from ${existingUser.username} to ${username}. Changes this month: ${newCount}/2`);
    }
    if (interests !== undefined) {
      updateFields.push('interests = ?');
      updateValues.push(interestsData);
    }
    if (sharePreferences !== undefined) {
      updateFields.push('sharePreferences = ?');
      updateValues.push(sharePreferences || '');
    }
    if (settings !== undefined) {
      updateFields.push('settings = ?');
      updateValues.push(typeof settings === 'string' ? settings : JSON.stringify(settings));
    }
    if (privacySettings !== undefined) {
      updateFields.push('privacySettings = ?');
      updateValues.push(typeof privacySettings === 'string' ? privacySettings : JSON.stringify(privacySettings));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(req.userId);
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await update(updateQuery, updateValues);

    // Get updated user
    const updated = await getOne(
      'SELECT id, username, email, firstName, lastName, bio, profilePicture, birthday, phone, interests, sharePreferences, settings, privacySettings, usernameChangeCount, lastUsernameChange FROM users WHERE id = ?',
      [req.userId]
    );

    // Format birthday as YYYY-MM-DD for HTML date input
    if (updated.birthday) {
      const birthDate = new Date(updated.birthday);
      updated.birthday = birthDate.toISOString().split('T')[0];
    }

    // Calculate username changes remaining this month
    const now = new Date();
    const lastChange = updated.lastUsernameChange ? new Date(updated.lastUsernameChange) : null;
    const isSameMonth = lastChange ? (now.getFullYear() === lastChange.getFullYear() && now.getMonth() === lastChange.getMonth()) : false;
    const usernameChangesRemaining = isSameMonth ? Math.max(0, 2 - (updated.usernameChangeCount || 0)) : 2;

    console.log('Profile updated successfully:', updated);
    console.log('Interests in updated user:', updated.interests ? 'YES - ' + updated.interests.substring(0, 100) : 'NO');

    // Update or create contact card for this user
    // A contact card is a contact with preferredInfo set, representing the user's own information
    try {
      const userContact = await getOne(
        'SELECT id FROM contacts WHERE userId = ? AND name = ?',
        [req.userId, `${updated.firstName} ${updated.lastName}`.trim()]
      );

      if (userContact) {
        // Update existing contact card
        await update(
          `UPDATE contacts SET 
            name = ?, 
            email = ?, 
            phone = ?, 
            address = NULL,
            category = 'Personal',
            notes = ?,
            preferredInfo = 'all',
            updatedAt = NOW()
          WHERE id = ?`,
          [
            `${updated.firstName} ${updated.lastName}`.trim(),
            updated.email || '',
            updated.phone || '',
            updated.bio || '',
            userContact.id
          ]
        );
        console.log('Contact card updated');
      } else {
        // Create new contact card
        const contactId = uuidv4();
        await update(
          `INSERT INTO contacts 
            (id, userId, name, email, phone, address, category, notes, preferredInfo, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, NULL, 'Personal', ?, 'all', NOW(), NOW())`,
          [
            contactId,
            req.userId,
            `${updated.firstName} ${updated.lastName}`.trim(),
            updated.email || '',
            updated.phone || '',
            updated.bio || ''
          ]
        );
        console.log('Contact card created');
      }
    } catch (contactError) {
      console.error('Error updating contact card:', contactError);
      // Don't fail the profile update if contact card update fails
    }

    console.log('Sending response with user.interests:', updated.interests ? 'YES' : 'NO');
    res.json({ success: true, user: updated, usernameChangesRemaining });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const results = await getAll(
      'SELECT id, username, email, firstName, lastName, bio, profilePicture FROM users WHERE (username LIKE ? OR email LIKE ? OR firstName LIKE ? OR lastName LIKE ?) AND id != ? LIMIT 10',
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, req.userId]
    );

    res.json({ success: true, users: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get friend's shared contacts
router.get('/shared-contacts/:friendId', async (req, res) => {
  try {
    // Verify friendship exists
    const friendship = await getOne(
      `SELECT id FROM friendships WHERE (
        (userId = ? AND friendId = ?) OR 
        (userId = ? AND friendId = ?)
      ) AND status = 'accepted'`,
      [req.userId, req.params.friendId, req.params.friendId, req.userId]
    );

    if (!friendship) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }

    // Get friend's contacts (only shared ones with preferredInfo)
    const contacts = await getAll(
      'SELECT id, name, email, phone, address, category, notes, interests, preferredInfo FROM contacts WHERE userId = ? AND preferredInfo IS NOT NULL AND preferredInfo != "" ORDER BY name ASC',
      [req.params.friendId]
    );

    res.json({ success: true, contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }

    // Get user's current password hash
    const user = await getOne(
      'SELECT password FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcryptjs.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password
    await update(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.userId]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete account - ONLY accessible through Settings tab with password confirmation
router.delete('/account', async (req, res) => {
  try {
    const { password, confirmation } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Require explicit confirmation
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({ 
        error: 'Account deletion requires typing "DELETE MY ACCOUNT" in the confirmation field' 
      });
    }

    // Get user's password hash
    const user = await getOne(
      'SELECT password, email, username FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    console.log(`⚠️  User account deletion requested: ${user.email} (${user.username})`);

    // Delete user's contacts
    await remove('DELETE FROM contacts WHERE userId = ?', [req.userId]);

    // Delete user's friendships
    await remove('DELETE FROM friendships WHERE userId = ? OR friendId = ?', [req.userId, req.userId]);

    // Delete user
    await remove('DELETE FROM users WHERE id = ?', [req.userId]);

    console.log(`✓ Account deleted: ${user.email}`);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
