require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const authRouter      = require('./routes/auth');
const inquiriesRouter = require('./routes/inquiries');
const contentRouter   = require('./routes/content');
const paymentsRouter  = require('./routes/payments');

const app  = express();
const PORT = process.env.PORT || 3000;

const sovaProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:4000',
  changeOrigin: true,
  selfHandleResponse: true,
  on: {
    proxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
      if (proxyRes.headers.location?.startsWith('/')) {
        proxyRes.headers.location = `/sova-demo${proxyRes.headers.location}`;
      }

      const contentType = proxyRes.headers['content-type'] || '';
      if (!contentType.includes('text/html')) return responseBuffer;

      return responseBuffer
        .toString('utf8')
        .replace(/(href|action|src)=(['"])\/(?!sova-demo)/g, '$1=$2/sova-demo/');
    }),
  },
});

const aureliaProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:5000',
  changeOrigin: true,
  selfHandleResponse: true,
  on: {
    proxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
      if (proxyRes.headers.location?.startsWith('/')) {
        proxyRes.headers.location = `/aurelia${proxyRes.headers.location}`;
      }

      const contentType = proxyRes.headers['content-type'] || '';
      if (!contentType.includes('text/html')) return responseBuffer;

      return responseBuffer
        .toString('utf8')
        .replace(/(href|action|src)=(['"])\/(?!aurelia)/g, '$1=$2/aurelia/')
        .replace(/(['"])\/api\//g, '$1/aurelia/api/');
    }),
  },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   1000 * 60 * 60 * 8, // 8 hours
  },
}));

app.use('/sova-demo', sovaProxy);
app.use('/aurelia', aureliaProxy);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/css', express.static(path.join(__dirname, '..', 'CSS')));
app.use('/images', express.static(path.join(__dirname, '..', 'CherryPOPDev', 'Images')));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/content',   contentRouter);
app.use('/api/payments',  paymentsRouter);

// ── Page routes ───────────────────────────────────────────────────────────────
app.get('/',                 (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html')));
app.get('/login',            (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'login.html')));
app.get('/reset-password',   (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'reset-password.html')));
app.get('/payment-success',  (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'payment-success.html')));
app.get('/payment-cancelled',(_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'payment-cancelled.html')));
app.get('/contact',          (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'contact.html')));
app.get('/faq',              (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'faq.html')));
app.get('/dashboard',        (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'dashboard.html')));
app.get('/services/:name', (req, res) => {
  const allowed = ['website', 'app', 'shop'];
  if (!allowed.includes(req.params.name)) return res.redirect('/');
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'services', `${req.params.name}.html`));
});
app.get('/projects/scoop', (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'projects', 'scoop.html')));
app.get('/projects/scoopDEMO', (_, res) => res.redirect('/sova-demo'));
app.get('/projects/sova-demo', (_, res) => res.redirect('/sova-demo'));
app.get('/projects/aurelia', (_, res) => res.redirect('/aurelia/'));
app.get('/projects/luxe-botanics', (_, res) => res.sendFile(path.join(__dirname, '..', 'Frontend', 'projects', 'luxe-botanics.html')));

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).sendFile(path.join(__dirname, '..', 'Frontend', 'index.html')));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`CherryDev server running → http://localhost:${PORT}`);
});
