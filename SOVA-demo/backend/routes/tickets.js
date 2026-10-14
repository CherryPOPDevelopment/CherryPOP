const express = require('express');

const router = express.Router();
const STAFF_ROLES = ['employee', 'management', 'maintenance', 'it', 'housekeeping', 'admin'];
const MANAGEMENT_ROLES = ['management', 'admin'];
const DEPARTMENTS = ['management', 'maintenance', 'it'];
const PRIORITIES = ['normal', 'urgent'];
const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

const roleOf = (req) => String(req.session.user.role || '').toLowerCase();
const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  return next();
};
const requireStaff = (req, res, next) => {
  if (!STAFF_ROLES.includes(roleOf(req))) {
    return res.status(403).render('error', { message: 'Staff access required.' });
  }
  return next();
};
const requireManagement = (req, res, next) => {
  if (!MANAGEMENT_ROLES.includes(roleOf(req))) {
    return res.status(403).render('error', { message: 'Management access required.' });
  }
  return next();
};

const getTickets = (req) => {
  if (!Array.isArray(req.session.demoTickets)) req.session.demoTickets = [];
  return req.session.demoTickets;
};

const ticketsForCity = (req, city) =>
  getTickets(req).filter((ticket) => ticket.city === city);

const redirectWithMessage = (res, path, message) =>
  res.redirect(`${path}?message=${encodeURIComponent(message)}`);

router.get('/employee/tickets', requireAuth, requireStaff, (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const isAdmin = MANAGEMENT_ROLES.includes(roleOf(req));
  const tickets = ticketsForCity(req, city)
    .filter((ticket) => ticket.status !== 'closed' && (isAdmin || ticket.created_by === req.session.user.id))
    .sort((a, b) => {
      if (isAdmin) {
        const priority = (b.priority === 'urgent' ? 1 : 0) - (a.priority === 'urgent' ? 1 : 0);
        if (priority) return priority;
      }
      return b.created_at.localeCompare(a.created_at);
    });

  return res.render('employee/tickets', {
    user: req.session.user,
    tickets,
    isAdmin,
    message: req.query.message || null
  });
});

router.post('/employee/tickets', requireAuth, requireStaff, (req, res) => {
  const title = String(req.body.title || '').trim();
  const department = String(req.body.department || '').toLowerCase();
  const priority = String(req.body.priority || 'normal').toLowerCase();
  const description = String(req.body.description || '').trim();

  if (!title || !DEPARTMENTS.includes(department) || !PRIORITIES.includes(priority) || !description) {
    return redirectWithMessage(res, '/employee/tickets', 'Please complete all ticket fields.');
  }
  if (title.length > 200) {
    return redirectWithMessage(res, '/employee/tickets', 'Title is too long (max 200 characters).');
  }
  if (description.length > 3000) {
    return redirectWithMessage(res, '/employee/tickets', 'Description is too long (max 3000 characters).');
  }

  const tickets = getTickets(req);
  const nextId = Number(req.session.demoTicketNextId || 1);
  req.session.demoTicketNextId = nextId + 1;
  tickets.unshift({
    id: String(nextId),
    title,
    department,
    priority,
    description,
    status: 'open',
    created_by: req.session.user.id,
    created_by_username: req.session.user.username,
    created_at: new Date().toISOString(),
    city: res.locals.city || 'DALLAS',
    resolved_by_username: null,
    resolved_at: null,
    resolution_note: null
  });
  return redirectWithMessage(res, '/employee/tickets', 'Ticket submitted for this session.');
});

const updateStatus = (req, res, redirectPath) => {
  const status = String(req.body.status || '').toLowerCase();
  const resolutionNote = String(req.body.resolutionNote || '').trim();
  if (!STATUSES.includes(status)) {
    return redirectWithMessage(res, redirectPath, 'Invalid ticket status.');
  }
  if (resolutionNote.length > 500) {
    return redirectWithMessage(res, redirectPath, 'Resolution note is too long (max 500 characters).');
  }

  const ticket = getTickets(req).find((entry) =>
    entry.id === String(req.params.id) && entry.city === (res.locals.city || 'DALLAS')
  );
  if (!ticket) {
    return res.status(404).render('error', { message: 'Ticket not found.' });
  }

  ticket.status = status;
  if (status === 'resolved' || status === 'closed') {
    ticket.resolved_by_username = req.session.user.username;
    ticket.resolved_at = new Date().toISOString();
    ticket.resolution_note = resolutionNote || null;
  }
  return redirectWithMessage(res, redirectPath, 'Ticket updated for this session.');
};

router.post('/employee/tickets/:id/status', requireAuth, requireManagement, (req, res) =>
  updateStatus(req, res, '/employee/tickets')
);

router.get('/admin/tickets', requireAuth, requireManagement, (req, res) => {
  const city = res.locals.city || 'DALLAS';
  const validDept = DEPARTMENTS.includes(String(req.query.dept || '').toLowerCase())
    ? String(req.query.dept).toLowerCase()
    : '';
  const validStatus = STATUSES.includes(String(req.query.status || '').toLowerCase())
    ? String(req.query.status).toLowerCase()
    : '';
  const cityTickets = ticketsForCity(req, city);
  const tickets = cityTickets
    .filter((ticket) => (!validDept || ticket.department === validDept) &&
      (!validStatus || ticket.status === validStatus))
    .sort((a, b) => {
      const priority = (b.priority === 'urgent' ? 1 : 0) - (a.priority === 'urgent' ? 1 : 0);
      return priority || b.created_at.localeCompare(a.created_at);
    });

  return res.render('admin/tickets', {
    user: req.session.user,
    tickets,
    openCount: cityTickets.filter((ticket) => ticket.status === 'open').length,
    filterDept: validDept,
    filterStatus: validStatus,
    message: req.query.message || null
  });
});

router.post('/admin/tickets/:id/status', requireAuth, requireManagement, (req, res) =>
  updateStatus(req, res, '/admin/tickets')
);

module.exports = router;
