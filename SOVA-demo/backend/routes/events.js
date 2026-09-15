/**
 * demo/backend/routes/events.js
 *
 * Full CRUD for events — all changes are stored in the session-scoped data
 * store and are never persisted. Everything is wiped on logout.
 */

const express = require('express');
const router = express.Router();
const {
  getSessionEvents,
  getSessionEventById,
  getSessionStore,
  createSessionEvent,
  updateSessionEvent,
  deleteSessionEvent,
  archiveSessionEvent,
  reactivateSessionEvent
} = require('../data/mockData');

// Helpers
const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return next();
};

const requireEmployeeOrAbove = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const role = (req.session.user.role || '').toLowerCase();
  if (!['employee', 'management', 'admin'].includes(role)) {
    return res.status(403).render('error', { message: 'Only staff members can manage events.' });
  }
  return next();
};

const requireManagementOrAdmin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const role = (req.session.user.role || '').toLowerCase();
  if (!['management', 'admin'].includes(role)) {
    return res.status(403).render('error', { message: 'Access denied.' });
  }
  return next();
};

const isSovaHosted = (event) => {
  const text = [event.title, event.location, event.description].filter(Boolean).join(' ').toLowerCase();
  return text.includes('sova');
};

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const { sovaEvents, dallasEvents } = getSessionEvents(req.session, city);

  return res.render('events/index', {
    user: req.session.user || null,
    sovaEvents,
    dallasEvents,
    canReserveEvents: false
  });
});

// ---------------------------------------------------------------------------
// Inactive events (admin/management only)
// ---------------------------------------------------------------------------
router.get('/admin/inactive', requireManagementOrAdmin, (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const { events } = getSessionStore(req.session);
  const inactive = events.filter((e) => e.city === city && !e.is_active);
  return res.render('events/inactive', {
    user: req.session.user,
    events: inactive,
    message: req.query.message || null
  });
});

// ---------------------------------------------------------------------------
// New event — form + create
// ---------------------------------------------------------------------------
router.get('/new/form', requireEmployeeOrAbove, (req, res) => {
  const { places } = getSessionStore(req.session);
  const city = res.locals.city || 'DALLAS';
  return res.render('events/new', {
    user: req.session.user,
    formData: null,
    message: null,
    places: places.filter((p) => p.city === city && p.approval_status === 'published'),
    selectedRecurringDays: []
  });
});

router.post('/new/create', requireEmployeeOrAbove, (req, res) => {
  const required = ['title', 'category', 'description', 'location', 'event_date', 'start_time', 'capacity'];
  const missing = required.filter((f) => !(req.body[f] || '').toString().trim());
  if (missing.length) {
    const { places } = getSessionStore(req.session);
    const city = res.locals.city || 'DALLAS';
    return res.render('events/new', {
      user: req.session.user,
      formData: req.body,
      message: 'Please fill in all required fields.',
      places: places.filter((p) => p.city === city && p.approval_status === 'published'),
      selectedRecurringDays: [].concat(req.body['recurring_days[]'] || [])
    });
  }
  const event = createSessionEvent(req.session, req.body, req.session.user.id);
  return res.redirect(`/events/${event.id}`);
});

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const event = getSessionEventById(req.session, req.params.id);
  if (!event) return res.status(404).render('error', { message: 'Event not found.' });

  return res.render('events/detail', {
    user: req.session.user || null,
    event,
    isSovaHosted: isSovaHosted(event),
    relatedPlace: null
  });
});

// ---------------------------------------------------------------------------
// Edit
// ---------------------------------------------------------------------------
router.get('/:id/edit', requireEmployeeOrAbove, (req, res) => {
  const event = getSessionEventById(req.session, req.params.id);
  if (!event) return res.status(404).render('error', { message: 'Event not found.' });
  const { places } = getSessionStore(req.session);
  const city = res.locals.city || 'DALLAS';
  return res.render('events/edit', {
    user: req.session.user,
    event,
    message: null,
    places: places.filter((p) => p.city === city && p.approval_status === 'published'),
    selectedRecurringDays: (event.recurring_days || '').split(',').filter(Boolean)
  });
});

router.put('/:id/update', requireEmployeeOrAbove, (req, res) => {
  const event = getSessionEventById(req.session, req.params.id);
  if (!event) return res.status(404).render('error', { message: 'Event not found.' });
  updateSessionEvent(req.session, event.id, req.body);
  return res.redirect(`/events/${event.id}`);
});

// ---------------------------------------------------------------------------
// Archive / reactivate
// ---------------------------------------------------------------------------
router.post('/:id/archive', requireEmployeeOrAbove, (req, res) => {
  archiveSessionEvent(req.session, req.params.id);
  const back = req.get('Referer') || '/events';
  return res.redirect(back);
});

router.post('/:id/reactivate', requireManagementOrAdmin, (req, res) => {
  reactivateSessionEvent(req.session, req.params.id);
  return res.redirect(`/events/${req.params.id}`);
});

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
router.delete('/:id/delete', requireManagementOrAdmin, (req, res) => {
  deleteSessionEvent(req.session, req.params.id);
  const redirect = req.query.redirect === 'inactive' ? '/events/admin/inactive' : '/events';
  return res.redirect(`${redirect}?message=Event+deleted.`);
});

module.exports = router;

