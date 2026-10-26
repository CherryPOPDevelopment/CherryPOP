// Self-contained Aurelia demo API for the Cloudflare Worker, used when AURELIA_ORIGIN is not a usable URL.
// State lives in the isolate's memory, so changes are temporary and may reset at any time.
const encoder = new TextEncoder();

const DEMO_ACCOUNTS = [
  { id: 'demo-guest', username: 'guest', email: 'guest@aurelia.demo', password: 'GuestDemo123', role: 'guest', firstName: 'Guest', lastName: 'Preview' },
  { id: 'demo-employee', username: 'employee', email: 'employee@aurelia.demo', password: 'EmployeeDemo123', role: 'employee', firstName: 'Employee', lastName: 'Preview' },
  { id: 'demo-management', username: 'management', email: 'management@aurelia.demo', password: 'ManagementDemo123', role: 'management', firstName: 'Management', lastName: 'Preview' },
  { id: 'demo-admin', username: 'admin', email: 'admin@aurelia.demo', password: 'AdminDemo123', role: 'admin', firstName: 'Admin', lastName: 'Preview' },
];

const DEMO_USERS = new Map(DEMO_ACCOUNTS.map((account) => [account.id, account]));
const DEMO_DATA = new Map();
const FRIENDSHIPS = [];
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

