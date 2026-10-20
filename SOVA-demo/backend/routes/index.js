/**
 * demo/backend/routes/index.js
 * Home page, admin/employee workspaces, static service/travel pages.
 * All data is from mockData — no database queries.
 */

const express = require('express');
const router = express.Router();
const { getSessionEvents, getSessionStore } = require('../data/mockData');
const { applyFeatureAction, featureView, getFeatureStore, getProfile, pushAudit } = require('../data/demoFeatures');

// ---------------------------------------------------------------------------
// Demo feature helpers
// ---------------------------------------------------------------------------
const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return next();
};

const requireAdmin = (req, res, next) => {
  if (String(req.session.user.role || '').toLowerCase() !== 'admin') {
    return res.status(403).render('error', { message: 'Administrator access required.' });
  }
  return next();
};

const requireDiscussionAccess = (req, res, next) => {
  const role = String(req.session.user.role || '').toLowerCase();
  if (!['employee', 'management', 'admin'].includes(role)) {
    return res.status(403).render('error', { message: 'Staff access is required to view the Discussion Board.' });
  }
  return next();
};

function renderFeature(req, res, key, options = {}) {
  const user = req.session.user || { username: 'Guest', role: 'customer' };
  return res.render('demo-feature', {
    user: req.session.user || null,
    feature: featureView(req.session, user, key, options),
    message: req.query.message || null
  });
}

function updateFeature(req, res, key) {
  const user = req.session.user || { username: 'Guest', role: 'customer' };
  const message = applyFeatureAction(req.session, user, key, req.body);
  return res.redirect(`${req.path}?message=${encodeURIComponent(message)}`);
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const { sovaEvents, dallasEvents } = getSessionEvents(req.session, city);

  return res.render('index', {
    user: req.session.user || null,
    sovaEvents,
    cityEvents: dallasEvents,
    canReserveEvents: true,
    maintenanceMode: false,
    databaseError: null
  });
});

// ---------------------------------------------------------------------------
// Admin workspace (session-scoped demo data)
// ---------------------------------------------------------------------------
router.get('/admin', requireLogin, (req, res) => {
  if (!['management', 'admin'].includes(String(req.session.user.role || '').toLowerCase())) {
    return res.redirect(req.session.user.role === 'employee' ? '/employee' : '/');
  }
  const isAdmin = String(req.session.user.role || '').toLowerCase() === 'admin';
  const features = getFeatureStore(req.session);
  return res.render('admin/index', {
    user: req.session.user,
    inactiveEventsCount: getSessionStore(req.session).events.filter(event => !event.is_active).length,
    suggestionInboxCount: features.suggestions.length,
    recentSuggestionCount: features.suggestions.length,
    canViewGovernance: isAdmin,
    canViewPlatformConfig: isAdmin,
    canViewInviteCodes: true,
    canViewTeamOperations: true,
    canViewSuggestionInbox: true,
    canViewInactiveEvents: true,
    canViewAudit: isAdmin,
    canViewDiagnostics: isAdmin
  });
});

// Admin sub-pages — stub responses so links don't hard-crash
router.get('/admin/users', requireLogin, requireAdmin, (req, res) => renderFeature(req, res, 'users'));
router.post('/admin/users', requireLogin, requireAdmin, (req, res) => updateFeature(req, res, 'users'));
router.get('/admin/invite-codes', requireLogin, (req, res) => renderFeature(req, res, 'invites'));
router.post('/admin/invite-codes', requireLogin, (req, res) => updateFeature(req, res, 'invites'));
router.get('/admin/platform-config', requireLogin, requireAdmin, (req, res) => renderFeature(req, res, 'platform'));
router.post('/admin/platform-config', requireLogin, requireAdmin, (req, res) => updateFeature(req, res, 'platform'));
router.get('/admin/audit', requireLogin, requireAdmin, (req, res) => renderFeature(req, res, 'audit'));
router.get('/admin/diagnostics', requireLogin, requireAdmin, (req, res) =>
  res.render('admin/diagnostics', {
    user: req.session.user,
    diagnostics: {
      serviceStatus: 'Demo',
      appTime: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      environment: 'demo',
      dbProbe: {
        connected: false,
        latencyMs: 0,
        version: null,
        dbTime: null,
        error: { code: 'DEMO_MODE', message: 'No database in demo mode.' }
      }
    }
  })
);
router.get('/admin/shift-notes/archive', requireLogin, (req, res) => renderFeature(req, res, 'archivedNotes'));

