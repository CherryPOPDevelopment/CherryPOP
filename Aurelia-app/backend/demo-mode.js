const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { SECRET_KEY } = require('./middleware/auth');

const DEMO_ACCOUNTS = [
  { id: 'demo-guest', username: 'guest', email: 'guest@aurelia.demo', password: 'GuestDemo123', role: 'guest', firstName: 'Guest', lastName: 'Preview' },
  { id: 'demo-employee', username: 'employee', email: 'employee@aurelia.demo', password: 'EmployeeDemo123', role: 'employee', firstName: 'Employee', lastName: 'Preview' },
  { id: 'demo-management', username: 'management', email: 'management@aurelia.demo', password: 'ManagementDemo123', role: 'management', firstName: 'Management', lastName: 'Preview' },
  { id: 'demo-admin', username: 'admin', email: 'admin@aurelia.demo', password: 'AdminDemo123', role: 'admin', firstName: 'Admin', lastName: 'Preview' }
];

const DEMO_USERS = new Map(DEMO_ACCOUNTS.map(account => [account.id, account]));
const DEMO_DATA = new Map();
const FRIENDSHIPS = [];
const demoAccountsEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEMO_ACCOUNTS === 'true';

function publicUser(user) {
  const { password, ...visible } = user;
  return { ...visible, isDemo: true, profilePicture: user.profilePicture || null };
}

function getData(userId) {
  if (!DEMO_DATA.has(userId)) {
    const account = DEMO_USERS.get(userId);
    DEMO_DATA.set(userId, {
      contacts: userId === 'demo-guest' ? [
        { id: 'demo-contact-1', userId, name: 'Jordan Lee', email: 'jordan.lee@example.com', phone: '(555) 010-2040', category: 'Friend', notes: 'Met at the neighborhood art walk.' },
        { id: 'demo-contact-2', userId, name: 'Morgan Chen', email: 'morgan.chen@example.com', phone: '(555) 010-3185', category: 'Work', notes: 'Project collaborator.' },
        { id: 'demo-contact-3', userId, name: 'Taylor Brooks', email: 'taylor.brooks@example.com', category: 'Family', notes: 'Cousin.' }
      ] : [],
      profile: {
        ...publicUser(account),
        bio: account.bio || '',
        birthday: account.birthday || '',
        phone: account.phone || '',
        interests: account.interests || '',
        sharePreferences: account.sharePreferences || '',
        settings: account.settings || JSON.stringify({ theme: 'light', notifyEmail: true, notifyFriendRequests: true, notifyContactUpdates: true, notifyMessage: true, twoFactor: false, rememberLogin: true }),
        privacySettings: account.privacySettings || JSON.stringify({ shareEmail: true, sharePhone: false, shareBirthday: false, shareInterests: true }),
        usernameChangeCount: 0,
        usernameChangesRemaining: 2
      }
    });
  }
  return DEMO_DATA.get(userId);
}

function findDemoAccount(identifier, password) {
  if (!demoAccountsEnabled()) return null;
  const normalized = String(identifier || '').trim().toLowerCase();
  return DEMO_ACCOUNTS.find(account =>
    (account.email.toLowerCase() === normalized || account.username.toLowerCase() === normalized) &&
    account.password === password
  ) || null;
}

function listDemoAccounts() {
  if (!demoAccountsEnabled()) return [];
  return DEMO_ACCOUNTS.map(({ username, email, password, role }) => ({ username, email, password, role }));
}

function registerDemoAccount(details) {
  if (!demoAccountsEnabled()) return null;
  const account = {
    id: `demo-${randomUUID()}`,
    username: details.username.trim(),
    email: details.email.trim().toLowerCase(),
    password: details.password,
    role: 'guest',
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    phone: details.phone || '',
    birthday: details.birthday || ''
  };
  if (DEMO_ACCOUNTS.some(existing => existing.email.toLowerCase() === account.email || existing.username.toLowerCase() === account.username)) {
    return false;
  }
  DEMO_ACCOUNTS.push(account);
  DEMO_USERS.set(account.id, account);
  return account;
}

function respond(res, status, value) {
  return res.status(status).json(value);
}

