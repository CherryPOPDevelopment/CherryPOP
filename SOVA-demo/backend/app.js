/**
 * demo/backend/app.js
 *
 * SOVA Scoop — Demo site.
 * Completely standalone: no database, no external services.
 * All data is served from demo/backend/data/mockData.js.
 *
 * Users can browse and log in with pre-set demo credentials.
 * Every mutating request (POST / PUT / PATCH / DELETE) is blocked.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// ---------------------------------------------------------------------------
// View engine
// ---------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'demo-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
  })
);

// ---------------------------------------------------------------------------
// Auth guard — same public-prefix list as the main app
// ---------------------------------------------------------------------------
const PUBLIC_PREFIXES = [
  '/auth',
  '/places',
  '/events',
  '/reservations',
  '/support',
  '/services',
  '/travel',
  '/location',
  '/css',
  '/js',
  '/uploads'
];

app.use((req, res, next) => {
  if (req.session && req.session.user) return next();

  const p = req.path || '/';
  if (p === '/' || PUBLIC_PREFIXES.some((prefix) => p.startsWith(prefix))) {
    return next();
  }

  return res.redirect('/auth/login');
});

// ---------------------------------------------------------------------------
// Demo mode: mark every logged-in user as a demo user (shows the banner).
// All interactions are allowed but stored only in the session — nothing is
// persisted. Session (and all its data) is destroyed on logout.
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  res.locals.isDemoUser = Boolean(req.session && req.session.user);
  return next();
});

// ---------------------------------------------------------------------------
// Shared locals — populated from mock / static config (no DB needed)
// ---------------------------------------------------------------------------
const DEFAULT_TIMEZONE = 'America/Chicago';
const DEFAULT_LOCALE = 'en-US';
const ALL_CITIES = ['DALLAS', 'AUSTIN'];

const toValidDate = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatWithTimeZone = (value, locale, timeZone, options) => {
  const parsed = toValidDate(value);
  if (!parsed) return '';
  return new Intl.DateTimeFormat(locale, { timeZone, ...options }).format(parsed);
};

const getDateTimeParts = (value, locale, timeZone) => {
  const parsed = toValidDate(value);
  if (!parsed) return null;
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(parsed);
  return parts.reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
};

app.use((req, res, next) => {
  const city = (req.session.city && ALL_CITIES.includes(req.session.city))
    ? req.session.city
    : 'DALLAS';

  req.session.city = city;

  const locale = DEFAULT_LOCALE;
  const timeZone = DEFAULT_TIMEZONE;

  res.locals.city = city;
  res.locals.availableCities = ALL_CITIES;
  res.locals.interfaceTheme = (req.session.user && req.session.user.interface_theme) || 'light';
  res.locals.timeZone = timeZone;
  res.locals.timeLocale = locale;
  res.locals.now = new Date();
  res.locals.dbConnected = true; // demo serves its own data — no maintenance banner
  res.locals.recaptchaSiteKey = '';
  res.locals.recaptchaMode = 'v3';

  res.locals.platformConfig = {
    platform_name: 'SOVA Scoop — Demo',
    support_email: 'demo@sovascoop.local',
    default_city: 'DALLAS',
    time_zone: timeZone,
    time_locale: locale
  };

  res.locals.platformCities = ALL_CITIES.map((c) => ({
    city: c,
    display_name: c,
    is_enabled: true
  }));

  res.locals.formatDate = (value, options = {}) =>
    formatWithTimeZone(value, locale, timeZone,
      Object.keys(options).length ? options : { month: 'short', day: 'numeric', year: 'numeric' });

  res.locals.formatTime = (value, options = {}) =>
    formatWithTimeZone(value, locale, timeZone,
      Object.keys(options).length ? options : { hour: 'numeric', minute: '2-digit' });

  res.locals.formatDateTime = (value, options = {}) =>
    formatWithTimeZone(value, locale, timeZone,
      Object.keys(options).length ? options : {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });

  res.locals.toDateInput = (value) => {
    const parts = getDateTimeParts(value, locale, timeZone);
    if (!parts) return '';
    return `${parts.year}-${parts.month}-${parts.day}`;
  };

  res.locals.toTimeInput = (value) => {
    const parts = getDateTimeParts(value, locale, timeZone);
    if (!parts) return '';
    return `${parts.hour}:${parts.minute}`;
  };

  next();
});

// ---------------------------------------------------------------------------
// City selector (GET only — no DB write)
// ---------------------------------------------------------------------------
app.get('/location/set', (req, res) => {
  const city = (req.query.city || '').toUpperCase();
  if (ALL_CITIES.includes(city)) req.session.city = city;
  const back = req.get('Referer') || '/';
  return res.redirect(back);
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/auth', require('./routes/auth'));
app.use('/places', require('./routes/places'));
app.use('/events', require('./routes/events'));
app.use('/', require('./routes/index'));

// ---------------------------------------------------------------------------
// Catch-all for routes the demo doesn't implement
// (account settings, admin tools that require DB writes, etc.)
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'This page is not available in the demo.'
  });
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).render('error', { message: 'Something went wrong.' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SOVA Demo server running on http://localhost:${PORT}`);
  console.log('Demo credentials:');
  console.log('  Customer  →  demo@sova.com / Demo1234');
  console.log('  Employee  →  employee@sova.com / Employee1234');
  console.log('  Admin     →  admin@sova.com / Admin1234');
});
