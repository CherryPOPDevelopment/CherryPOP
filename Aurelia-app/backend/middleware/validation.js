/**
 * Input Validation and Sanitization Middleware
 * Prevents common security vulnerabilities like injection attacks
 */

const validator = require('validator');

// Trim and sanitize all string inputs
function sanitizeString(str) {
  if (!str) return '';
  return validator.trim(validator.escape(str));
}

// Validate email format
function validateEmail(email) {
  return validator.isEmail(email);
}

// Validate password strength (at least 8 chars, 1 uppercase, 1 number)
function validatePassword(password) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  });
}

// Validate UUID format
function validateUUID(id) {
  return validator.isUUID(id);
}

// Sanitize input body for auth routes
function sanitizeAuthInput(req, res, next) {
  // Debug logging
  console.log('[VALIDATION] Path:', req.path, 'OriginalUrl:', req.originalUrl, 'BaseUrl:', req.baseUrl);

  // Skip validation for reset-password - it has its own validation
  if (req.path === '/reset-password') {
    console.log('Skipping sanitizeAuthInput for /reset-password');
    return next();
  }

  if (req.method === 'POST') {
    const { username, email, password, firstName, lastName } = req.body;
    console.log('[VALIDATION] Request body keys:', Object.keys(req.body));
    console.log('[VALIDATION] Email value:', email ? `${email.substring(0, 20)}...` : 'undefined');

    // Routes where email field can contain username or email
    // Check both req.path (relative to mount) and req.originalUrl (full path)
    const flexibleEmailRoutes = ['/login', '/request-login-code', '/login-with-code'];
    const isFlexibleEmailRoute = flexibleEmailRoutes.includes(req.path) ||
      req.originalUrl.includes('/request-login-code') ||
      req.originalUrl.includes('/login-with-code') ||
      req.originalUrl.includes('/api/auth/login');

    if (username) {
      req.body.username = validator.trim(validator.escape(username));
      if (req.body.username.length < 3 || req.body.username.length > 50) {
        return res.status(400).json({ error: 'Username must be 3-50 characters' });
      }
    }

    if (email !== undefined && email !== null) {
      // Only trim and lowercase email, don't escape (email validation handles it)
      const trimmedEmail = validator.trim(String(email));
      req.body.email = trimmedEmail; // Always set the trimmed value, even if empty

      if (!trimmedEmail) {
        console.log('[VALIDATION] Email is empty after trimming - letting route handler validate');
        // Don't return error here - let the route handler decide if email is required
      } else {
        req.body.email = trimmedEmail.toLowerCase();
        // For login, request-login-code, and login-with-code, skip email format validation since field can be username or email
        if (!isFlexibleEmailRoute && !validateEmail(req.body.email)) {
          console.log('[VALIDATION] Email validation failed for path:', req.path, 'email:', req.body.email);
          return res.status(400).json({ error: 'Invalid email format' });
        }
        // For flexible routes, just log that we're accepting username or email
        if (isFlexibleEmailRoute) {
          console.log('[VALIDATION] Accepting username or email for route:', req.path, 'input:', req.body.email);
        }
      }
    } else {
      console.log('[VALIDATION] No email field in request body');
    }

    // IMPORTANT: Do NOT sanitize/escape password - it needs to be passed as-is to bcrypt
    // Only validate password strength for registration
    if (password && req.path === '/register') {
      if (!validatePassword(password)) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters with uppercase and number'
        });
      }
      // Keep password as-is, don't escape it
    }
    // For login, password should remain untouched

    if (firstName) {
      req.body.firstName = validator.trim(validator.escape(firstName));
    }

    if (lastName) {
      req.body.lastName = validator.trim(validator.escape(lastName));
    }
  }

  next();
}

// Sanitize profile update input
function sanitizeProfileInput(req, res, next) {
  if (req.method === 'PUT') {
    const { firstName, lastName, bio, birthday, phone } = req.body;

    if (firstName) req.body.firstName = sanitizeString(firstName);
    if (lastName) req.body.lastName = sanitizeString(lastName);
    if (bio) req.body.bio = sanitizeString(bio).substring(0, 500); // Max 500 chars
    if (birthday) {
      // Validate date format YYYY-MM-DD
      if (!validator.isISO8601(birthday)) {
        return res.status(400).json({ error: 'Invalid birthday format' });
      }
    }
    if (phone) {
      req.body.phone = validator.trim(req.body.phone);
      if (!validator.isMobilePhone(req.body.phone, 'any', { strictMode: false })) {
        return res.status(400).json({ error: 'Invalid phone format' });
      }
    }
  }

  next();
}

// Sanitize contact input
function sanitizeContactInput(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const { name, email, phone, address, category, notes } = req.body;

    if (name) {
      req.body.name = sanitizeString(name);
      if (!req.body.name || req.body.name.length < 1 || req.body.name.length > 255) {
        return res.status(400).json({ error: 'Name must be 1-255 characters' });
      }
    }

    if (email && email !== '') {
      req.body.email = sanitizeString(email).toLowerCase();
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }

    if (phone && phone !== '') {
      req.body.phone = validator.trim(req.body.phone);
      if (!validator.isMobilePhone(req.body.phone, 'any', { strictMode: false })) {
        return res.status(400).json({ error: 'Invalid phone format' });
      }
    }

    if (address) req.body.address = sanitizeString(address).substring(0, 500);
    if (category) req.body.category = sanitizeString(category).substring(0, 50);
    if (notes) req.body.notes = sanitizeString(notes).substring(0, 1000);
  }

  next();
}

// Validate UUID params
function validateIdParam(req, res, next) {
  if (req.params.id && !validateUUID(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (req.params.contactId && !validateUUID(req.params.contactId)) {
    return res.status(400).json({ error: 'Invalid contact ID format' });
  }
  if (req.params.friendId && !validateUUID(req.params.friendId)) {
    return res.status(400).json({ error: 'Invalid friend ID format' });
  }
  if (req.params.friendshipId && !validateUUID(req.params.friendshipId)) {
    return res.status(400).json({ error: 'Invalid friendship ID format' });
  }
  next();
}

module.exports = {
  sanitizeString,
  validateEmail,
  validatePassword,
  validateUUID,
  sanitizeAuthInput,
  sanitizeProfileInput,
  sanitizeContactInput,
  validateIdParam
};
