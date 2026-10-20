const { randomUUID } = require('crypto');
const { DEMO_USERS, getSessionStore } = require('./mockData');

const definitions = {
  users: {
    title: 'User Governance',
    description: 'Review and update sample account roles. Changes are private to this session.',
    fields: [
      { name: 'username', label: 'Username', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'select', options: ['customer', 'employee', 'management', 'admin'] }
    ],
    emptyText: 'Add a sample account to explore role governance.'
  },
  invites: {
    title: 'Employee Invite Codes',
    description: 'Generate and manage sample onboarding codes.',
    fields: [
      { name: 'inviteRole', label: 'Access level', type: 'select', options: ['employee', 'management', 'admin'] },
      { name: 'maxUses', label: 'Maximum uses', type: 'number', required: true },
      { name: 'expiresInDays', label: 'Expires in days', type: 'number' }
    ],
    emptyText: 'No invite codes have been generated in this session.'
  },
  platform: {
    title: 'Platform Configuration',
    description: 'Change sample platform settings for this session only.',
    fields: [
      { name: 'platform_name', label: 'Platform name', required: true },
      { name: 'support_email', label: 'Support email', type: 'email', required: true },
      { name: 'default_city', label: 'Default city', type: 'select', options: ['DALLAS', 'AUSTIN'] }
    ],
    emptyText: ''
  },
  audit: {
    title: 'Audit & Monitoring',
    description: 'Review actions performed in this demo session.',
    fields: [],
    emptyText: 'Changes made in this session will appear here.'
  },
  archivedNotes: {
    title: 'Shift Notes Archive',
    description: 'Review resolved and archived shift handoffs.',
    fields: [],
    emptyText: 'No archived notes yet.'
  },
  suggestions: {
    title: 'Suggestion Inbox',
    description: 'Review and update suggestions submitted in this demo session.',
    fields: [],
    emptyText: 'Suggestions submitted through Support appear here.'
  },
  shiftNotes: {
    title: 'Shift Notes',
    description: 'Create, update, resolve, and archive session-only shift handoffs.',
    fields: [
      { name: 'title', label: 'Shift / note title', required: true },
      { name: 'category', label: 'Note category', type: 'select', options: ['guest', 'employees', 'management_maintenance'] },
      { name: 'priority', label: 'Priority', type: 'select', options: ['normal', 'urgent'] },
      { name: 'details', label: 'Note', type: 'textarea', required: true }
    ],
    emptyText: 'No active shift notes.'
  },
  settings: {
    title: 'Account Settings',
    description: 'Edit your demo profile and preferences. Changes never affect a real account.',
    mode: 'profile',
    fields: [
      { name: 'username', label: 'Username', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'home_city', label: 'Home city', type: 'select', options: ['DALLAS', 'AUSTIN'] },
      { name: 'interface_theme', label: 'Theme', type: 'select', options: ['light', 'dark'] }
    ],
    emptyText: ''
  },
  team: {
    title: 'Team Directory',
    description: 'Browse sample guest and staff accounts. Select an account to preview its profile.',
    fields: [],
    emptyText: 'No demo accounts are available.'
  },
  discussion: {
    title: 'Discussion Board',
    description: 'Create discussion posts and update or remove your session-only posts.',
    fields: [
      { name: 'title', label: 'Post title', required: true },
      { name: 'details', label: 'Message', type: 'textarea', required: true }
    ],
    emptyText: 'Start a discussion for this demo session.'
  },
  reservations: {
    title: 'Reservations',
    description: 'Submit a sample reservation and manage its status for this session.',
    fields: [
      { name: 'title', label: 'Event or venue', required: true },
      { name: 'guestName', label: 'Guest name', required: true },
      { name: 'guestEmail', label: 'Guest email', type: 'email', required: true },
      { name: 'guestCount', label: 'Number of guests', type: 'number', required: true },
      { name: 'details', label: 'Notes', type: 'textarea' }
    ],
    emptyText: 'No reservations in this session.'
  },
  supportContact: {
    title: 'Contact Support',
    description: 'Send a sample support request. It stays in this browser session.',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'subject', label: 'Subject', required: true },
      { name: 'details', label: 'Message', type: 'textarea', required: true }
    ],
    emptyText: 'No support requests submitted in this session.'
  },
  supportSuggestions: {
    title: 'Suggestion Box',
    description: 'Submit an idea and follow its sample review status in this session.',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'subject', label: 'Suggestion title', required: true },
      { name: 'details', label: 'Suggestion', type: 'textarea', required: true }
    ],
    emptyText: 'No suggestions submitted in this session.'
  }
};

