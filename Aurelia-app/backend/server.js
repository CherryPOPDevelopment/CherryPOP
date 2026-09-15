require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const friendRoutes = require('./routes/friends');
const userRoutes = require('./routes/users');
const interestRoutes = require('./routes/interests');
const { verifyToken } = require('./middleware/auth');
const {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  securityHeaders,
  sanitizeInputs,
  payloadValidator,
  suspiciousPatternDetection
} = require('./middleware/security');
const {
  sanitizeAuthInput,
  sanitizeProfileInput,
  sanitizeContactInput,
  validateIdParam
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy when behind Cloudflare Tunnel or reverse proxy
app.set('trust proxy', true);

// ============ Security Middleware ============
// Apply security headers
app.use(securityHeaders);

// Limit payload size
app.use(payloadValidator);

// Sanitize inputs
app.use(sanitizeInputs);

// Detect suspicious patterns
app.use(suspiciousPatternDetection);

// NOTE: API rate limiting is applied specifically to /api routes below, not globally

// ============ Core Middleware ============
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5000', 'https://aureliacontacts.com', 'http://aureliacontacts.com'],
  credentials: true
}));
app.use(express.json({ limit: '20mb' })); // Increased for profile pictures (base64 images can be large)
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Simple request logger to help debug connectivity from browser
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Disable caching for development - force browser to always fetch latest files
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Serve static frontend files with special handling for downloads
app.use(express.static(path.join(__dirname, '../frontend'), {
  setHeaders: (res, filePath) => {
    // Set proper headers for executable downloads to ensure they download instead of opening
    if (filePath.endsWith('.exe') || filePath.endsWith('.dmg') || filePath.endsWith('.AppImage') || 
        filePath.endsWith('.deb') || filePath.endsWith('.rpm') || filePath.endsWith('.zip')) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment');
      // Allow longer download times for large files
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// ============ Routes ============
// Apply general API rate limiting to ALL /api routes first
app.use('/api', apiLimiter);

// Public routes with auth-specific rate limiting (more strict)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/auth/reset-password', passwordResetLimiter);
app.use('/api/auth', sanitizeAuthInput, authRoutes);

// Public interests endpoint (no auth required)
app.use('/api/interests', interestRoutes);

// Protected routes with validation
app.use('/api/contacts', verifyToken, validateIdParam, sanitizeContactInput, contactRoutes);
app.use('/api/friends', verifyToken, validateIdParam, friendRoutes);
app.use('/api/users', verifyToken, validateIdParam, sanitizeProfileInput, userRoutes);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Check /api/health for database status'
  });
});

app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: false,
      host: process.env.DB_HOST ? `${process.env.DB_HOST.substring(0, 20)}...` : 'NOT_SET'
    }
  };

  // Test database connection with timeout
  try {
    const db = require('./config/mysql-database');
    const pool = db.getPool();
    if (pool) {
      // Use Promise.race to add a 5-second timeout
      const connectionPromise = pool.getConnection();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      );

      const connection = await Promise.race([connectionPromise, timeoutPromise]);
      await connection.ping();
      connection.release();
      health.database.connected = true;
    } else {
      health.database.error = 'Database pool not initialized';
    }
  } catch (error) {
    health.database.connected = false;
    health.database.error = error.message;
  }

  const statusCode = health.database.connected ? 200 : 503;
  res.status(statusCode).json(health);
});

// Setup page
app.get('/setup', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Aurelia Contacts - Setup Required</title>
      <style>
        body { font-family: Arial; margin: 2rem; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
        h1 { color: #6366f1; }
        .code { background: #f0f0f0; padding: 1rem; border-left: 4px solid #6366f1; font-family: monospace; margin: 1rem 0; overflow-x: auto; }
        .step { margin: 1.5rem 0; }
        .step h2 { color: #333; margin-bottom: 0.5rem; }
        .success { color: #10b981; font-weight: bold; }
        .error { color: #ef4444; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>⚙️ Aurelia Contacts - Setup Required</h1>
        <p>Before you can use the application, please follow these steps:</p>

        <div class="step">
          <h2>1. Ensure MySQL is Running</h2>
          <p>Check that MySQL Server is running on your system.</p>
        </div>

        <div class="step">
          <h2>2. Setup MySQL Database</h2>
          <p>Run this command from the project root:</p>
          <div class="code">node backend/setup-mysql.js</div>
        </div>

        <div class="step">
          <h2>3. Install Dependencies</h2>
          <p>Install required packages:</p>
          <div class="code">npm install</div>
        </div>

        <div class="step">
          <h2>4. Restart Server</h2>
          <p>After setup, restart the server with npm start</p>
        </div>

        <p style="margin-top: 2rem; color: #666;">Support: support@aureliacontacts.com</p>
      </div>
    </body>
    </html>
  `);
});

// Frontend fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle payload too large errors with user-friendly message
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Image file is too large. Please compress your image or choose a smaller file (max 20MB).'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`� Security middleware enabled: Rate limiting, Input validation, Security headers`);
  console.log(`📧 Support email: support@aureliacontacts.com`);
  console.log(`\n⚠️  First time setup?`);
  console.log(`\nTo setup MySQL database, run: node backend/setup-mysql.js`);
  console.log(`To install dependencies, run: npm install\n`);
});

// Global error handlers to avoid silent crashes and provide diagnostics
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = server;

// Log server errors and handle shutdown signals
server.on('error', (err) => {
  console.error('Server error event:', err && err.stack ? err.stack : err);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down server...');
  try {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (e) {
    console.error('Error during shutdown:', e);
    process.exit(1);
  }
});

process.on('exit', (code) => {
  console.log('Process exiting with code', code);
});

module.exports = app;