router.get('/admin/suggestions/:section?', requireLogin, (req, res) =>
  renderFeature(req, res, 'suggestions', { section: req.params.section || 'open' })
);
router.post('/admin/suggestions/:section?', requireLogin, (req, res) => updateFeature(req, res, 'suggestions'));

// ---------------------------------------------------------------------------
// Employee workspace
// ---------------------------------------------------------------------------
router.get('/employee', requireLogin, (req, res) =>
  res.render('employee/index', { user: req.session.user })
);

router.get('/employee/shift-notes', requireLogin, (req, res) => {
  const features = getFeatureStore(req.session);
  const notes = features.shiftNotes.map((note) => {
    const createdById = Number(note.createdById || (
      features.users.find((account) => account.title === note.createdBy) || {}
    ).id);
    const createdAt = note.createdAt || new Date().toISOString();
    return {
      id: note.id,
      shift_date: note.shiftDate || createdAt,
      shift_label: note.shiftLabel || 'afternoon',
      priority: note.priority || 'normal',
      note_category: note.category || 'employees',
      username: note.createdBy || 'Demo user',
      created_by: createdById,
      created_at: createdAt,
      age_seconds: Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)),
      note_text: note.noteText || note.details || ''
    };
  });
  return res.render('employee/shift-notes', {
    user: req.session.user,
    isAdmin: ['management', 'admin'].includes(String(req.session.user.role || '').toLowerCase()),
    notes,
    message: req.query.message || null
  });
});
router.post('/employee/shift-notes', requireLogin, (req, res) => {
  const shiftDate = String(req.body.shiftDate || '').trim();
  const shiftLabel = String(req.body.shiftLabel || '').trim();
  const priority = String(req.body.priority || '').trim();
  const noteCategory = String(req.body.noteCategory || '').trim();
  const noteText = String(req.body.noteText || '').trim().slice(0, 2000);
  if (!shiftDate || Number.isNaN(Date.parse(shiftDate)) || !shiftLabel || !priority || !noteCategory || !noteText) {
    return res.redirect('/employee/shift-notes?message=Complete+all+shift+note+fields.');
  }
  const message = applyFeatureAction(req.session, req.session.user, 'shiftNotes', {
    action: 'add',
    title: `${shiftDate} ${shiftLabel}`,
    category: noteCategory,
    priority,
    details: noteText
  });
  const note = getFeatureStore(req.session).shiftNotes[0];
  if (note) {
    note.shiftDate = shiftDate;
    note.shiftLabel = shiftLabel;
    note.noteText = noteText;
    note.createdById = req.session.user.id;
  }
  return res.redirect(`/employee/shift-notes?message=${encodeURIComponent(message)}`);
});
router.post('/employee/shift-notes/:id/edit', requireLogin, (req, res) => {
  const features = getFeatureStore(req.session);
  const note = features.shiftNotes.find((entry) => entry.id === String(req.params.id));
  if (!note) return res.status(404).render('error', { message: 'Shift note not found.' });
  const ageSeconds = (Date.now() - new Date(note.createdAt).getTime()) / 1000;
  if (Number(note.createdById) !== Number(req.session.user.id) || ageSeconds > 300) {
    return res.status(403).render('error', { message: 'Only the author can edit a shift note within five minutes of submission.' });
  }
  const noteText = String(req.body.noteText || '').trim().slice(0, 2000);
  if (!noteText) return res.redirect('/employee/shift-notes?message=Enter+a+note+before+saving.');
  note.noteText = noteText;
  note.details = noteText;
  note.detail = `${note.category} · ${note.priority} · ${noteText}`;
  pushAudit(features, req.session.user, 'Edited a shift note');
  return res.redirect('/employee/shift-notes?message=Shift+note+updated+for+this+session.');
});
router.post('/employee/shift-notes/:id/resolve', requireLogin, (req, res) => {
  const features = getFeatureStore(req.session);
  const index = features.shiftNotes.findIndex((entry) => entry.id === String(req.params.id));
  if (index < 0) return res.status(404).render('error', { message: 'Shift note not found.' });
  const [note] = features.shiftNotes.splice(index, 1);
  features.archivedNotes.unshift({ ...note, status: 'resolved' });
  pushAudit(features, req.session.user, 'Resolved a shift note');
  return res.redirect('/employee/shift-notes?message=Shift+note+resolved+for+this+session.');
});
router.post('/employee/shift-notes/:id/delete', requireLogin, (req, res) => {
  const features = getFeatureStore(req.session);
  const index = features.shiftNotes.findIndex((entry) => entry.id === String(req.params.id));
  if (index < 0) return res.status(404).render('error', { message: 'Shift note not found.' });
  const note = features.shiftNotes[index];
  const isAdmin = ['management', 'admin'].includes(String(req.session.user.role || '').toLowerCase());
  const isOwner = Number(note.createdById) === Number(req.session.user.id);
  if (!isAdmin && !isOwner) return res.status(403).render('error', { message: 'You cannot delete another user’s shift note.' });
  features.shiftNotes.splice(index, 1);
  pushAudit(features, req.session.user, 'Deleted a shift note');
  return res.redirect('/employee/shift-notes?message=Shift+note+deleted+from+this+session.');
});

