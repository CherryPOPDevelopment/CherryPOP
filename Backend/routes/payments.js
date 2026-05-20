const express = require('express');
const db      = require('../db');
const router  = express.Router();

const SITE_URL = () => process.env.SITE_URL || 'http://localhost:3000';

// Lazily initialise Stripe — returns null if key not configured yet
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// ── Package price map — amounts in cents (full project price) ─────────────────
// To charge a 50% deposit instead, wrap each `amount` with: Math.round(amount / 2)
const PACKAGES = {
  'Website — Starter':      { amount:  49900, label: 'Website Development — Starter' },
  'Website — Professional': { amount: 129900, label: 'Website Development — Professional' },
  'Website — Enterprise':   { amount: 299900, label: 'Website Development — Enterprise' },
  'App — MVP':              { amount: 199900, label: 'App Development — MVP' },
  'App — Growth':           { amount: 399900, label: 'App Development — Growth' },
  'App — Scale':            { amount: 799900, label: 'App Development — Scale' },
  'Shop — Starter':         { amount:  59900, label: 'Shop Development — Starter' },
  'Shop — Pro':             { amount: 179900, label: 'Shop Development — Pro' },
  'Shop — Enterprise':      { amount: 399900, label: 'Shop Development — Enterprise' },
};

// POST /api/payments/checkout  — creates a Stripe Checkout session
router.post('/checkout', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: 'Payment processing is not configured yet.' });
  }

  const { inquiry_id, tier } = req.body;
  if (!inquiry_id || !tier) {
    return res.status(400).json({ error: 'inquiry_id and tier are required.' });
  }

  const pkg = PACKAGES[tier];
  if (!pkg) {
    return res.status(400).json({ error: 'Unknown package tier.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, name, email FROM inquiries WHERE id = ? LIMIT 1',
      [inquiry_id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    const inquiry = rows[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: inquiry.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: pkg.label,
            description: `cherry.dev · Order #${inquiry_id}`,
          },
          unit_amount: pkg.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      billing_address_collection: 'auto',
      success_url: `${SITE_URL()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL()}/payment-cancelled?inquiry_id=${inquiry_id}`,
      metadata: { inquiry_id: String(inquiry_id) },
    });

    await db.execute(
      'UPDATE inquiries SET stripe_session_id = ?, payment_status = ? WHERE id = ?',
      [session.id, 'pending', inquiry_id]
    );

    return res.json({ url: session.url });
  } catch (err) {
    console.error('[payments] Checkout error:', err);
    return res.status(500).json({ error: 'Failed to create payment session.' });
  }
});

// POST /api/payments/webhook  — raw body is set in server.js BEFORE express.json()
router.post('/webhook', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).send('Not configured.');

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send('STRIPE_WEBHOOK_SECRET not set.');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[payments] Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session    = event.data.object;
    const inquiryId  = session.metadata?.inquiry_id;
    const amountPaid = ((session.amount_total || 0) / 100).toFixed(2);

    if (inquiryId) {
      try {
        await db.execute(
          'UPDATE inquiries SET payment_status = ?, status = ? WHERE id = ?',
          ['paid', 'in_review', inquiryId]
        );

        const [rows] = await db.execute(
          'SELECT name, email, service_type, budget FROM inquiries WHERE id = ? LIMIT 1',
          [inquiryId]
        );

        if (rows.length) {
          const { sendPaymentConfirmationEmail } = require('../mailer');
          sendPaymentConfirmationEmail({
            id:           inquiryId,
            name:         rows[0].name,
            email:        rows[0].email,
            service_type: rows[0].service_type,
            budget:       rows[0].budget,
            amount:       amountPaid,
          }).catch(err => console.error('[mailer] Payment confirmation failed:', err));
        }
      } catch (err) {
        console.error('[payments] DB update error:', err);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
