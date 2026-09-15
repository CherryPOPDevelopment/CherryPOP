/**
 * Security Middleware
 * Implements rate limiting, CSRF protection, and security headers
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// General API rate limiter (2000 requests per 15 minutes - very generous)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs (very generous for normal use)
  statusCode: 429,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Return JSON response instead of plain text
  handler: (req, res, next, options) => {
    console.log(`[RATE LIMIT] IP: ${req.ip}, Path: ${req.path}, Method: ${req.method}`);
    // Ensure response is always JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(options.statusCode).json({
      error: options.message,
      retryAfter: res.getHeader('Retry-After') || Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  },
  // Skip static files and only rate limit API endpoints
  skip: (req) => {
    // Skip development environment completely
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    // Skip localhost/127.0.0.1 requests (local development)
    const ip = req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip;
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === '::ffff:127.0.0.1') {
      return true;
    }
    // Skip static files (HTML, CSS, JS, images, favicon, etc.)
    const staticFileExtensions = /\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/i;
    const isStaticFile = staticFileExtensions.test(req.path);
    // Only apply rate limiting to /api/* routes (NOT /health or other non-API routes)
    const isApiRoute = req.path.startsWith('/api');
    return !isApiRoute || isStaticFile;
  },
  // Use CF-Connecting-IP or X-Forwarded-For when behind Cloudflare Tunnel
  keyGenerator: (req) => {
    return req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      'unknown';
  },
});

// Strict rate limiter for auth endpoints (50 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased from 20 to 50 for normal usage patterns
  statusCode: 429,
  message: 'Too many login attempts. Please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
  // Return JSON response instead of plain text
  handler: (req, res, next, options) => {
    console.log(`[AUTH RATE LIMIT] IP: ${req.ip}, Path: ${req.path}, Method: ${req.method}`);
    // Ensure response is always JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(options.statusCode).json({
      error: options.message,
      retryAfter: res.getHeader('Retry-After') || Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  },
  // Skip localhost/127.0.0.1 requests (local development)
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    const ip = req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip;
    return ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === '::ffff:127.0.0.1';
  },
  // Use CF-Connecting-IP or X-Forwarded-For when behind Cloudflare Tunnel
  keyGenerator: (req) => {
    return req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      'unknown';
  },
});

// Very strict rate limiter for password reset (increased for testing)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // 200 requests per hour (increased significantly)
  statusCode: 429,
  message: 'Too many password reset attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Return JSON response instead of plain text
  handler: (req, res, next, options) => {
    // Ensure response is always JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(options.statusCode).json({
      error: options.message,
      retryAfter: res.getHeader('Retry-After') || Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  },
  // Skip rate limiting in development for easier testing
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    const ip = req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip;
    return ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === '::ffff:127.0.0.1';
  },
  // Use CF-Connecting-IP or X-Forwarded-For when behind Cloudflare Tunnel
  keyGenerator: (req) => {
    return req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      'unknown';
  },
});

// Middleware to add security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://static.cloudflareinsights.com", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers (onclick, oninput, etc.)
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'http://localhost:5000', 'https://www.google.com', 'https://cloudflareinsights.com', 'https://static.cloudflareinsights.com'],
      fontSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'no-referrer' }
});

// Middleware to prevent NoSQL injection and common attack patterns
const sanitizeInputs = mongoSanitize({
  replaceWith: '_',
  onSanitize: (req, key) => {
    console.warn(`Sanitized ${key} in ${req.method} ${req.path}`);
  }
});

// Middleware to validate and limit request payload size
const payloadValidator = (req, res, next) => {
  const MAX_PAYLOAD_SIZE = 20 * 1024 * 1024; // 20MB (increased for profile pictures with base64 encoding)
  const contentLength = req.headers['content-length'];

  if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({ error: 'Payload too large. Maximum size is 20MB.' });
  }

  next();
};

// Middleware to check for suspicious patterns in requests
const suspiciousPatternDetection = (req, res, next) => {
  // Skip pattern detection for auth routes that accept usernames/emails
  const authRoutes = ['/api/auth/login', '/api/auth/request-login-code', '/api/auth/login-with-code'];
  const isAuthRoute = authRoutes.some(route => req.originalUrl.includes(route));
  
  if (isAuthRoute) {
    // For auth routes, only check for obvious XSS patterns, not SQL keywords
    // (usernames/emails might legitimately contain words that match SQL keywords)
    const xssPatterns = [
      /(\<script|javascript:|onerror|onload|onclick)/i, // XSS
      /(\.\.\/|\.\.\\)/i, // Path traversal
    ];

    const checkString = (str) => {
      if (typeof str === 'string') {
        return xssPatterns.some(pattern => pattern.test(str));
      }
      return false;
    };

    // Check body
    if (req.body) {
      for (const key in req.body) {
        if (checkString(req.body[key])) {
          console.warn(`Suspicious pattern detected in body.${key}`);
          return res.status(400).json({ error: 'Invalid input detected' });
        }
      }
    }

    // Check query
    if (req.query) {
      for (const key in req.query) {
        if (checkString(req.query[key])) {
          console.warn(`Suspicious pattern detected in query.${key}`);
          return res.status(400).json({ error: 'Invalid input detected' });
        }
      }
    }
  } else {
    // For other routes, use full pattern detection
    const suspiciousPatterns = [
      /(\<script|javascript:|onerror|onload|onclick)/i, // XSS
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i, // SQL Injection
      /(\.\.\/|\.\.\\)/i, // Path traversal
    ];

    const checkString = (str) => {
      if (typeof str === 'string') {
        return suspiciousPatterns.some(pattern => pattern.test(str));
      }
      return false;
    };

    // Check body
    if (req.body) {
      for (const key in req.body) {
        if (checkString(req.body[key])) {
          console.warn(`Suspicious pattern detected in body.${key}`);
          return res.status(400).json({ error: 'Invalid input detected' });
        }
      }
    }

    // Check query
    if (req.query) {
      for (const key in req.query) {
        if (checkString(req.query[key])) {
          console.warn(`Suspicious pattern detected in query.${key}`);
          return res.status(400).json({ error: 'Invalid input detected' });
        }
      }
    }
  }

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  securityHeaders,
  sanitizeInputs,
  payloadValidator,
  suspiciousPatternDetection
};
