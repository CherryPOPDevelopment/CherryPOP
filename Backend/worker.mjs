import bcrypt from 'bcryptjs';
import { handleAureliaDemoApi } from './aurelia-demo.mjs';

const COOKIE_NAME = 'connect.sid';
const SESSION_TTL = 8 * 60 * 60;
const ALLOWED_SECTIONS = ['hero', 'about', 'services', 'contact'];
const VALID_SERVICES = ['website', 'app', 'shop', 'other'];
const VALID_STATUSES = ['new', 'in_review', 'accepted', 'completed', 'declined'];
const NOTIFY_ADDRESSES = ['support@cherrypopdevelopment.com', 'cherryDEVdirect@gmail.com'];
const PACKAGES = {
  'Website — Starter': { amount: 49900, label: 'Website Development — Starter' },
  'Website — Professional': { amount: 129900, label: 'Website Development — Professional' },
  'Website — Enterprise': { amount: 299900, label: 'Website Development — Enterprise' },
  'App — MVP': { amount: 199900, label: 'App Development — MVP' },
  'App — Growth': { amount: 399900, label: 'App Development — Growth' },
  'App — Scale': { amount: 799900, label: 'App Development — Scale' },
  'Shop — Starter': { amount: 59900, label: 'Shop Development — Starter' },
  'Shop — Pro': { amount: 179900, label: 'Shop Development — Pro' },
  'Shop — Enterprise': { amount: 399900, label: 'Shop Development — Enterprise' },
};

const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { 'cache-control': 'no-store', ...headers },
  });
}

function errorResponse(message, status) {
  return json({ error: message }, status);
}

async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function cookieValue(request, name) {
  const cookieHeader = request.headers.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator > 0 && part.slice(0, separator).trim() === name) {
      return part.slice(separator + 1).trim();
    }
  }
  return '';
}