function reply(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function hmacKey(env) {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be configured as a random value of at least 32 characters.');
  }
  return crypto.subtle.importKey('raw', encoder.encode(`aurelia-demo:${env.SESSION_SECRET}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function createToken(env, account) {
  const claims = {
    userId: account.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    account: { id: account.id, username: account.username, email: account.email, role: account.role, firstName: account.firstName, lastName: account.lastName },
  };
  const payload = base64Url(encoder.encode(JSON.stringify(claims)));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(env), encoder.encode(payload));
  return `${payload}.${base64Url(new Uint8Array(signature))}`;
}

async function readToken(env, request) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  const [payload, signature] = (token || '').split('.');
  if (!payload || !signature) return null;
  try {
    const valid = await crypto.subtle.verify('HMAC', await hmacKey(env), fromBase64Url(signature), encoder.encode(payload));
    if (!valid) return null;
    const claims = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return claims.exp > Date.now() / 1000 ? claims : null;
  } catch {
    return null;
  }
}

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
        { id: 'demo-contact-3', userId, name: 'Taylor Brooks', email: 'taylor.brooks@example.com', category: 'Family', notes: 'Cousin.' },
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
        usernameChangesRemaining: 2,
      },
    });
  }
  return DEMO_DATA.get(userId);
}

function normalizeContactBody(body) {
  return body && typeof body === 'object' && !Array.isArray(body) ? body : {};
}

function areFriends(a, b) {
  return (edge) => (edge.userId === a && edge.friendId === b) || (edge.userId === b && edge.friendId === a);
}

async function readBody(request) {
  if (['GET', 'HEAD', 'DELETE'].includes(request.method) && !request.headers.get('content-length')) return {};
  try {
    return normalizeContactBody(await request.json());
  } catch {
    return {};
  }
}

async function authRoute(request, env, path, body) {
  if (path === '/auth/demo-accounts' && request.method === 'GET') {
    return reply(200, {
      accounts: DEMO_ACCOUNTS
        .filter((account) => account.role === 'guest' && account.id === 'demo-guest')
        .map(({ username, email, password, role }) => ({ username, email, password, role })),
    });
  }

  if (path === '/auth/login' && request.method === 'POST') {
    const identifier = String(body.email || '').trim().toLowerCase();
    if (!identifier || !body.password) return reply(400, { error: 'Username/email and password required' });
    const account = [...DEMO_USERS.values()].find((item) =>
      (item.email.toLowerCase() === identifier || item.username.toLowerCase() === identifier) && item.password === body.password);
    if (!account) return reply(401, { error: 'Invalid username/email or password' });
    return reply(200, { success: true, token: await createToken(env, account), user: publicUser(account) });
  }

  if (path === '/auth/register' && request.method === 'POST') {
    const { username, email, password, firstName, lastName, age, birthday, phone } = body;
    if (!username || !email || !password || !firstName || !lastName || !age) return reply(400, { error: 'All fields are required' });
    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 13 || numericAge > 120) {
      return reply(400, { error: 'You must be at least 13 years old to register' });
    }
    const account = {
      id: `demo-${crypto.randomUUID()}`,
      username: String(username).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: 'guest',
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      phone: phone || '',
      birthday: birthday || '',
    };
    if ([...DEMO_USERS.values()].some((item) => item.email.toLowerCase() === account.email || item.username.toLowerCase() === account.username.toLowerCase())) {
      return reply(409, { error: 'User already exists' });
    }
    DEMO_USERS.set(account.id, account);
    return reply(201, { success: true, token: await createToken(env, account), user: publicUser(account) });
  }

  return reply(501, { error: 'This feature is not available in demo mode.' });
}

export async function handleAureliaDemoApi(request, env, url) {
  const path = (url.pathname.slice('/aurelia/api'.length).replace(/\/+$/, '')) || '/';
  const contentType = request.headers.get('content-type') || '';
  const forbiddenUpload = () => reply(403, { error: 'File and image uploads are disabled in demo mode.' });

  if (path.startsWith('/auth/')) {
    return authRoute(request, env, path, await readBody(request));
  }

  const claims = await readToken(env, request);
  if (!claims) return reply(401, { error: 'Access token required' });
  if (!DEMO_USERS.has(claims.userId) && claims.account?.id === claims.userId) {
    DEMO_USERS.set(claims.userId, { ...claims.account, password: null });
  }
  if (!DEMO_USERS.has(claims.userId)) return reply(401, { error: 'Demo account is no longer available.' });

  if (contentType.startsWith('multipart/form-data') || contentType.startsWith('image/') || contentType.startsWith('application/octet-stream')) {
    return forbiddenUpload();
  }

  const userId = claims.userId;
  const me = DEMO_USERS.get(userId);
  const data = getData(userId);
  const body = await readBody(request);
  const method = request.method;
  const success = (extra = {}) => reply(200, { success: true, ...extra });

  if (path === '/users/profile' && method === 'GET') {
    return success({ user: { ...data.profile }, usernameChangesRemaining: data.profile.usernameChangesRemaining });
  }

  if (path === '/users/profile' && method === 'PUT') {
    if (typeof body.profilePicture === 'string' && body.profilePicture.startsWith('data:')) return forbiddenUpload();
    Object.assign(data.profile, body);
    Object.assign(me, {
      username: data.profile.username || me.username,
      email: data.profile.email || me.email,
      firstName: data.profile.firstName || me.firstName,
      lastName: data.profile.lastName || me.lastName,
      bio: data.profile.bio || '',
      phone: data.profile.phone || '',
    });
    return success({ user: { ...data.profile }, usernameChangesRemaining: data.profile.usernameChangesRemaining });
  }

  if (path === '/contacts' && method === 'GET') {
    return success({ contacts: [...data.contacts].sort((a, b) => a.name.localeCompare(b.name)) });
  }

  if (path === '/contacts' && method === 'POST') {
    if (!body.name || !body.email) return reply(400, { error: 'Name and email are required' });
    const contact = { id: crypto.randomUUID(), userId, ...body, category: body.category || 'Other' };
    data.contacts.push(contact);
    return reply(201, { success: true, contact });
  }

  const contactMatch = path.match(/^\/contacts\/([^/]+)$/);
  if (contactMatch) {
    const index = data.contacts.findIndex((contact) => contact.id === contactMatch[1]);
    if (index < 0) return reply(404, { error: 'Contact not found' });
    if (method === 'GET') return success({ contact: data.contacts[index] });
    if (method === 'PUT') {
      data.contacts[index] = { ...data.contacts[index], ...body };
      return success({ message: 'Contact updated', contact: data.contacts[index] });
    }
    if (method === 'DELETE') {
      data.contacts.splice(index, 1);
      return success({ message: 'Contact deleted' });
    }
  }

  if (path === '/friends' && method === 'GET') {
    const friends = FRIENDSHIPS
      .filter((edge) => edge.status === 'accepted' && (edge.userId === userId || edge.friendId === userId))
      .map((edge) => DEMO_USERS.get(edge.userId === userId ? edge.friendId : edge.userId))
      .filter(Boolean)
      .map(publicUser);
    return success({ friends });
  }

  if (path === '/friends/requests/received' && method === 'GET') {
    const requests = FRIENDSHIPS
      .filter((edge) => edge.status === 'pending' && edge.friendId === userId && DEMO_USERS.has(edge.userId))
      .map((edge) => ({ ...publicUser(DEMO_USERS.get(edge.userId)), id: edge.id, userId: edge.userId, createdAt: edge.createdAt }));
    return success({ requests });
  }

  if (path === '/friends/requests/sent' && method === 'GET') {
    const requests = FRIENDSHIPS
      .filter((edge) => edge.status === 'pending' && edge.userId === userId && DEMO_USERS.has(edge.friendId))
      .map((edge) => ({ ...publicUser(DEMO_USERS.get(edge.friendId)), id: edge.id, friendId: edge.friendId, createdAt: edge.createdAt }));
    return success({ requests });
  }

  if ((path === '/friends/all-users' || path === '/friends/discover') && method === 'GET') {
    const users = [...DEMO_USERS.values()]
      .filter((user) => user.id !== userId)
      .filter((user) => path !== '/friends/discover' || !FRIENDSHIPS.some(areFriends(userId, user.id)))
      .map((user) => {
        const edge = FRIENDSHIPS.find(areFriends(userId, user.id));
        return {
          ...publicUser(user),
          friendStatus: edge?.status || 'none',
          isFriend: edge?.status === 'accepted',
          isPending: edge?.status === 'pending',
          isRequestSent: edge?.userId === userId && edge?.status === 'pending',
          sharedContacts: getData(user.id).contacts.filter((contact) => contact.preferredInfo),
        };
      });
    return success({ users });
  }

  const requestMatch = path.match(/^\/friends\/request\/(accept-user|reject-user)\/([^/]+)$/);
  const friendshipMatch = path.match(/^\/friends\/request\/(accept|reject)\/([^/]+)$/);
  if ((requestMatch || friendshipMatch) && method === 'POST') {
    const [, action, value] = requestMatch || friendshipMatch;
    const edge = FRIENDSHIPS.find((item) =>
      item.status === 'pending' && item.friendId === userId && (requestMatch ? item.userId === value : item.id === value));
    if (!edge) return reply(404, { error: 'Request not found' });
    if (action.startsWith('accept')) edge.status = 'accepted';
    else FRIENDSHIPS.splice(FRIENDSHIPS.indexOf(edge), 1);
    return success({ message: action.startsWith('accept') ? 'Friend request accepted' : 'Request rejected' });
  }

  const sendRequestMatch = path.match(/^\/friends\/request\/([^/]+)$/);
  if (sendRequestMatch && method === 'POST') {
    const friendId = sendRequestMatch[1];
    if (friendId === userId) return reply(400, { error: 'Cannot friend yourself' });
    if (!DEMO_USERS.has(friendId)) return reply(404, { error: 'User not found' });
    if (FRIENDSHIPS.some(areFriends(userId, friendId))) return reply(409, { error: 'Friendship already exists' });
    FRIENDSHIPS.push({ id: crypto.randomUUID(), userId, friendId, status: 'pending', createdAt: new Date().toISOString() });
    return success({ message: 'Friend request sent' });
  }

  const friendMatch = path.match(/^\/friends\/([^/]+)$/);
  if (friendMatch && method === 'DELETE') {
    const matches = areFriends(userId, friendMatch[1]);
    for (let index = FRIENDSHIPS.length - 1; index >= 0; index -= 1) {
      if (matches(FRIENDSHIPS[index])) FRIENDSHIPS.splice(index, 1);
    }
    return success({ message: 'Friend removed' });
  }

  const searchMatch = path.match(/^\/users\/search\/(.+)$/);
  if (searchMatch && method === 'GET') {
    const query = decodeURIComponent(searchMatch[1]).toLowerCase();
    const users = [...DEMO_USERS.values()]
      .filter((user) => user.id !== userId && `${user.username} ${user.email} ${user.firstName} ${user.lastName}`.toLowerCase().includes(query))
      .slice(0, 10)
      .map(publicUser);
    return success({ users });
  }

  const sharedContactsMatch = path.match(/^\/users\/shared-contacts\/([^/]+)$/);
  if (sharedContactsMatch && method === 'GET') {
    const friendId = sharedContactsMatch[1];
    const connected = FRIENDSHIPS.some((edge) => edge.status === 'accepted' && areFriends(userId, friendId)(edge));
    if (!connected) return reply(403, { error: 'Not friends with this user' });
    return success({ contacts: (DEMO_DATA.get(friendId)?.contacts || []).filter((contact) => contact.preferredInfo) });
  }

  if (path === '/users/change-password' && method === 'POST') {
    if (!body.currentPassword || !body.newPassword) return reply(400, { error: 'Both passwords are required' });
    if (me.password !== body.currentPassword) return reply(401, { error: 'Current password is incorrect' });
    me.password = body.newPassword;
    return success({ message: 'Password updated successfully' });
  }

  if (path === '/users/account' && method === 'DELETE') {
    if (body.confirmation !== 'DELETE MY ACCOUNT') return reply(400, { error: 'Account deletion requires typing "DELETE MY ACCOUNT" in the confirmation field' });
    if (body.password !== me.password) return reply(401, { error: 'Incorrect password' });
    DEMO_USERS.delete(userId);
    DEMO_DATA.delete(userId);
    for (let index = FRIENDSHIPS.length - 1; index >= 0; index -= 1) {
      if (FRIENDSHIPS[index].userId === userId || FRIENDSHIPS[index].friendId === userId) FRIENDSHIPS.splice(index, 1);
    }
    return success({ message: 'Demo account deleted' });
  }

  return reply(404, { error: 'This feature is not available in demo mode.' });
}
