const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getAll, getOne, insert, update, remove } = require('../config/mysql-database');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Get all users with friend status
router.get('/all-users', async (req, res) => {
  try {
    // Get all users except current user
    const allUsers = await getAll(
      `SELECT id, username, email, firstName, lastName, bio, profilePicture, phone, birthday, createdAt
       FROM users
       WHERE id != ?
       ORDER BY firstName, lastName`,
      [req.userId]
    );

    // Get all friendships for current user
    const friendships = await getAll(
      `SELECT userId, friendId, status 
       FROM friendships 
       WHERE (userId = ? OR friendId = ?)`,
      [req.userId, req.userId]
    );

    // Create a map of friend statuses and who sent the request
    const friendStatusMap = {};
    const requestSentMap = {};
    friendships.forEach(f => {
      const otherUserId = f.userId === req.userId ? f.friendId : f.userId;
      friendStatusMap[otherUserId] = f.status;
      // Track if current user sent the request
      if (f.userId === req.userId && f.status === 'pending') {
        requestSentMap[otherUserId] = true;
      }
    });

    // Enrich users with friend status and shared contacts
    const enriched = await Promise.all(allUsers.map(async (u) => {
      const friendStatus = friendStatusMap[u.id] || 'none'; // 'none', 'pending', 'accepted', 'blocked'
      
      // Get shared contacts (user's personal contact card if they shared it)
      const sharedContacts = await getAll(
        'SELECT id, name, email, phone, address, category, notes, interests, preferredInfo FROM contacts WHERE userId = ? AND preferredInfo IS NOT NULL AND preferredInfo != "" ORDER BY name',
        [u.id]
      );

      // Also get user's own profile info if they want to share it
      // This would be their personal contact card
      return { 
        ...u, 
        friendStatus,
        sharedContacts,
        isFriend: friendStatus === 'accepted',
        isPending: friendStatus === 'pending',
        isRequestSent: requestSentMap[u.id] || false
      };
    }));

    res.json({ success: true, users: enriched });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Discover users that are not yet friends or pending
router.get('/discover', async (req, res) => {
  try {
    // Get users that are not the current user and not involved in any friendship with them
    const users = await getAll(
      `SELECT id, username, email, firstName, lastName, bio, profilePicture, createdAt
       FROM users
       WHERE id != ? AND id NOT IN (
         SELECT friendId FROM friendships WHERE userId = ?
       ) AND id NOT IN (
         SELECT userId FROM friendships WHERE friendId = ?
       )
       ORDER BY firstName, lastName`,
      [req.userId, req.userId, req.userId]
    );

    // For each user, fetch any contacts they marked with preferredInfo (shared info)
    const enriched = await Promise.all(users.map(async (u) => {
      const shared = await getAll(
        'SELECT id, name, email, phone, address, category, notes, interests, preferredInfo FROM contacts WHERE userId = ? AND preferredInfo IS NOT NULL AND preferredInfo != "" ORDER BY name',
        [u.id]
      );
      return { ...u, sharedContacts: shared };
    }));

    res.json({ success: true, users: enriched });
  } catch (error) {
    console.error('Discover error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get friends
router.get('/', async (req, res) => {
  try {
    const friends = await getAll(
      `SELECT u.id, u.username, u.email, u.firstName, u.lastName, u.bio, u.phone, u.birthday, 
              u.interests, u.sharePreferences, u.privacySettings, u.profilePicture
       FROM friendships f
       JOIN users u ON (
         (f.userId = ? AND f.friendId = u.id) OR 
         (f.friendId = ? AND f.userId = u.id)
       )
       WHERE f.status = 'accepted'`,
      [req.userId, req.userId]
    );

    // For each friend, get their shared contacts
    const enrichedFriends = await Promise.all(friends.map(async (friend) => {
      const sharedContacts = await getAll(
        'SELECT id, name, email, phone, address, category, notes, interests, preferredInfo FROM contacts WHERE userId = ? AND preferredInfo IS NOT NULL AND preferredInfo != "" ORDER BY name',
        [friend.id]
      );
      return { ...friend, sharedContacts };
    }));

    res.json({ success: true, friends: enrichedFriends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get friend requests (received)
router.get('/requests/received', async (req, res) => {
  try {
    const requests = await getAll(
      `SELECT f.id, f.userId, u.username, u.email, u.firstName, u.lastName, u.bio, f.createdAt
       FROM friendships f
       JOIN users u ON f.userId = u.id
       WHERE f.friendId = ? AND f.status = 'pending'`,
      [req.userId]
    );

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get friend requests (sent)
router.get('/requests/sent', async (req, res) => {
  try {
    const requests = await getAll(
      `SELECT f.id, f.friendId, u.username, u.email, u.firstName, u.lastName, u.bio, f.createdAt
       FROM friendships f
       JOIN users u ON f.friendId = u.id
       WHERE f.userId = ? AND f.status = 'pending'`,
      [req.userId]
    );

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Send friend request
router.post('/request/:friendId', async (req, res) => {
  try {
    if (req.userId === req.params.friendId) {
      return res.status(400).json({ error: 'Cannot friend yourself' });
    }

    // Check if friendship exists
    const existing = await getOne(
      'SELECT id FROM friendships WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)',
      [req.userId, req.params.friendId, req.params.friendId, req.userId]
    );

    if (existing) {
      return res.status(409).json({ error: 'Friendship already exists' });
    }

    // Check if friend exists
    const friend = await getOne(
      'SELECT email, firstName FROM users WHERE id = ?',
      [req.params.friendId]
    );

    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friendshipId = uuidv4();
    await insert(
      'INSERT INTO friendships (id, userId, friendId, status) VALUES (?, ?, ?, ?)',
      [friendshipId, req.userId, req.params.friendId, 'pending']
    );

    // Send notification email
    try {
      await sendEmail(
        friend.email,
        'Friend Request from Aurelia Contacts',
        `You have received a friend request! Log in to accept or reject.`
      );
    } catch (e) {
      console.warn('Email failed:', e.message);
    }

    res.json({ success: true, message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Accept friend request by user ID
router.post('/request/accept-user/:userId', async (req, res) => {
  try {
    const friendship = await getOne(
      'SELECT id FROM friendships WHERE userId = ? AND friendId = ? AND status = ?',
      [req.params.userId, req.userId, 'pending']
    );

    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await update(
      'UPDATE friendships SET status = ? WHERE id = ?',
      ['accepted', friendship.id]
    );

    res.json({ success: true, message: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Accept friend request by friendship ID
router.post('/request/accept/:friendshipId', async (req, res) => {
  try {
    const friendship = await getOne(
      'SELECT userId, friendId FROM friendships WHERE id = ? AND friendId = ? AND status = ?',
      [req.params.friendshipId, req.userId, 'pending']
    );

    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await update(
      'UPDATE friendships SET status = ? WHERE id = ?',
      ['accepted', req.params.friendshipId]
    );

    res.json({ success: true, message: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Reject friend request by user ID
router.post('/request/reject-user/:userId', async (req, res) => {
  try {
    const friendship = await getOne(
      'SELECT id FROM friendships WHERE userId = ? AND friendId = ? AND status = ?',
      [req.params.userId, req.userId, 'pending']
    );

    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await remove('DELETE FROM friendships WHERE id = ?', [friendship.id]);

    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Reject friend request by friendship ID
router.post('/request/reject/:friendshipId', async (req, res) => {
  try {
    const friendship = await getOne(
      'SELECT id FROM friendships WHERE id = ? AND friendId = ? AND status = ?',
      [req.params.friendshipId, req.userId, 'pending']
    );

    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await remove('DELETE FROM friendships WHERE id = ?', [req.params.friendshipId]);

    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Remove friend
router.delete('/:friendId', async (req, res) => {
  try {
    await remove(
      'DELETE FROM friendships WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)',
      [req.userId, req.params.friendId, req.params.friendId, req.userId]
    );

    res.json({ success: true, message: 'Friend removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