function base64UrlEncode(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function sessionKey(env) {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be configured as a random value of at least 32 characters.');
  }
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(env.SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function createSessionCookie(user, env) {
  const payload = base64UrlEncode(JSON.stringify({
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL,
  }));
  const signature = await crypto.subtle.sign('HMAC', await sessionKey(env), encoder.encode(payload));
  return `${COOKIE_NAME}=${payload}.${base64UrlEncode(new Uint8Array(signature))}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; Secure; SameSite=Lax`;
}

async function getSessionUser(request, env) {
  const value = cookieValue(request, COOKIE_NAME);
  const separator = value.lastIndexOf('.');
  if (separator < 1) return null;

  try {
    const payload = value.slice(0, separator);
    const signature = base64UrlDecode(value.slice(separator + 1));
    const valid = await crypto.subtle.verify(
      'HMAC',
      await sessionKey(env),
      signature,
      encoder.encode(payload),
    );
    if (!valid) return null;

    const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (!session.user || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session.user;
  } catch (error) {
    if (error.message?.includes('SESSION_SECRET')) throw error;
    return null;
  }
}

async function withDb(env, work) {
  if (!env.DB) throw new Error('D1 is not configured. Add its binding in wrangler.jsonc.');
  const connection = {
    async execute(sql, params = []) {
      const sqliteSql = sql
        .replace(
          /ON DUPLICATE KEY UPDATE content = VALUES\(content\)/i,
          'ON CONFLICT(section) DO UPDATE SET content = excluded.content',
        )
        .replace(/\bNOW\(\)/gi, "datetime('now')")
        .replace(/\s+FOR UPDATE\b/i, '');
      const statement = env.DB.prepare(sqliteSql).bind(...params);
      if (/^\s*(SELECT|WITH)\b/i.test(sqliteSql)) {
        const result = await statement.all();
        return [result.results];
      }
      const result = await statement.run();
      return [{
        insertId: result.meta.last_row_id,
        affectedRows: result.meta.changes,
      }];
    },
  };
  return work(connection);
}

function scheduleEmail(ctx, task, description) {
  ctx.waitUntil(task.catch(error => console.error(`[email] ${description} failed:`, error)));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

async function sendEmail(env, payload) {
  if (!env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not configured; email was not sent.');
    return;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'cherry.dev <noreply@cherrypopdevelopment.com>',
      ...payload,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend returned ${response.status}: ${detail}`);
  }
}

function messageHtml(title, message, details = '') {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0d0d0d;color:#eee;padding:28px;border-radius:12px"><h1 style="color:#e74c3c">${escapeHtml(title)}</h1><p style="line-height:1.7">${escapeHtml(message)}</p>${details}</div>`;
}

function emailText(value) {
  return {
    html: messageHtml(value.title, value.message, value.details || ''),
    text: value.text || value.message,
  };
}

function scheduleInquiryEmails(env, ctx, inquiry) {
  const details = `<p><strong>Reference:</strong> #${inquiry.id}</p><p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p><p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p><p><strong>Service:</strong> ${escapeHtml(inquiry.service_type)}</p><p><strong>Budget:</strong> ${escapeHtml(inquiry.budget || '—')}</p><p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>`;
  const subject = `[cherry.dev] New ${inquiry.service_type} request — #${inquiry.id}`;
  scheduleEmail(ctx, sendEmail(env, {
    from: 'cherry.dev <support@cherrypopdevelopment.com>',
    to: NOTIFY_ADDRESSES,
    subject,
    ...emailText({ title: 'New project request', message: 'A new request was submitted.', details }),
  }), 'inquiry notification');

  const isOrder = ['website', 'app', 'shop'].includes(inquiry.service_type);
  scheduleEmail(ctx, sendEmail(env, {
    to: [inquiry.email],
    subject: `[cherry.dev] ${isOrder ? 'Order request received' : 'Message received'} — #${inquiry.id}`,
    ...emailText({
      title: isOrder ? 'Order request received' : 'Message received',
      message: `Hi ${inquiry.name}, thanks for reaching out. I received your request and will get back to you within 24 hours.`,
      details: `<p><strong>Reference:</strong> #${inquiry.id}</p><p><strong>Service:</strong> ${escapeHtml(inquiry.service_type)}</p><p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>`,
    }),
  }), 'inquiry confirmation');
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAdmin(user) {
  return user?.role === 'admin';
}

async function apiRoute(request, env, ctx, url) {
  const path = url.pathname;
  const method = request.method;

  if (path.startsWith('/api/auth/')) {
    const action = path.slice('/api/auth/'.length);

    if (method === 'GET' && action === 'check') {
      const user = await getSessionUser(request, env);
      return json(user ? { loggedIn: true, user } : { loggedIn: false });
    }

    if (method === 'POST' && action === 'logout') {
      return json({ success: true }, 200, {
        'set-cookie': `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      });
    }

    const body = await readJson(request);
    if (!body) return errorResponse('A valid JSON object is required.', 400);

    if (method === 'POST' && action === 'register') {
      const { username, email, password } = body;
      if (![username, email, password].every(value => typeof value === 'string' && value.length)) {
        return errorResponse('username, email, and password are required.', 400);
      }
      if (!isValidEmail(email)) return errorResponse('Invalid email address.', 400);
      if (password.length < 8) return errorResponse('Password must be at least 8 characters.', 400);
      if (username.length < 3 || username.length > 50 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        return errorResponse('Username must be 3–50 characters and contain only letters, numbers, or underscores.', 400);
      }

      const normalizedUsername = username.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const result = await withDb(env, async connection => {
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
          [normalizedUsername, normalizedEmail],
        );
        if (existing.length) return null;
        const hash = await bcrypt.hash(password, 12);
        const [insert] = await connection.execute(
          'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
          [normalizedUsername, normalizedEmail, hash, 'client'],
        );
        return { id: insert.insertId, username: normalizedUsername, email: normalizedEmail, role: 'client' };
      });
      if (!result) return errorResponse('Username or email already in use.', 409);

      scheduleEmail(ctx, sendEmail(env, {
        to: [result.email],
        subject: 'Welcome to cherry.dev!',
        ...emailText({
          title: 'Welcome to cherry.dev',
          message: `Hi ${result.username}, your account has been created. You can now log in to track your projects.`,
          details: '<p><a href="https://cherrypopdevelopment.com/login">Go to login</a></p>',
        }),
      }), 'welcome email');
      return json({ success: true, user: result }, 201, { 'set-cookie': await createSessionCookie(result, env) });
    }

    if (method === 'POST' && action === 'login') {
      const { username, password } = body;
      if (typeof username !== 'string' || !username || typeof password !== 'string' || !password) {
        return errorResponse('Username and password are required.', 400);
      }
      const user = await withDb(env, async connection => {
        const [rows] = await connection.execute(
          'SELECT id, username, email, password_hash, role FROM users WHERE username = ? LIMIT 1',
          [username],
        );
        if (!rows.length || !await bcrypt.compare(password, rows[0].password_hash)) return null;
        const row = rows[0];
        return { id: row.id, username: row.username, email: row.email, role: row.role };
      });
      if (!user) return errorResponse('Invalid credentials.', 401);
      return json({ success: true, user }, 200, { 'set-cookie': await createSessionCookie(user, env) });
    }

    if (method === 'POST' && action === 'forgot-password') {
      const response = json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
      const email = body.email;
      if (!isValidEmail(email)) return response;
      const user = await withDb(env, async connection => {
        const [rows] = await connection.execute(
          'SELECT id, username, email FROM users WHERE email = ? LIMIT 1',
          [email.trim().toLowerCase()],
        );
        return rows[0] || null;
      });
      if (user) {
        const token = [...crypto.getRandomValues(new Uint8Array(32))]
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
        const tokenHash = await sha256Hex(token);
        await withDb(env, connection => connection.execute(
          'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
          [user.id, tokenHash, new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')],
        ));
        const siteUrl = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');
        const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(token)}`;
        scheduleEmail(ctx, sendEmail(env, {
          to: [user.email],
          subject: '[cherry.dev] Password reset request',
          ...emailText({
            title: 'Reset your password',
            message: `Hi ${user.username}, use the link below to reset your password. This link expires in one hour.`,
            details: `<p><a href="${escapeHtml(resetUrl)}">Reset password</a></p><p>${escapeHtml(resetUrl)}</p>`,
          }),
        }), 'password reset email');
      }
      return response;
    }

    if (method === 'POST' && action === 'forgot-username') {
      const response = json({ success: true, message: 'If that email is registered, your username has been sent.' });
      const email = body.email;
      if (!isValidEmail(email)) return response;
      const user = await withDb(env, async connection => {
        const [rows] = await connection.execute(
          'SELECT username, email FROM users WHERE email = ? LIMIT 1',
          [email.trim().toLowerCase()],
        );
        return rows[0] || null;
      });
      if (user) {
        scheduleEmail(ctx, sendEmail(env, {
          to: [user.email],
          subject: '[cherry.dev] Your username reminder',
          ...emailText({
            title: 'Your username',
            message: `Your cherry.dev username is: ${user.username}`,
          }),
        }), 'username reminder email');
      }
      return response;
    }

    if (method === 'POST' && action === 'reset-password') {
      const { token, password } = body;
      if (typeof token !== 'string' || !token || typeof password !== 'string' || !password) {
        return errorResponse('Token and password are required.', 400);
      }
      if (password.length < 8) return errorResponse('Password must be at least 8 characters.', 400);

      const tokenHash = await sha256Hex(token);
      const success = await withDb(env, async connection => {
        const [rows] = await connection.execute(
          "SELECT id FROM password_reset_tokens WHERE token_hash = ? AND used = 0 AND datetime(expires_at) > datetime('now') LIMIT 1",
          [tokenHash],
        );
        if (!rows.length) return false;

        const hash = await bcrypt.hash(password, 12);
        const results = await env.DB.batch([
          env.DB.prepare(
            `UPDATE users SET password_hash = ?
             WHERE id = (
               SELECT user_id FROM password_reset_tokens
               WHERE token_hash = ? AND used = 0 AND datetime(expires_at) > datetime('now')
             )`,
          ).bind(hash, tokenHash),
          env.DB.prepare(
            `UPDATE password_reset_tokens SET used = 1
             WHERE token_hash = ? AND used = 0 AND datetime(expires_at) > datetime('now')`,
          ).bind(tokenHash),
        ]);
        return results[0].meta.changes > 0 && results[1].meta.changes > 0;
      });
      return success ? json({ success: true }) : errorResponse('Reset link is invalid or has expired.', 400);
    }
    return errorResponse('Not found.', 404);
  }

  if (path.startsWith('/api/content')) {
    const section = path.slice('/api/content'.length).replace(/^\/+/, '');
    const user = await getSessionUser(request, env);
    if (method === 'GET' && !section) {
      if (!isAdmin(user)) return errorResponse('Forbidden.', 403);
      const result = await withDb(env, async connection => {
        const [rows] = await connection.execute('SELECT section, content, updated_at FROM site_content');
        return Object.fromEntries(rows.map(row => [
          row.section,
          { ...JSON.parse(row.content), updated_at: row.updated_at },
        ]));
      });
      return json(result);
    }
    if (!ALLOWED_SECTIONS.includes(section)) {
      return errorResponse(section ? 'Unknown section.' : 'Not found.', section ? 400 : 404);
    }
    if (method === 'GET') {
      const content = await withDb(env, async connection => {
        const [rows] = await connection.execute(
          'SELECT content FROM site_content WHERE section = ? LIMIT 1',
          [section],
        );
        return rows.length ? JSON.parse(rows[0].content) : null;
      });
      return content ? json(content) : errorResponse('Not found.', 404);
    }
    if (method === 'PUT') {
      if (!isAdmin(user)) return errorResponse('Forbidden.', 403);
      const body = await readJson(request);
      if (!body) return errorResponse('Body must be a JSON object.', 400);
      const safe = Object.fromEntries(Object.entries(body).filter(([, value]) => typeof value === 'string'));
      await withDb(env, connection => connection.execute(
        `INSERT INTO site_content (section, content) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE content = VALUES(content)`,
        [section, JSON.stringify(safe)],
      ));
      return json({ success: true });
    }
    return errorResponse('Method not allowed.', 405);
  }

  if (path === '/api/inquiries' && method === 'POST') {
    const body = await readJson(request);
    if (!body) return errorResponse('A valid JSON object is required.', 400);
    const { name, email, service_type, budget, message } = body;
    if (![name, email, service_type, message].every(value => typeof value === 'string' && value.trim())) {
      return errorResponse('name, email, service_type, and message are required.', 400);
    }
    if (!VALID_SERVICES.includes(service_type)) return errorResponse('Invalid service_type.', 400);
    if (!isValidEmail(email)) return errorResponse('Invalid email address.', 400);
    if (budget != null && typeof budget !== 'string') return errorResponse('Invalid budget.', 400);

    const inquiry = await withDb(env, async connection => {
      const normalized = {
        name: name.trim(),
        email: email.trim(),
        service_type,
        budget: budget ? budget.trim() : null,
        message: message.trim(),
      };
      const [result] = await connection.execute(
        'INSERT INTO inquiries (name, email, service_type, budget, message) VALUES (?, ?, ?, ?, ?)',
        [normalized.name, normalized.email, normalized.service_type, normalized.budget, normalized.message],
      );
      return { ...normalized, id: result.insertId };
    });
    scheduleInquiryEmails(env, ctx, inquiry);
    return json({ success: true, id: inquiry.id }, 201);
  }

  if (path === '/api/inquiries' && method === 'GET') {
    if (!isAdmin(await getSessionUser(request, env))) return errorResponse('Forbidden.', 403);
    const rows = await withDb(env, async connection => {
      const [result] = await connection.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
      return result;
    });
    return json(rows);
  }

  const inquiryStatusMatch = path.match(/^\/api\/inquiries\/(\d+)$/);
  if (inquiryStatusMatch && method === 'PATCH') {
    if (!isAdmin(await getSessionUser(request, env))) return errorResponse('Forbidden.', 403);
    const body = await readJson(request);
    if (!body || !VALID_STATUSES.includes(body.status)) return errorResponse('Invalid status.', 400);
    await withDb(env, connection => connection.execute(
      'UPDATE inquiries SET status = ? WHERE id = ?',
      [body.status, inquiryStatusMatch[1]],
    ));
    return json({ success: true });
  }

  if (path === '/api/payments/checkout' && method === 'POST') {
    if (!env.STRIPE_SECRET_KEY) return errorResponse('Payment processing is not configured yet.', 503);
    const body = await readJson(request);
    if (!body || !body.inquiry_id || !body.tier) {
      return errorResponse('inquiry_id and tier are required.', 400);
    }
    const pkg = PACKAGES[body.tier];
    if (!pkg) return errorResponse('Unknown package tier.', 400);

    const inquiry = await withDb(env, async connection => {
      const [rows] = await connection.execute(
        'SELECT id, email FROM inquiries WHERE id = ? LIMIT 1',
        [body.inquiry_id],
      );
      return rows[0] || null;
    });
    if (!inquiry) return errorResponse('Inquiry not found.', 404);

    const siteUrl = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');
    const form = new URLSearchParams({
      mode: 'payment',
      payment_method_types: 'card',
      customer_email: inquiry.email,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': pkg.label,
      'line_items[0][price_data][product_data][description]': `cherry.dev · Order #${inquiry.id}`,
      'line_items[0][price_data][unit_amount]': String(pkg.amount),
      'line_items[0][quantity]': '1',
      billing_address_collection: 'auto',
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment-cancelled?inquiry_id=${encodeURIComponent(inquiry.id)}`,
      'metadata[inquiry_id]': String(inquiry.id),
    });
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
    const stripeResult = await stripeResponse.json();
    if (!stripeResponse.ok) {
      console.error('[payments] Stripe checkout error:', stripeResult.error?.message || stripeResponse.status);
      return errorResponse('Failed to create payment session.', 500);
    }
    await withDb(env, connection => connection.execute(
      'UPDATE inquiries SET stripe_session_id = ?, payment_status = ? WHERE id = ?',
      [stripeResult.id, 'pending', inquiry.id],
    ));
    return json({ url: stripeResult.url });
  }

  if (path === '/api/payments/webhook' && method === 'POST') {
    if (!env.STRIPE_SECRET_KEY) return errorResponse('Payment processing is not configured yet.', 503);
    if (!env.STRIPE_WEBHOOK_SECRET) return errorResponse('STRIPE_WEBHOOK_SECRET is not set.', 500);
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const valid = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    if (!valid) return errorResponse('Webhook signature verification failed.', 400);

    const event = JSON.parse(rawBody);
    if (event.type === 'checkout.session.completed') {
      const checkout = event.data?.object;
      const inquiryId = checkout?.metadata?.inquiry_id;
      if (inquiryId) {
        const inquiry = await withDb(env, async connection => {
          await connection.execute(
            'UPDATE inquiries SET payment_status = ?, status = ? WHERE id = ?',
            ['paid', 'in_review', inquiryId],
          );
          const [rows] = await connection.execute(
            'SELECT id, name, email, service_type, budget FROM inquiries WHERE id = ? LIMIT 1',
            [inquiryId],
          );
          return rows[0] || null;
        });
        if (inquiry) {
          scheduleEmail(ctx, sendEmail(env, {
            to: [inquiry.email],
            subject: '[cherry.dev] Payment confirmation',
            ...emailText({
              title: 'Payment received',
              message: `Hi ${inquiry.name}, we received your payment of $${((checkout.amount_total || 0) / 100).toFixed(2)} for request #${inquiry.id}.`,
            }),
          }), 'payment confirmation');
        }
      }
    }
    return json({ received: true });
  }

  return errorResponse('Not found.', 404);
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyStripeSignature(payload, header, secret) {
  const parts = header.split(',').map(part => part.split('=', 2));
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return signatures.some(signature => signature.length === expected.length
    && [...signature].reduce((diff, character, index) => diff | (character.charCodeAt(0) ^ expected.charCodeAt(index)), 0) === 0);
}

function redirect(path) {
  return new Response(null, { status: 302, headers: { location: path, 'cache-control': 'no-store' } });
}

function hasUsableOrigin(value) {
  try {
    const origin = new URL(value);
    return origin.protocol === 'https:' || origin.hostname === 'localhost' || origin.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

async function proxyApp(request, env, prefix, originValue) {
  if (!originValue) return errorResponse(`${prefix} origin is not configured.`, 503);
  let origin;
  try {
    origin = new URL(originValue);
  } catch {
    return errorResponse(`${prefix} origin is not a valid URL.`, 500);
  }
  if (origin.protocol !== 'https:' && origin.hostname !== 'localhost' && origin.hostname !== '127.0.0.1') {
    return errorResponse(`${prefix} origin must use HTTPS.`, 500);
  }

  const incoming = new URL(request.url);
  const upstream = new URL(origin);
  upstream.pathname = `${origin.pathname.replace(/\/+$/, '')}${incoming.pathname.slice(prefix.length) || '/'}`;
  upstream.search = incoming.search;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', incoming.host);
  headers.set('x-forwarded-proto', incoming.protocol.slice(0, -1));
  let response;
  try {
    response = await fetch(new Request(upstream, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    }));
  } catch (error) {
    console.error(`[worker] ${prefix} origin unreachable:`, error);
    return errorResponse(`${prefix} is temporarily unavailable.`, 502);
  }
  return rewriteAppResponse(response, prefix, origin);
}

// Floating link back to the main site, added to every demo page (Aurelia, SCOOP, Luxe Botanics).
const BACK_BUTTON_HTML = `<a id="cp-back-home" href="/#portfolio">&larr; Back to CherryPOP</a><style>
#cp-back-home{position:fixed;left:16px;bottom:16px;z-index:2147483647;padding:10px 16px;border-radius:999px;background:#b51f48;color:#fff;font:600 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.3)}
#cp-back-home:hover,#cp-back-home:focus-visible{background:#a51b40;outline:2px solid #fff;outline-offset:2px}
@media print{#cp-back-home{display:none}}
</style>`;

function addBackButton(html) {
  if (html.includes('id="cp-back-home"')) return html;
  const index = html.lastIndexOf('</body>');
  return index === -1 ? html : `${html.slice(0, index)}${BACK_BUTTON_HTML}${html.slice(index)}`;
}

// Apps are mounted under a path prefix, so root-relative URLs, redirects and cookies must be moved under it.
function rewriteAppBody(text, prefix) {
  const escaped = prefix.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let result = text
    .replace(new RegExp(`(href|action|src)=(['"])/(?!/|${escaped}(?:/|['"]))`, 'g'), `$1=$2${prefix}/`)
    .replace(new RegExp(`(location\\.href\\s*=\\s*)(['"])/(?!/|${escaped}/)`, 'g'), `$1$2${prefix}/`);
  if (prefix === '/aurelia') result = result.replace(/(['"])\/api(?=\/|['"])/g, '$1/aurelia/api');
  return result;
}

function rewriteAppLocation(location, prefix, origin) {
  if (location.startsWith('//')) return location;
  if (location.startsWith('/')) return location.startsWith(`${prefix}/`) ? location : `${prefix}${location}`;
  try {
    const target = new URL(location);
    if (target.origin === origin.origin) return `${prefix}${target.pathname}${target.search}${target.hash}`;
  } catch {
    // Relative or invalid locations are passed through unchanged.
  }
  return location;
}

async function rewriteAppResponse(response, prefix, origin) {
  const headers = new Headers(response.headers);
  const location = headers.get('location');
  if (location) headers.set('location', rewriteAppLocation(location, prefix, origin));

  const cookies = response.headers.getSetCookie?.() || [];
  if (cookies.length) {
    headers.delete('set-cookie');
    for (const cookie of cookies) {
      headers.append('set-cookie', cookie
        .replace(/;\s*Path=\/(?=;|$)/i, `; Path=${prefix}`)
        .replace(/;\s*Domain=[^;]*/i, ''));
    }
  }

  const contentType = headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  return new Response(addBackButton(rewriteAppBody(await response.text(), prefix)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Aurelia's static frontend ships with the Worker; only its /api calls need the VPS origin.
async function aureliaAssetRoute(request, env, url) {
  let pathname = decodeURIComponent(url.pathname).slice('/aurelia'.length);
  if (pathname === '') return redirect('/aurelia/');
  if (pathname.endsWith('/')) pathname += 'index.html';

  const assetUrl = new URL(request.url);
  assetUrl.pathname = `/aurelia${pathname}`;
  let response = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (response.status === 404 && !/\.[a-z0-9]+$/i.test(pathname)) {
    assetUrl.pathname = `/aurelia${pathname}/index.html`;
    response = await env.ASSETS.fetch(new Request(assetUrl, request));
  }
  if (response.status === 404) return new Response('Not found.', { status: 404 });

  const headers = new Headers(response.headers);
  const contentType = headers.get('content-type') || '';
  headers.set('cache-control', 'no-store');
  if (!/text\/html|javascript/.test(contentType)) {
    return new Response(response.body, { status: response.status, headers });
  }
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  let body = rewriteAppBody(await response.text(), '/aurelia');
  if (contentType.includes('text/html')) body = addBackButton(body);
  return new Response(body, { status: response.status, headers });
}

async function staticRoute(request, env, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/projects/scoop' || pathname === '/projects/scoopDEMO' || pathname === '/projects/sova-demo') {
    return redirect('/sova-demo');
  }
  if (pathname === '/projects/aurelia') return redirect('/aurelia/');

  if (pathname === '/') pathname = '/index.html';
  else if (pathname === '/login') pathname = '/login.html';
  else if (pathname === '/contact') pathname = '/contact.html';
  else if (pathname === '/faq') pathname = '/faq.html';
  else if (pathname === '/dashboard') pathname = '/dashboard.html';
  else if (pathname === '/reset-password') pathname = '/reset-password.html';
  else if (pathname === '/payment-success') pathname = '/payment-success.html';
  else if (pathname === '/payment-cancelled') pathname = '/payment-cancelled.html';

  const serviceMatch = pathname.match(/^\/services\/([a-z-]+)(?:\.html)?$/);
  if (serviceMatch && ['website', 'app', 'shop'].includes(serviceMatch[1])) {
    pathname = `/services/${serviceMatch[1]}.html`;
  }
  if (pathname === '/projects/luxe-botanics' || pathname === '/projects/luxe-botanics.html') {
    pathname = '/botanics/index.html';
  }
  if (pathname === '/botanics' || pathname === '/botanics/') pathname = '/botanics/index.html';

  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  const assetRequest = new Request(assetUrl, request);
  const assetResponse = await env.ASSETS.fetch(assetRequest);
  if (assetResponse.status !== 404) {
    const headers = new Headers(assetResponse.headers);
    const isHtml = (headers.get('content-type') || '').includes('text/html');
    if (isHtml) headers.set('cache-control', 'no-store');
    if (isHtml && (pathname.startsWith('/botanics/') || pathname.startsWith('/projects/'))) {
      headers.delete('content-length');
      headers.delete('content-encoding');
      headers.delete('etag');
      return new Response(addBackButton(await assetResponse.text()), { status: assetResponse.status, headers });
    }
    return new Response(assetResponse.body, { status: assetResponse.status, headers });
  }

  if (/\.[a-z0-9]+$/i.test(pathname)) return assetResponse;
  const fallback = new URL(request.url);
  fallback.pathname = '/index.html';
  return env.ASSETS.fetch(new Request(fallback, request));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/')) return await apiRoute(request, env, ctx, url);
      if (url.pathname === '/sova-demo' || url.pathname.startsWith('/sova-demo/')) {
        return await proxyApp(request, env, '/sova-demo', env.SOVA_ORIGIN);
      }
      if (url.pathname === '/aurelia/api' || url.pathname.startsWith('/aurelia/api/')) {
        if (!hasUsableOrigin(env.AURELIA_ORIGIN)) return await handleAureliaDemoApi(request, env, url);
        return await proxyApp(request, env, '/aurelia', env.AURELIA_ORIGIN);
      }
      if (url.pathname === '/aurelia' || url.pathname.startsWith('/aurelia/')) {
        return await aureliaAssetRoute(request, env, url);
      }
      return await staticRoute(request, env, url);
    } catch (error) {
      console.error('[worker] Request failed:', error);
      if (url.pathname.startsWith('/api/')) return errorResponse('Internal server error.', 500);
      return new Response('Internal server error.', { status: 500 });
    }
  },
};
