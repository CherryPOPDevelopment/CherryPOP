require('dotenv').config();
const { Resend } = require('resend');

const NOTIFY_ADDRESSES = [
  'support@cherrypopdevelopment.com',
  'cherryDEVdirect@gmail.com',
];

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Send a new-order / inquiry notification to both business inboxes.
 * @param {object} order - { name, email, service_type, budget, message, id }
 */
async function sendOrderNotification(order) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping email notification.');
    return;
  }

  const subject = `[cherry.dev] New order request — ${order.service_type} (ID #${order.id})`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">New Order Request</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">cherry.dev — Order #${order.id}</p>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#999;width:140px;">Package / Tier</td>
            <td style="padding:8px 0;font-weight:600;color:#fff;">${escapeHtml(order.budget || '—')}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#999;">Service</td>
            <td style="padding:8px 0;font-weight:600;color:#fff;">${escapeHtml(order.service_type)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#999;">Client Name</td>
            <td style="padding:8px 0;color:#fff;">${escapeHtml(order.name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#999;">Client Email</td>
            <td style="padding:8px 0;"><a href="mailto:${escapeHtml(order.email)}" style="color:#e74c3c;">${escapeHtml(order.email)}</a></td>
          </tr>
        </table>

        <div style="margin-top:20px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <p style="margin:0 0 8px;color:#999;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Project Details</p>
          <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.7;color:#e8e8e8;">${escapeHtml(order.message)}</p>
        </div>

        <div style="margin-top:24px;">
          <a href="mailto:${escapeHtml(order.email)}?subject=Re: Your cherry.dev order request"
             style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
            Reply to ${escapeHtml(order.name)}
          </a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">
        Sent by cherry.dev order system · ${new Date().toUTCString()}
      </div>
    </div>
  `;

  const text = [
    `New Order Request — cherry.dev (ID #${order.id})`,
    ``,
    `Package : ${order.budget || '—'}`,
    `Service : ${order.service_type}`,
    `Name    : ${order.name}`,
    `Email   : ${order.email}`,
    ``,
    `Project Details:`,
    order.message,
  ].join('\n');

  const { error } = await resend.emails.send({
    from: FROM_SUPPORT,
    to: NOTIFY_ADDRESSES,
    subject,
    text,
    html,
  });

  if (error) throw new Error(error.message);
}

const FROM_ADDRESS = 'cherry.dev <noreply@cherrypopdevelopment.com>';
const FROM_SUPPORT = 'cherry.dev <support@cherrypopdevelopment.com>';

// ── Shared email wrapper ──────────────────────────────────────────────────────
async function send(payload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping email.');
    return;
  }
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, ...payload });
  if (error) throw new Error(error.message);
}

// ── Welcome email (sent to new user on registration) ─────────────────────────
async function sendWelcomeEmail({ username, email }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Welcome to cherry.dev</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:16px;">Hi <strong>${escapeHtml(username)}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ccc;">Your account has been created. You can now log in to track your projects and communicate with us.</p>
        <a href="https://cherrypopdevelopment.com/login" style="display:inline-block;margin-top:16px;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Go to Login</a>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  await send({
    to: [email],
    subject: 'Welcome to cherry.dev!',
    html,
    text: `Hi ${username}, your cherry.dev account has been created. Log in at https://cherrypopdevelopment.com/login`,
  });
}

// ── Order confirmation (sent to customer on inquiry submit) ───────────────────
async function sendOrderConfirmation(order) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Order Request Received</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Reference #${order.id}</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(order.name)}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ccc;">Thanks for reaching out! I've received your request and will get back to you within <strong style="color:#fff;">24 hours</strong> to discuss scope and next steps.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:20px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <tr><td style="padding:8px 0;color:#999;width:140px;">Package</td><td style="padding:8px 0;color:#fff;font-weight:600;">${escapeHtml(order.budget || '—')}</td></tr>
          <tr><td style="padding:8px 0;color:#999;">Service</td><td style="padding:8px 0;color:#fff;">${escapeHtml(order.service_type)}</td></tr>
        </table>
        <div style="margin-top:20px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <p style="margin:0 0 8px;color:#999;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Your project details</p>
          <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.7;color:#ccc;">${escapeHtml(order.message)}</p>
        </div>
        <p style="margin-top:20px;font-size:13px;color:#888;">Questions? Reply to this email or contact <a href="mailto:support@cherrypopdevelopment.com" style="color:#e74c3c;">support@cherrypopdevelopment.com</a></p>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  await send({
    to: [order.email],
    subject: `[cherry.dev] Order request received — Ref #${order.id}`,
    html,
    text: `Hi ${order.name}, your order request has been received (Ref #${order.id}). I'll be in touch within 24 hours. — cherry.dev`,
  });
}