function getFeatureStore(session) {
  const store = getSessionStore(session);
  if (!store.features) {
    store.features = {
      profiles: Object.fromEntries(DEMO_USERS.map(account => [String(account.id), {
        username: account.username,
        email: account.email,
        role: account.role,
        bio: `SOVA ${account.role} demo profile`,
        home_city: 'DALLAS',
        interface_theme: 'light'
      }])),
      users: DEMO_USERS.map(account => ({
        id: String(account.id),
        title: account.username,
        detail: account.email,
        status: account.role,
        createdBy: 'Demo seed'
      })),
      invites: [],
      audit: [],
      archivedNotes: [],
      suggestions: [],
      supportContact: [],
      shiftNotes: [],
      discussion: [],
      reservations: [],
      platform: { platform_name: 'SOVA Scoop', support_email: 'demo@sovascoop.local', default_city: 'DALLAS' },
      nextId: 1
    };
  }
  return store.features;
}

function pushAudit(features, user, summary) {
  features.audit.unshift({
    id: randomUUID(),
    title: summary,
    detail: `${user.username} · ${new Date().toLocaleString()}`,
    status: 'Recorded',
    createdBy: user.username
  });
  features.audit.splice(30);
}

function featureView(session, user, key, options = {}) {
  const features = getFeatureStore(session);
  const definition = definitions[key];
  let records = features[key] || [];
  if (key === 'team') records = features.users;
  if (key === 'archivedNotes') records = features.archivedNotes;
  if (key === 'supportSuggestions') records = features.suggestions;
  if (key === 'suggestions') {
    const section = options.section || 'open';
    records = records.filter(item => section === 'open'
      ? ['pending', 'open'].includes((item.status || '').toLowerCase())
      : (item.status || '').toLowerCase() === section);
  }
  if (key === 'settings') {
    const profile = features.profiles[String(user.id)] || {
      username: user.username, email: user.email, role: user.role, bio: '', home_city: 'DALLAS', interface_theme: 'light'
    };
    return {
      ...definition,
      key,
      fields: definition.fields.map(field => ({ ...field, value: profile[field.name] || '' })),
      records: [],
      profile,
      formAction: 'save-profile',
      section: options.section
    };
  }
  if (key === 'platform') {
    return {
      ...definition,
      key,
      fields: definition.fields.map(field => ({ ...field, value: features.platform[field.name] || '' })),
      records: [],
      formAction: 'save-platform',
      section: options.section
    };
  }
  if (key === 'team') {
    records = records.map(record => ({
      ...record,
      detail: `${record.detail} · ${record.status}`,
      href: `/account/profile/${record.id}`
    }));
  }
  return {
    ...definition,
    key,
    fields: definition.fields,
    records,
    formAction: 'add',
    emptyText: definition.emptyText,
    section: options.section
  };
}

function getProfile(session, accountId) {
  const features = getFeatureStore(session);
  const account = features.users.find(user => user.id === String(accountId));
  if (!account) return null;
  const profile = features.profiles[account.id] || {};
  return { ...account, ...profile };
}