router.get('/account/settings', requireLogin, (req, res) => renderFeature(req, res, 'settings'));
router.post('/account/settings', requireLogin, (req, res) => updateFeature(req, res, 'settings'));
router.get('/account/profile', requireLogin, (req, res) => {
  const profile = getProfile(req.session, req.session.user.id);
  return res.render('demo-feature', {
    user: req.session.user,
    message: null,
    feature: {
      key: 'profile',
      title: 'My Profile',
      description: 'Your current demo account profile.',
      fields: [],
      records: [{ title: profile.username, detail: `${profile.email} · ${profile.role} · ${profile.home_city} · ${profile.bio || 'No bio yet.'}` }],
      settingsHref: '/account/settings',
      emptyText: ''
    }
  });
});
router.get('/account/profile/:id', requireLogin, (req, res) => {
  const profile = getProfile(req.session, req.params.id);
  if (!profile) return res.status(404).render('error', { message: 'Demo account not found.' });
  return res.render('demo-feature', {
    user: req.session.user,
    message: null,
    feature: {
      key: 'profile',
      title: `${profile.username} — Demo Profile`,
      description: 'Sample account profile preview.',
      fields: [],
      records: [{ title: profile.username, detail: `${profile.email} · ${profile.role} · ${profile.home_city} · ${profile.bio || 'No bio yet.'}` }],
      emptyText: ''
    }
  });
});
router.get('/account/team', requireLogin, (req, res) => renderFeature(req, res, 'team'));

// ---------------------------------------------------------------------------
// Discussion (stub)
// ---------------------------------------------------------------------------
router.get('/discussion', requireLogin, requireDiscussionAccess, (req, res) => renderFeature(req, res, 'discussion'));
router.post('/discussion', requireLogin, requireDiscussionAccess, (req, res) => updateFeature(req, res, 'discussion'));

router.get('/reservations', (req, res) => renderFeature(req, res, 'reservations'));
router.post('/reservations', (req, res) => updateFeature(req, res, 'reservations'));

// ---------------------------------------------------------------------------
// Support pages
// ---------------------------------------------------------------------------
router.get('/support', (req, res) =>
  res.render('support', { user: req.session.user || null })
);
router.get('/support/faq', (req, res) =>
  res.render('faq', { user: req.session.user || null })
);
router.get('/support/contact', (req, res) => renderFeature(req, res, 'supportContact'));
router.post('/support/contact', (req, res) => updateFeature(req, res, 'supportContact'));
router.get('/support/suggestions', (req, res) => renderFeature(req, res, 'supportSuggestions'));
router.post('/support/suggestions', (req, res) => updateFeature(req, res, 'supportSuggestions'));

// ---------------------------------------------------------------------------
// Service & travel section pages (static)
// ---------------------------------------------------------------------------
const staticPage = (view) => (req, res) =>
  res.render(view, { user: req.session.user || null });

router.get('/services/fine-dining', staticPage('sections/fine-dining'));
router.get('/services/bars-entertainment', staticPage('sections/bars-entertainment'));
router.get('/services/culture-events', staticPage('sections/culture-events'));
router.get('/travel/city-highlights', staticPage('sections/city-highlights'));
router.get('/travel/neighborhood-guides', staticPage('sections/neighborhood-guides'));
router.get('/travel/day-trips', staticPage('sections/day-trips'));
router.get('/travel/walking-tours', staticPage('sections/walking-tours'));

// ---------------------------------------------------------------------------
// Health check (no DB info)
// ---------------------------------------------------------------------------
router.get('/health', (req, res) =>
  res.json({
    service: 'sova-demo',
    status: 'ok',
    mode: 'demo',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: { connected: false, note: 'Demo mode — no database.' }
  })
);

module.exports = router;