// ── Password reset email ──────────────────────────────────────────────────────
async function sendPasswordResetEmail({ email, username }, resetUrl) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Reset Your Password</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(username)}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ccc;">We received a password reset request for your account. Click the button below to set a new password. This link expires in <strong style="color:#fff;">1 hour</strong>.</p>
        <a href="${escapeHtml(resetUrl)}" style="display:inline-block;margin-top:16px;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Reset Password</a>
        <p style="margin-top:20px;font-size:13px;color:#888;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
        <p style="margin-top:8px;font-size:12px;color:#555;word-break:break-all;">Or copy this link: ${escapeHtml(resetUrl)}</p>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  await send({
    to: [email],
    subject: '[cherry.dev] Password reset request',
    html,
    text: `Hi ${username}, reset your password here: ${resetUrl} — This link expires in 1 hour.`,
  });
}

// ── Forgot username email ─────────────────────────────────────────────────────
async function sendUsernameReminderEmail({ email, username }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Your Username</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:14px;line-height:1.7;color:#ccc;">You requested a reminder of the username associated with this email address.</p>
        <div style="margin:20px 0;padding:16px 20px;background:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;">
          <p style="margin:0;font-size:13px;color:#999;">Your username</p>
          <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#fff;letter-spacing:.02em;">${escapeHtml(username)}</p>
        </div>
        <a href="https://cherrypopdevelopment.com/login" style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Go to Login</a>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  await send({
    to: [email],
    subject: '[cherry.dev] Your username reminder',
    html,
    text: `Your cherry.dev username is: ${username}`,
  });
}

// ── Contact / question confirmation (sent to the person who submitted) ────────
async function sendContactConfirmation({ name, email, message }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#922b21);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Message Received</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ccc;">Thanks for getting in touch! I've received your message and will respond within <strong style="color:#fff;">24 hours</strong>.</p>
        <div style="margin-top:20px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <p style="margin:0 0 8px;color:#999;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Your message</p>
          <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.7;color:#ccc;">${escapeHtml(message)}</p>
        </div>
        <p style="margin-top:20px;font-size:13px;color:#888;">Direct contact: <a href="mailto:support@cherrypopdevelopment.com" style="color:#e74c3c;">support@cherrypopdevelopment.com</a></p>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  await send({
    to: [email],
    subject: '[cherry.dev] We received your message',
    html,
    text: `Hi ${name}, your message has been received. I'll reply within 24 hours. — cherry.dev`,
  });
}

// ── Payment confirmation (sent to customer after successful Stripe payment) ───
async function sendPaymentConfirmationEmail(order) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#27ae60,#1e8449);padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">✓ Payment Received</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">cherry.dev · Order #${order.id}</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;">Hi <strong>${escapeHtml(order.name)}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ccc;">Your payment has been received and your project is now <strong style="color:#2ecc71;">in review</strong>. I'll be in touch within <strong style="color:#fff;">24 hours</strong> to kick things off.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:20px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <tr><td style="padding:8px 0;color:#999;width:160px;">Order Reference</td><td style="padding:8px 0;color:#fff;font-weight:600;">#${order.id}</td></tr>
          <tr><td style="padding:8px 0;color:#999;">Package</td><td style="padding:8px 0;color:#fff;">${escapeHtml(order.budget || '—')}</td></tr>
          <tr><td style="padding:8px 0;color:#999;">Service</td><td style="padding:8px 0;color:#fff;">${escapeHtml(order.service_type)}</td></tr>
          <tr><td style="padding:8px 0;color:#999;">Amount Paid</td><td style="padding:8px 0;color:#2ecc71;font-weight:700;font-size:16px;">$${escapeHtml(String(order.amount))}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#888;">Questions? Contact <a href="mailto:support@cherrypopdevelopment.com" style="color:#e74c3c;">support@cherrypopdevelopment.com</a></p>
      </div>
      <div style="padding:16px 32px;background:#080808;font-size:12px;color:#555;">cherry.dev · ${new Date().toUTCString()}</div>
    </div>`;
  // Also notify admin
  const adminHtml = html.replace('✓ Payment Received', '💳 Payment Received from ' + escapeHtml(order.name));
  await Promise.all([
    send({
      to: [order.email],
      subject: `[cherry.dev] Payment confirmed — Order #${order.id}`,
      html,
      text: `Hi ${order.name}, your payment of $${order.amount} for Order #${order.id} has been received. I'll be in touch within 24 hours. — cherry.dev`,
    }),
    send({
      from: FROM_SUPPORT,
      to: NOTIFY_ADDRESSES,
      subject: `[cherry.dev] Payment received — Order #${order.id} ($${order.amount})`,
      html: adminHtml,
      text: `Payment received for Order #${order.id} from ${order.name} (${order.email}). Amount: $${order.amount}.`,
    }),
  ]);
}

module.exports = {
  sendOrderNotification,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
  sendUsernameReminderEmail,
  sendContactConfirmation,
  sendPaymentConfirmationEmail,
};