function handleDemoApi(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  let userId;
  try {
    userId = jwt.verify(token, SECRET_KEY).userId;
  } catch {
    return next();
  }

  if (!String(userId).startsWith('demo-')) return next();
  if (!demoAccountsEnabled()) return respond(res, 403, { error: 'Demo accounts are disabled.' });
  if (!DEMO_USERS.has(userId)) return respond(res, 401, { error: 'Demo account is no longer available.' });

  const me = DEMO_USERS.get(userId);
  const data = getData(userId);
  const path = req.path.replace(/\/+$/, '') || '/';
  const success = (body = {}) => respond(res, 200, { success: true, ...body });
  const forbiddenUpload = () => respond(res, 403, { error: 'File and image uploads are disabled in demo mode.' });

  const contentType = req.headers['content-type'] || '';
  if (req.is('multipart/form-data') || contentType.startsWith('image/') || contentType.startsWith('application/octet-stream')) {
    return forbiddenUpload();
  }

  if (path === '/users/profile' && req.method === 'GET') {
    return success({ user: { ...data.profile }, usernameChangesRemaining: data.profile.usernameChangesRemaining });
  }

  if (path === '/users/profile' && req.method === 'PUT') {
    if (typeof req.body.profilePicture === 'string' && req.body.profilePicture.startsWith('data:')) return forbiddenUpload();
    Object.assign(data.profile, req.body);
    Object.assign(me, {
      username: data.profile.username || me.username,
      email: data.profile.email || me.email,
      firstName: data.profile.firstName || me.firstName,
      lastName: data.profile.lastName || me.lastName,
      bio: data.profile.bio || '',
      phone: data.profile.phone || ''
    });
    return success({ user: { ...data.profile }, usernameChangesRemaining: data.profile.usernameChangesRemaining });
  }

  if (path === '/contacts' && req.method === 'GET') {
    return success({ contacts: [...data.contacts].sort((a, b) => a.name.localeCompare(b.name)) });
  }

  if (path === '/contacts' && req.method === 'POST') {
    if (!req.body.name || !req.body.email) return respond(res, 400, { error: 'Name and email are required' });
    const contact = { id: randomUUID(), userId, ...req.body, category: req.body.category || 'Other' };
    data.contacts.push(contact);
    return respond(res, 201, { success: true, contact });
  }

  const contactMatch = path.match(/^\/contacts\/([^/]+)$/);
  if (contactMatch) {
    const contactIndex = data.contacts.findIndex(contact => contact.id === contactMatch[1]);
    if (req.method === 'GET') {
      return contactIndex < 0
        ? respond(res, 404, { error: 'Contact not found' })
        : success({ contact: data.contacts[contactIndex] });
    }
    if (contactIndex < 0) return respond(res, 404, { error: 'Contact not found' });
    if (req.method === 'PUT') {
      data.contacts[contactIndex] = { ...data.contacts[contactIndex], ...req.body };
      return success({ message: 'Contact updated', contact: data.contacts[contactIndex] });
    }
    if (req.method === 'DELETE') {
      data.contacts.splice(contactIndex, 1);
      return success({ message: 'Contact deleted' });
    }
  }

  if (path === '/friends' && req.method === 'GET') {
    const friends = FRIENDSHIPS
      .filter(edge => edge.status === 'accepted' && (edge.userId === userId || edge.friendId === userId))
      .map(edge => DEMO_USERS.get(edge.userId === userId ? edge.friendId : edge.userId))
      .filter(Boolean)
      .map(publicUser);
    return success({ friends });
  }

  if (path === '/friends/requests/received' && req.method === 'GET') {
    const requests = FRIENDSHIPS
      .filter(edge => edge.status === 'pending' && edge.friendId === userId)
      .map(edge => ({ ...publicUser(DEMO_USERS.get(edge.userId)), id: edge.id, userId: edge.userId, createdAt: edge.createdAt }));
    return success({ requests });
  }

  if (path === '/friends/requests/sent' && req.method === 'GET') {
    const requests = FRIENDSHIPS
      .filter(edge => edge.status === 'pending' && edge.userId === userId)
      .map(edge => ({ ...publicUser(DEMO_USERS.get(edge.friendId)), id: edge.id, friendId: edge.friendId, createdAt: edge.createdAt }));
    return success({ requests });
  }

  if ((path === '/friends/all-users' || path === '/friends/discover') && req.method === 'GET') {
    const users = [...DEMO_USERS.values()]
      .filter(user => user.id !== userId)
      .filter(user => path !== '/friends/discover' || !FRIENDSHIPS.some(edge =>
        (edge.userId === userId && edge.friendId === user.id) || (edge.userId === user.id && edge.friendId === userId)
      ))
      .map(user => {
        const edge = FRIENDSHIPS.find(item =>
          (item.userId === userId && item.friendId === user.id) || (item.userId === user.id && item.friendId === userId)
        );
        return { ...publicUser(user), friendStatus: edge?.status || 'none', isFriend: edge?.status === 'accepted', isPending: edge?.status === 'pending', isRequestSent: edge?.userId === userId && edge?.status === 'pending', sharedContacts: getData(user.id).contacts.filter(contact => contact.preferredInfo) };
      });
    return success({ users });
  }

  const requestMatch = path.match(/^\/friends\/request\/(accept-user|reject-user)\/([^/]+)$/);
  const friendshipMatch = path.match(/^\/friends\/request\/(accept|reject)\/([^/]+)$/);
  if ((requestMatch || friendshipMatch) && req.method === 'POST') {
    const action = (requestMatch || friendshipMatch)[1];
    const value = (requestMatch || friendshipMatch)[2];
    const edge = FRIENDSHIPS.find(item =>
      item.status === 'pending' &&
      item.friendId === userId &&
      (requestMatch ? item.userId === value : item.id === value)
    );
    if (!edge) return respond(res, 404, { error: 'Request not found' });
    if (action.startsWith('accept')) edge.status = 'accepted';
    else FRIENDSHIPS.splice(FRIENDSHIPS.indexOf(edge), 1);
    return success({ message: action.startsWith('accept') ? 'Friend request accepted' : 'Request rejected' });
  }

  const sendRequestMatch = path.match(/^\/friends\/request\/([^/]+)$/);
  if (sendRequestMatch && req.method === 'POST') {
    const friendId = sendRequestMatch[1];
    if (friendId === userId) return respond(res, 400, { error: 'Cannot friend yourself' });
    if (!DEMO_USERS.has(friendId)) return respond(res, 404, { error: 'User not found' });
    if (FRIENDSHIPS.some(edge => (edge.userId === userId && edge.friendId === friendId) || (edge.userId === friendId && edge.friendId === userId))) {
      return respond(res, 409, { error: 'Friendship already exists' });
    }
    FRIENDSHIPS.push({ id: randomUUID(), userId, friendId, status: 'pending', createdAt: new Date().toISOString() });
    return success({ message: 'Friend request sent' });
  }

  const friendMatch = path.match(/^\/friends\/([^/]+)$/);
  if (friendMatch && req.method === 'DELETE') {
    const friendId = friendMatch[1];
    for (let index = FRIENDSHIPS.length - 1; index >= 0; index -= 1) {
      const edge = FRIENDSHIPS[index];
      if ((edge.userId === userId && edge.friendId === friendId) || (edge.userId === friendId && edge.friendId === userId)) FRIENDSHIPS.splice(index, 1);
    }
    return success({ message: 'Friend removed' });
  }

  const searchMatch = path.match(/^\/users\/search\/(.+)$/);
  if (searchMatch && req.method === 'GET') {
    const query = decodeURIComponent(searchMatch[1]).toLowerCase();
    const users = [...DEMO_USERS.values()]
      .filter(user => user.id !== userId && `${user.username} ${user.email} ${user.firstName} ${user.lastName}`.toLowerCase().includes(query))
      .slice(0, 10)
      .map(publicUser);
    return success({ users });
  }

  const sharedContactsMatch = path.match(/^\/users\/shared-contacts\/([^/]+)$/);
  if (sharedContactsMatch && req.method === 'GET') {
    const friendId = sharedContactsMatch[1];
    const connected = FRIENDSHIPS.some(edge =>
      edge.status === 'accepted' && ((edge.userId === userId && edge.friendId === friendId) || (edge.userId === friendId && edge.friendId === userId))
    );
    if (!connected) return respond(res, 403, { error: 'Not friends with this user' });
    return success({ contacts: (DEMO_DATA.get(friendId)?.contacts || []).filter(contact => contact.preferredInfo) });
  }

  if (path === '/users/change-password' && req.method === 'POST') {
    if (!req.body.currentPassword || !req.body.newPassword) return respond(res, 400, { error: 'Both passwords are required' });
    if (me.password !== req.body.currentPassword) return respond(res, 401, { error: 'Current password is incorrect' });
    me.password = req.body.newPassword;
    return success({ message: 'Password updated successfully' });
  }

  if (path === '/users/account' && req.method === 'DELETE') {
    if (req.body.confirmation !== 'DELETE MY ACCOUNT') return respond(res, 400, { error: 'Account deletion requires typing "DELETE MY ACCOUNT" in the confirmation field' });
    if (req.body.password !== me.password) return respond(res, 401, { error: 'Incorrect password' });
    DEMO_USERS.delete(userId);
    const accountIndex = DEMO_ACCOUNTS.findIndex(account => account.id === userId);
    if (accountIndex >= 0) DEMO_ACCOUNTS.splice(accountIndex, 1);
    DEMO_DATA.delete(userId);
    for (let index = FRIENDSHIPS.length - 1; index >= 0; index -= 1) {
      if (FRIENDSHIPS[index].userId === userId || FRIENDSHIPS[index].friendId === userId) FRIENDSHIPS.splice(index, 1);
    }
    return success({ message: 'Demo account deleted' });
  }

  return respond(res, 404, { error: 'This feature is not available in demo mode.' });
}

module.exports = {
  demoAccountsEnabled,
  findDemoAccount,
  handleDemoApi,
  listDemoAccounts,
  publicUser,
  registerDemoAccount
};