function applyFeatureAction(session, user, key, body) {
  const features = getFeatureStore(session);
  const definition = definitions[key];
  if (!definition) return 'This demo feature is not available.';

  if (body.action === 'save-profile' && key === 'settings') {
    const current = features.profiles[String(user.id)] || {};
    for (const field of definition.fields) {
      if (typeof body[field.name] === 'string') current[field.name] = body[field.name].trim().slice(0, 1000);
    }
    features.profiles[String(user.id)] = current;
    user.username = current.username || user.username;
    user.email = current.email || user.email;
    user.interface_theme = current.interface_theme || user.interface_theme;
    if (current.home_city) session.city = current.home_city;
    const account = features.users.find(entry => entry.id === String(user.id));
    if (account) {
      account.title = user.username;
      account.detail = user.email;
    }
    pushAudit(features, user, 'Updated demo account settings');
    return 'Account settings saved for this session.';
  }

  if (body.action === 'save-platform' && key === 'platform') {
    for (const field of definition.fields) {
      if (typeof body[field.name] === 'string') features.platform[field.name] = body[field.name].trim().slice(0, 160);
    }
    pushAudit(features, user, 'Updated demo platform configuration');
    return 'Platform settings saved for this session.';
  }

  const records = key === 'supportSuggestions' ? features.suggestions : features[key];
  if (!Array.isArray(records)) return 'This demo feature does not accept changes.';

  const id = String(body.id || '');
  const record = records.find(item => item.id === id);
  if (body.action === 'delete' && record) {
    records.splice(records.indexOf(record), 1);
    pushAudit(features, user, `Deleted ${definition.title.toLowerCase()} entry`);
    return 'Entry removed from this session.';
  }
  if (body.action === 'status' && record) {
    const nextStatus = String(body.status || '').trim().slice(0, 40);
    if (!nextStatus) return 'Choose a status.';
    record.status = nextStatus;
    if (key === 'users') {
      if (features.profiles[record.id]) features.profiles[record.id].role = nextStatus;
      if (record.id === String(user.id)) user.role = nextStatus;
    }
    if (key === 'shiftNotes' && ['resolved', 'archived'].includes(nextStatus.toLowerCase())) {
      features.archivedNotes.unshift({ ...record, status: nextStatus, detail: `${record.detail} · ${nextStatus}` });
      records.splice(records.indexOf(record), 1);
    }
    pushAudit(features, user, `Changed ${definition.title.toLowerCase()} status to ${nextStatus}`);
    return 'Status updated for this session.';
  }

  if (body.action !== 'add') return 'That action is not available.';

  const values = {};
  for (const field of definition.fields) {
    const value = typeof body[field.name] === 'string' ? body[field.name].trim().slice(0, 2000) : '';
    if (field.required && !value) return `${field.label} is required.`;
    values[field.name] = value;
  }
  const title = values.title || values.username || values.subject || values.inviteRole || 'Demo entry';
  let detail = values.details || values.email || '';
  if (key === 'users') detail = `${values.email} · ${values.role}`;
  if (key === 'invites') detail = `${values.inviteRole} · ${values.maxUses || 1} uses · ${values.expiresInDays || 14} days · Demo signup code: SOVA-DEMO`;
  if (key === 'reservations') detail = `${values.guestName} (${values.guestEmail}) · ${values.guestCount || 1} guest(s)${values.details ? ` · ${values.details}` : ''}`;
  if (key === 'shiftNotes') detail = `${values.category} · ${values.priority} · ${values.details}`;
  const created = {
    id: String(features.nextId++),
    title,
    detail,
    status: key === 'suggestions' || key === 'supportSuggestions' || key === 'supportContact' ? 'pending' : 'Active',
    createdBy: user.username || values.name || 'Guest',
    createdAt: new Date().toISOString(),
    ...values
  };
  if (key === 'invites') created.title = 'SOVA-DEMO';
  records.unshift(created);
  pushAudit(features, user, `Added ${definition.title.toLowerCase()} entry`);
  return `${definition.title} entry added to this session.`;
}

module.exports = { applyFeatureAction, featureView, getFeatureStore, getProfile, pushAudit };
