require('dotenv').config();
const nodemailer = require('nodemailer');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';
const SUPPORT_EMAIL = process.env.EMAIL_USER || 'support@aureliacontacts.com';

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  transporter.verify().then(() => {
    console.log('📧 Email transporter verified');
  }).catch(err => {
    console.warn('⚠️ Email transporter verification failed:', err && err.message ? err.message : err);
    transporter = null;
  });
} else {
  console.log('⚠️ Email credentials not provided. Emails will be skipped.');
}

const sendRawEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log(`⏭️ Skipping sending email to ${to} (no transporter)`);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: SUPPORT_EMAIL,
      to,
      subject,
      html
    });
    console.log('✅ Email sent:', info.messageId, 'to', to);
    return true;
  } catch (err) {
    console.warn('⚠️ Email send failed:', err && err.message ? err.message : err);
    return false;
  }
};

const buildWelcomeHtml = (firstName, verificationCode) => {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:2rem;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:2rem;">◉ Aurelia Contacts</h1>
      </div>
      <div style="background:#ffffff;padding:2rem;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="color:#6366f1;margin-top:0;">Welcome to Aurelia Contacts, ${firstName}!</h2>
        <p style="color:#4b5563;line-height:1.6;">Thanks for signing up! Your account at <strong>Aurelia Contacts</strong> is almost ready.</p>
        
        <div style="background:#f3f4f6;padding:1.5rem;border-radius:8px;margin:2rem 0;text-align:center;">
          <p style="color:#374151;margin:0 0 1rem 0;font-weight:600;">Your Verification Code:</p>
          <div style="background:#ffffff;padding:1rem;border-radius:8px;border:2px solid #6366f1;">
            <span style="font-size:2rem;font-weight:bold;color:#6366f1;letter-spacing:0.25rem;">${verificationCode}</span>
          </div>
          <p style="color:#6b7280;font-size:0.875rem;margin:1rem 0 0 0;">This code expires in 24 hours</p>
        </div>

        <p style="color:#4b5563;line-height:1.6;">Enter this code on the verification page to activate your account and start using Aurelia Contacts.</p>
        
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:2rem 0;" />
        <p style="color:#6b7280;font-size:0.875rem;line-height:1.6;">If you didn't create this account, please ignore this email or contact us.</p>
        <p style="color:#6b7280;font-size:0.875rem;margin-top:1rem;">Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#6366f1;text-decoration:none;">${SUPPORT_EMAIL}</a></p>
      </div>
    </div>
  `;
};

const buildResetHtml = (firstName, token) => {
  const resetLink = `${FRONTEND_URL}/html/reset-password.html?token=${token}`;
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:2rem;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:2rem;">◉ Aurelia Contacts</h1>
      </div>
      <div style="background:#ffffff;padding:2rem;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="color:#ef4444;margin-top:0;">Password Reset Request</h2>
        <p style="color:#4b5563;line-height:1.6;">Hi ${firstName || 'there'},</p>
        <p style="color:#4b5563;line-height:1.6;">We received a request to reset your Aurelia Contacts password. Click the button below to reset it. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:2rem 0;">
          <a href="${resetLink}" style="background:#6366f1;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;box-shadow:0 4px 6px rgba(99,102,241,0.3);">Reset Password</a>
        </div>
        <p style="color:#6b7280;font-size:0.9rem;line-height:1.6;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="color:#6366f1;font-size:0.85rem;word-break:break-all;background:#f3f4f6;padding:0.75rem;border-radius:6px;">${resetLink}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:2rem 0;" />
        <p style="color:#6b7280;font-size:0.875rem;line-height:1.6;">If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
        <p style="color:#6b7280;font-size:0.875rem;margin-top:1.5rem;">Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#6366f1;text-decoration:none;">${SUPPORT_EMAIL}</a></p>
      </div>
    </div>
  `;
};

const sendWelcomeEmail = async (to, firstName, verificationCode) => {
  const subject = verificationCode 
    ? 'Verify Your Aurelia Contacts Account' 
    : 'Welcome to Aurelia Contacts!';
  const html = buildWelcomeHtml(firstName || '', verificationCode);
  return sendRawEmail(to, subject, html);
};

const sendResetEmail = async (to, firstName, token) => {
  const subject = 'Aurelia Contacts - Password reset';
  const html = buildResetHtml(firstName || '', token);
  return sendRawEmail(to, subject, html);
};

const buildLoginCodeHtml = (firstName, loginCode) => {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:2rem;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:2rem;">◉ Aurelia Contacts</h1>
      </div>
      <div style="background:#ffffff;padding:2rem;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="color:#6366f1;margin-top:0;">Login Code for Aurelia Contacts</h2>
        <p style="color:#4b5563;line-height:1.6;">Hi ${firstName},</p>
        <p style="color:#4b5563;line-height:1.6;">You requested a login code for your Aurelia Contacts account. Use this code to sign in:</p>
        
        <div style="background:#f3f4f6;padding:1.5rem;border-radius:8px;margin:2rem 0;text-align:center;">
          <p style="color:#374151;margin:0 0 1rem 0;font-weight:600;">Your Login Code:</p>
          <div style="background:#ffffff;padding:1rem;border-radius:8px;border:2px solid #6366f1;">
            <span style="font-size:2rem;font-weight:bold;color:#6366f1;letter-spacing:0.25rem;">${loginCode}</span>
          </div>
          <p style="color:#6b7280;font-size:0.875rem;margin:1rem 0 0 0;">This code expires in 10 minutes</p>
        </div>

        <p style="color:#4b5563;line-height:1.6;">Enter this code in the Aurelia Contacts app to complete your login.</p>
        
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:2rem 0;" />
        <p style="color:#6b7280;font-size:0.875rem;line-height:1.6;">If you didn't request this login code, you can safely ignore this email. Your account remains secure.</p>
        <p style="color:#6b7280;font-size:0.875rem;margin-top:1rem;">Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#6366f1;text-decoration:none;">${SUPPORT_EMAIL}</a></p>
      </div>
    </div>
  `;
};

const sendLoginCodeEmail = async (to, firstName, loginCode) => {
  const subject = 'Your Aurelia Contacts Login Code';
  const html = buildLoginCodeHtml(firstName || '', loginCode);
  return sendRawEmail(to, subject, html);
};

module.exports = { sendRawEmail, sendWelcomeEmail, sendResetEmail, sendLoginCodeEmail, SUPPORT_EMAIL };
