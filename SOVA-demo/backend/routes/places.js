/**
 * demo/backend/routes/places.js
 *
 * Full CRUD for places — all changes are stored in the session-scoped data
 * store (req.session.store) and are never persisted to disk or a database.
 * Everything is wiped automatically when the session is destroyed (logout).
 */

const express = require('express');
const router = express.Router();
const {
  getSessionPlaces,
  getSessionPlaceById,
  getSessionSidebar,
  createSessionPlace,
  updateSessionPlace,
  deleteSessionPlace,
  toggleSessionLike,
  addSessionComment,
  setSessionEmployeeRating
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
    return res.status(403).render('error', { message: 'Only staff members can perform this action.' });
  }
  return next();
};

const canEdit = (user, place) => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  return ['employee', 'management', 'admin'].includes(role) || Number(place.created_by) === Number(user.id);
};

const canDelete = (user, place) => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  return role === 'admin' || Number(place.created_by) === Number(user.id);
};

// ---------------------------------------------------------------------------
// Browse / listing
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const category = req.query.category || '';
  const search = req.query.search || '';

  const places = getSessionPlaces(req.session, { city, category, search });
  const sidebar = getSessionSidebar(req.session, city);

  return res.render('places/index', {
    user: req.session.user || null,
    places,
    category,
    search,
    sidebar
  });
});

// ---------------------------------------------------------------------------
// My recommendations
// ---------------------------------------------------------------------------
router.get('/my-recommendations', requireLogin, (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const { places } = require('../data/mockData').getSessionStore(req.session);
  const userPlaces = places.filter(
    (p) => p.city === city && Number(p.created_by) === Number(req.session.user.id)
  );
  const all = userPlaces;
  const published = userPlaces.filter((p) => p.approval_status === 'published');
  const drafts = userPlaces.filter((p) => p.approval_status === 'draft');
  const activeTab = req.query.tab || 'all';

  return res.render('places/my-recommendations', {
    user: req.session.user,
    groupedPlaces: { all, published, drafts },
    activeTab,
    message: req.query.message || null
  });
});

// ---------------------------------------------------------------------------
// New place — form + create
// ---------------------------------------------------------------------------
router.get('/new/form', requireLogin, (req, res) => {
  return res.render('places/new', {
    user: req.session.user,
    draftPlace: null,
    message: null,
    missingFields: []
  });
});

router.post('/new/create', requireLogin, (req, res) => {
  const required = ['title', 'category', 'detailed_description', 'location'];
  const missing = required.filter((f) => !(req.body[f] || '').trim());
  if (missing.length) {
    return res.render('places/new', {
      user: req.session.user,
      draftPlace: req.body,
      message: 'Please fill in all required fields.',
      missingFields: missing
    });
  }
  const place = createSessionPlace(req.session, req.body, req.session.user.id, req.session.user.username);
  return res.redirect(`/places/${place.id}`);
});

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.status(404).render('error', { message: 'Place not found.' });
  if (place.city !== (res.locals.city || 'DALLAS')) {
    return res.status(404).render('error', { message: 'Place not found.' });
  }

  const store = require('../data/mockData').getSessionStore(req.session);
  const likes = store.likes[place.id] || [];
  const comments = store.comments[place.id] || [];
  const userId = req.session.user ? req.session.user.id : null;
  const userLiked = userId ? likes.some((l) => l.user_id === userId) : false;
  const empR = store.empRatings[place.id];
  const userEmployeeRating = (empR && userId) ? (empR.byUser[userId] || null) : null;

  return res.render('places/detail', {
    user: req.session.user || null,
    place,
    likes,
    comments,
    relatedEvents: [],
    userLiked,
    employeeRatingAverage: place.employee_rating_avg || 0,
    employeeRatingCount: place.employee_rating_count || 0,
    userEmployeeRating
  });
});

// ---------------------------------------------------------------------------
// Edit
// ---------------------------------------------------------------------------
router.get('/:id/edit', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.status(404).render('error', { message: 'Place not found.' });
  if (!canEdit(req.session.user, place)) {
    return res.status(403).render('error', { message: 'You do not have permission to edit this place.' });
  }
  return res.render('places/edit', {
    user: req.session.user,
    place,
    message: null,
    missingFields: []
  });
});

router.put('/:id/update', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.status(404).render('error', { message: 'Place not found.' });
  if (!canEdit(req.session.user, place)) {
    return res.status(403).render('error', { message: 'You do not have permission to edit this place.' });
  }
  const required = ['title', 'category', 'detailed_description', 'location'];
  const missing = required.filter((f) => !(req.body[f] || '').trim());
  if (missing.length) {
    return res.render('places/edit', {
      user: req.session.user,
      place: { ...place, ...req.body, id: place.id },
      message: 'Please fill in all required fields.',
      missingFields: missing
    });
  }
  updateSessionPlace(req.session, place.id, req.body);
  return res.redirect(`/places/${place.id}`);
});

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
router.delete('/:id/delete', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.status(404).render('error', { message: 'Place not found.' });
  if (!canDelete(req.session.user, place)) {
    return res.status(403).render('error', { message: 'You do not have permission to delete this place.' });
  }
  deleteSessionPlace(req.session, place.id);
  return res.redirect('/places/my-recommendations?message=Recommendation+deleted.');
});

// ---------------------------------------------------------------------------
// Publish / draft status (my-recommendations queue)
// ---------------------------------------------------------------------------
router.post('/:id/publish', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (place && canEdit(req.session.user, place)) {
    place.approval_status = 'published';
  }
  return res.redirect('/places/my-recommendations');
});

router.post('/:id/draft', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (place && canEdit(req.session.user, place)) {
    place.approval_status = 'draft';
  }
  return res.redirect('/places/my-recommendations');
});

// ---------------------------------------------------------------------------
// Like (toggle)
// ---------------------------------------------------------------------------
router.post('/:id/like', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.redirect('/places');
  toggleSessionLike(req.session, place.id, req.session.user.id, req.session.user.username);
  return res.redirect(`/places/${place.id}#community`);
});

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
router.post('/:id/comments', requireLogin, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.redirect('/places');
  const text = (req.body.comment_text || '').trim();
  if (text) {
    addSessionComment(
      req.session,
      place.id,
      req.session.user.id,
      req.session.user.username,
      req.session.user.role,
      text
    );
  }
  return res.redirect(`/places/${place.id}#recommendation-comments`);
});

// ---------------------------------------------------------------------------
// Employee rating
// ---------------------------------------------------------------------------
router.post('/:id/employee-rating', requireEmployeeOrAbove, (req, res) => {
  const place = getSessionPlaceById(req.session, req.params.id);
  if (!place) return res.redirect('/places');
  const rating = parseFloat(req.body.rating);
  if (rating >= 1 && rating <= 5) {
    setSessionEmployeeRating(req.session, place.id, req.session.user.id, rating);
  }
  return res.redirect(`/places/${place.id}#employee-rating`);
});

module.exports = router;

