/**
 * demo/backend/routes/index.js
 * Home page, admin/employee workspaces, static service/travel pages.
 * All data is from mockData — no database queries.
 */

const express = require('express');
const router = express.Router();
const { getSessionEvents } = require('../data/mockData');

// ---------------------------------------------------------------------------
// Role helpers
// ---------------------------------------------------------------------------
const getInterfaceType = (user) => {
  if (!user) return 'public';
  const role = (user.role || '').toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'management') return 'management';
  if (role === 'employee') return 'employee';
  return 'public';
};

const requireEmployee = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const t = getInterfaceType(req.session.user);
  if (t !== 'employee' && t !== 'management' && t !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied.' });
  }
  return next();
};

const requireManagementOrAdmin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const t = getInterfaceType(req.session.user);
  if (t !== 'management' && t !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied.' });
  }
  return next();
};

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const type = getInterfaceType(req.session.user);

  // Mirror main-app redirect behaviour
  if (type === 'employee') return res.redirect('/employee');
  if (type === 'admin' || type === 'management') return res.redirect('/admin');

  const city = res.locals.city || 'DALLAS';
  const { sovaEvents, dallasEvents } = getSessionEvents(req.session, city);

  return res.render('index', {
    user: req.session.user || null,
    sovaEvents,
    cityEvents: dallasEvents,
    canReserveEvents: false,
    maintenanceMode: false,
    databaseError: null
  });
});

// ---------------------------------------------------------------------------
// Admin workspace (read-only mock data)
// ---------------------------------------------------------------------------
router.get('/admin', requireManagementOrAdmin, (req, res) => {
  const role = (req.session.user?.role || '').toLowerCase();
  const isAdmin = role === 'admin';

  return res.render('admin/index', {
    user: req.session.user,
    inactiveEventsCount: 2,
    suggestionInboxCount: 5,
    recentSuggestionCount: 2,
    canViewGovernance: isAdmin,
    canViewPlatformConfig: isAdmin,
    canViewInviteCodes: isAdmin || role === 'management',
    canViewTeamOperations: isAdmin || role === 'management',
    canViewSuggestionInbox: isAdmin || role === 'management',
    canViewInactiveEvents: isAdmin || role === 'management',
    canViewAudit: isAdmin || role === 'management',
    canViewDiagnostics: isAdmin
  });
});

// Admin sub-pages — stub responses so links don't hard-crash
router.get('/admin/users', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'User governance is not available in the demo.' })
);
router.get('/admin/invite-codes', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'Invite code management is not available in the demo.' })
);
router.get('/admin/platform-config', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'Platform configuration is not available in the demo.' })
);
router.get('/admin/audit', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'Audit log is not available in the demo.' })
);
router.get('/admin/diagnostics', requireManagementOrAdmin, (req, res) =>
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
router.get('/admin/shift-notes/archive', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'Shift notes archive is not available in the demo.' })
);

// Suggestions inbox (stub)
router.get('/admin/suggestions', requireManagementOrAdmin, (req, res) =>
  res.render('error', { message: 'Suggestions inbox is not available in the demo.' })
);

// ---------------------------------------------------------------------------
// Employee workspace
// ---------------------------------------------------------------------------
router.get('/employee', requireEmployee, (req, res) =>
  res.render('employee/index', { user: req.session.user })
);

router.get('/employee/shift-notes', requireEmployee, (req, res) =>
  res.render('error', { message: 'Shift notes are not available in the demo.' })
);

// ---------------------------------------------------------------------------
// Account (stub — no profile editing in demo)
// ---------------------------------------------------------------------------
router.get('/account/settings', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return res.render('error', { message: 'Account settings are not available in the demo.' });
});
router.get('/account/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return res.render('error', { message: 'Account profile is not available in the demo.' });
});
router.get('/account/team', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return res.render('error', { message: 'Team directory is not available in the demo.' });
});

// ---------------------------------------------------------------------------
// Discussion (stub)
// ---------------------------------------------------------------------------
router.get('/discussion', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return res.render('error', { message: 'Discussion board is not available in the demo.' });
});

// ---------------------------------------------------------------------------
// Reservations (stub)
// ---------------------------------------------------------------------------
router.get('/reservations', (req, res) =>
  res.render('error', { message: 'Reservations are not available in the demo.' })
);

// ---------------------------------------------------------------------------
// Support pages
// ---------------------------------------------------------------------------
router.get('/support', (req, res) =>
  res.render('support', { user: req.session.user || null })
);
router.get('/support/faq', (req, res) =>
  res.render('faq', { user: req.session.user || null })
);
router.get('/support/contact', (req, res) =>
  res.render('contact', { user: req.session.user || null, sent: false, error: null })
);
router.get('/support/suggestions', (req, res) =>
  res.render('suggestions', { user: req.session.user || null, sent: false, error: null })
);

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
