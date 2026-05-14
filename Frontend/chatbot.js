/* ── Cherry.dev Chatbot Widget ─────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Knowledge base ──────────────────────────────────────────────────── */
  const KB = [
    {
      patterns: ['hello', 'hi', 'hey', 'howdy', 'sup', 'hiya'],
      reply: "Hey there! 👋 I'm Cherry's assistant. How can I help you today?",
      quick: ['Services & Pricing', 'Project Timeline', 'Start a Quote', 'Tech Stack'],
    },
    {
      patterns: ['guarantee', 'warranty', 'broken after', 'post launch', 'bug after launch', 'fix after'],
      reply: "Every project comes with a <b>30-day post-launch warranty</b> — if anything breaks due to my code after go-live, I'll fix it at no charge.\n\nFor ongoing peace of mind, monthly maintenance packages are available from $79/month.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['service', 'what do you do', 'what do you build', 'what do you make', 'what can you build'],
      reply: "I offer three core services:\n\n🌐 <b>Websites</b> — Landing pages, portals, CMS-powered sites\n📱 <b>Apps</b> — iOS & Android via React Native, PWAs\n🛒 <b>Shops</b> — Shopify, WooCommerce, custom storefronts\n\nWant details on any of these?",
      quick: ['Website pricing', 'App pricing', 'Shop pricing', 'Start a Quote'],
    },
    {
      patterns: ['website price', 'website cost', 'website pricing', 'web price'],
      reply: "Website packages start at <b>$499</b> for the Starter tier, <b>$1,299</b> for Professional, and <b>$2,999+</b> for Enterprise.\n\nEvery package has a clear feature list — or click <b>Buy This Package</b> on any tier to send a request!",
      quick: ['App pricing', 'Shop pricing', 'How to Order', 'Start a Quote'],
    },
    {
      patterns: ['app price', 'app cost', 'app pricing', 'mobile price'],
      reply: "App packages start at <b>$1,999</b> (MVP), <b>$3,999</b> (Growth — iOS & Android), and <b>$7,999+</b> (Scale).\n\nFill in the order form on the App page or open a quote for something bespoke.",
      quick: ['Website pricing', 'Shop pricing', 'How to Order', 'Start a Quote'],
    },
    {
      patterns: ['shop price', 'shop cost', 'ecommerce price', 'shopify price', 'store price'],
      reply: "E-commerce packages start at <b>$599</b> (Starter), <b>$1,799</b> (Pro), and <b>$3,999+</b> (Enterprise).\n\nClick <b>Buy This Package</b> on the Shop page to send an order request!",
      quick: ['Website pricing', 'App pricing', 'How to Order', 'Start a Quote'],
    },
    {
      patterns: ['price', 'cost', 'how much', 'rate', 'charge', 'pricing', 'budget'],
      reply: "Pricing depends on the service:\n\n🌐 Websites: from $499\n📱 Apps: from $1,999\n🛒 Shops: from $599\n\nEach service page has full tier breakdowns — or jump straight to a quote!",
      quick: ['How to Order', 'Start a Quote', 'Timeline info'],
    },
    {
      patterns: ['timeline', 'how long', 'turnaround', 'deadline', 'delivery', 'when'],
      reply: "Typical timelines:\n\n🌐 Websites: <b>1–3 weeks</b>\n📱 Apps: <b>4–10 weeks</b>\n🛒 Shops: <b>2–4 weeks</b>\n\nRush delivery is available — mention it in your quote!",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['tech', 'stack', 'language', 'framework', 'react', 'node', 'shopify'],
      reply: "Here's what I work with:\n\n⚛️ React / Next.js / React Native\n🟢 Node.js + Express\n🗄️ MySQL / PostgreSQL\n🛍️ Shopify / WooCommerce\n☁️ AWS, VPS, Cloudflare\n🐍 Python for automation\n\nHave a specific tech in mind? Just ask!",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['contact', 'email', 'reach', 'talk', 'chat', 'speak'],
      reply: "The best way to get in touch is through the quote form — it gives me all the info I need to help you fast.\n\nI respond within <b>24 hours</b> ⚡",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['quote', 'start', 'project', 'hire', 'work with', 'get started', 'begin'],
      reply: "Let's do it! 🚀 Click below to open the project inquiry form — it takes about 2 minutes.",
      quick: ['Open Quote Form'],
      action: 'openContact',
    },
    {
      patterns: ['available', 'free', 'open', 'accepting', 'take on'],
      reply: "Yes! I'm currently <b>accepting new projects</b>. 📅 The sooner you reach out, the sooner we can get started.",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['support', 'maintenance', 'after', 'launch'],
      reply: "Absolutely — I offer ongoing support and maintenance packages after launch, including bug fixes, content updates, and feature additions. We can discuss this during the project.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['how to buy', 'how to order', 'purchase', 'buy', 'order', 'place an order', 'buying'],
      reply: "Ordering is simple! 🛒\n\n1. Go to the service page (<b>Website</b>, <b>App</b>, or <b>Shop</b>)\n2. Pick a tier and click <b>Buy This Package</b>\n3. Fill in your name, email, and project details\n4. Hit <b>Send Order Request</b>\n\nI'll review your brief and reply within <b>24 hours</b> to confirm scope. No payment is taken until we've agreed on everything!",
      quick: ['Website pricing', 'App pricing', 'Shop pricing', 'Custom Service'],
    },
    {
      patterns: ['custom', 'bespoke', 'custom service', 'custom project', 'something different', 'not listed', 'special'],
      reply: "For anything outside the standard tiers — unique features, complex integrations, unusual scope — I'm happy to put together a <b>bespoke quote</b>.\n\nJust head to the Contact page or click below to open the inquiry form. No obligation, no pressure. 😊",
      quick: ['Open Quote Form'],
      action: 'openContact',
    },
    {
      patterns: ['payment', 'pay', 'deposit', 'invoice', 'upfront', 'installment', 'split'],
      reply: "Projects are split into two payments:\n\n💳 <b>50% upfront</b> to begin work\n✅ <b>50% on completion</b> before final handover\n\nNo payment is taken until we've agreed on scope and you're happy to proceed. I accept bank transfer and major cards.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['revision', 'change', 'edit', 'amend', 'update', 'feedback', 'tweak'],
      reply: "Revisions are included in every tier:\n\n✏️ Starter — <b>2 rounds</b>\n✏️✏️ Professional — <b>3 rounds</b>\n♾️ Enterprise — <b>unlimited</b>\n\nA revision round covers a batch of changes reviewed together. I always show you a staging preview before anything goes live.",
      quick: ['Services & Pricing', 'Start a Quote'],
    },
    {
      patterns: ['own', 'ownership', 'copyright', 'rights', 'code mine', 'who owns', 'intellectual property', 'ip'],
      reply: "You own <b>100% of everything</b> once the project is complete and final payment is made — all code, designs, and assets are fully yours. I retain no rights to your project.",
      quick: ['Start a Quote', 'How to Order'],
    },
    {
      patterns: ['nda', 'confidential', 'confidentiality', 'non-disclosure', 'private', 'secret'],
      reply: "Absolutely — I'm happy to sign a <b>mutual NDA</b> before any sensitive details are shared. Just mention it when you reach out and I'll send one over straight away.",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['hosting', 'host', 'server', 'deploy', 'deployment', 'domain', 'live'],
      reply: "Hosting is not included in the project price, but I'll recommend and help set up the best option for your needs:\n\n☁️ <b>Cloudflare Pages / Vercel</b> — free or near-free for most sites\n🖥️ <b>VPS (DigitalOcean / AWS)</b> — $5–$20/month for apps and backends\n\nI handle the full deployment so you don't need to worry about the technical side.",
      quick: ['Website pricing', 'App pricing', 'Start a Quote'],
    },
    {
      patterns: ['seo', 'search engine', 'google ranking', 'rank', 'optimise', 'optimize'],
      reply: "SEO is included on all tiers:\n\n🔍 All tiers: meta tags, headings, sitemap, Open Graph\n📈 Professional & Enterprise: keyword research + performance optimisation\n\nFor ongoing SEO campaigns, I can recommend a specialist or quote for a content strategy add-on.",
      quick: ['Website pricing', 'Start a Quote'],
    },
    {
      patterns: ['refund', 'money back', 'cancel', 'cancellation'],
      reply: "If you need to cancel before work begins, your deposit is fully refundable. Once work has started, the deposit covers work completed to that point.\n\nI always confirm scope before any payment, so we're both aligned from day one.",
      quick: ['Start a Quote', 'How to Order'],
    },
    {
      patterns: ['mobile', 'responsive', 'phone', 'tablet', 'mobile friendly'],
      reply: "Every project I deliver is <b>fully responsive</b> — tested across mobile, tablet, and desktop. Mobile-first design is standard on all tiers, not an add-on.",
      quick: ['Services & Pricing', 'Start a Quote'],
    },
    {
      patterns: ['test', 'testing', 'qa', 'quality', 'bug', 'broken'],
      reply: "All projects go through thorough testing before launch:\n\n🧪 Cross-browser / cross-device testing\n📱 Real-device testing for apps\n🐛 Bug fixes during testing are included in scope\n\nYou'll review a staging version before anything goes live.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['rush', 'urgent', 'fast', 'quick', 'asap', 'express'],
      reply: "Rush delivery is available! ⚡ If you have a tight deadline, mention it in your quote and I'll let you know if it's achievable. Rush projects may carry a small premium depending on the scope.",
      quick: ['Start a Quote'],
    },

    // ── Process & communication ──────────────────────────────────────────
    {
      patterns: ['process', 'how does it work', 'steps', 'workflow', 'what happens', 'procedure'],
      reply: "Here's how a typical project runs:\n\n1️⃣ <b>Discovery</b> — You share your goals, I ask questions\n2️⃣ <b>Proposal</b> — I send a scope, timeline & price\n3️⃣ <b>Kickoff</b> — 50% deposit & work begins\n4️⃣ <b>Build & review</b> — Staged previews, revision rounds\n5️⃣ <b>Launch</b> — Final payment, deployment & handover\n\nSimple, transparent, no surprises. 😊",
      quick: ['Start a Quote', 'Services & Pricing', 'Project Timeline'],
    },
    {
      patterns: ['update', 'progress', 'communication', 'report', 'keep me informed', 'status'],
      reply: "You'll never be left in the dark! I provide regular progress updates throughout the project:\n\n📬 Updates at each major milestone\n🔗 Staging link for you to review live at any time\n💬 Direct messaging (email or your preferred channel)\n\nMost clients hear from me every 2–3 days during active development.",
      quick: ['Start a Quote', 'How does it work'],
    },
    {
      patterns: ['meeting', 'call', 'video', 'zoom', 'teams', 'google meet', 'discovery call'],
      reply: "Absolutely — I'm happy to jump on a discovery call before anything is agreed. It's a great way to talk through your idea in detail and make sure we're a good fit.\n\nJust mention it when you fill in the contact form and we'll get something booked. 📞",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['timezone', 'location', 'country', 'where are you', 'based', 'uk', 'working hours', 'hours'],
      reply: "I'm based in the <b>UK</b> and typically work GMT/BST hours, but I work with clients worldwide.\n\nAsync communication means we can collaborate easily across time zones — I respond to all messages within <b>24 hours</b>. 🌍",
      quick: ['Start a Quote', 'Contact info'],
    },

    // ── Design & content ─────────────────────────────────────────────────
    {
      patterns: ['design', 'ui', 'ux', 'figma', 'mockup', 'wireframe', 'prototype', 'visual'],
      reply: "Yes — UI/UX design is part of the service! I work in <b>Figma</b> and can either:\n\n🎨 Design from scratch based on your brand\n📐 Build from an existing Figma file you provide\n\nAll designs are reviewed before development starts so you know exactly what you're getting.",
      quick: ['Services & Pricing', 'Start a Quote'],
    },
    {
      patterns: ['content', 'copy', 'text', 'writing', 'copywriting', 'words', 'blog'],
      reply: "Copywriting isn't included by default, but I can help!\n\n✍️ For small sites, I can write or refine copy as an add-on\n📄 Alternatively, you supply the text and I lay it out perfectly\n\nJust mention it in your quote and we'll sort something out.",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['logo', 'brand', 'branding', 'identity', 'colour', 'color', 'palette', 'font'],
      reply: "I'm primarily a developer, but I can apply your existing branding throughout the build.\n\nFor a full branding package (logo, colour palette, typography), I can recommend a trusted designer or include it as a scoped add-on. Just ask! 🎨",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['image', 'photo', 'photography', 'stock', 'assets', 'icons', 'illustration'],
      reply: "Stock images and icons can be sourced and included as part of the project — I have access to premium stock libraries.\n\nIf you have your own photography or brand assets, even better — just send them over when we kick off. 📸",
      quick: ['Start a Quote'],
    },

    // ── Technical specifics ──────────────────────────────────────────────
    {
      patterns: ['cms', 'content management', 'wordpress', 'sanity', 'strapi', 'edit content', 'update myself'],
      reply: "CMS integration is included on Professional and Enterprise tiers:\n\n📝 <b>WordPress</b> — great for content-heavy sites\n⚡ <b>Sanity / Strapi</b> — modern headless CMS for custom builds\n\nYou'll be able to update text, images, and pages yourself — no dev needed for day-to-day edits.",
      quick: ['Website pricing', 'Start a Quote'],
    },
    {
      patterns: ['api', 'integration', 'third party', 'connect', 'crm', 'zapier', 'webhook', 'stripe', 'paypal'],
      reply: "Third-party integrations are a staple of modern builds. I regularly integrate:\n\n💳 Payment gateways (Stripe, PayPal)\n📧 Email marketing (Mailchimp, Klaviyo)\n📊 CRMs (HubSpot, Salesforce basics)\n🔗 Zapier / webhooks for automation\n\nIf you have a specific tool in mind, just mention it in your quote.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['database', 'data', 'storage', 'mysql', 'postgres', 'mongodb', 'sql'],
      reply: "I work with relational and document databases depending on the project:\n\n🗄️ <b>MySQL / PostgreSQL</b> — standard for most web apps\n📦 <b>MongoDB</b> — for flexible document storage\n☁️ Managed cloud DB (PlanetScale, Supabase, Railway)\n\nThe right choice depends on your data model — I'll recommend the best fit.",
      quick: ['Tech Stack', 'Start a Quote'],
    },
    {
      patterns: ['accessibility', 'wcag', 'ada', 'screen reader', 'a11y', 'accessible'],
      reply: "Accessibility matters! All my builds follow <b>WCAG 2.1 AA</b> guidelines as standard:\n\n✅ Semantic HTML & ARIA labels\n✅ Keyboard navigability\n✅ Colour contrast compliance\n✅ Screen reader compatibility\n\nNeed a full accessibility audit? I can quote for that too.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['analytics', 'tracking', 'google analytics', 'stats', 'visitors', 'traffic'],
      reply: "Analytics setup is included on Professional and Enterprise tiers:\n\n📊 <b>Google Analytics 4</b> or <b>Plausible</b> (privacy-first)\n🎯 Goal tracking & conversion events\n🔍 Google Search Console integration\n\nYou'll have clear visibility of your site's performance from day one.",
      quick: ['Website pricing', 'Start a Quote'],
    },
    {
      patterns: ['performance', 'speed', 'fast', 'lighthouse', 'core web vitals', 'pagespeed', 'load time'],
      reply: "Performance is a core priority, not an afterthought:\n\n⚡ Target <b>90+ Lighthouse score</b> on all builds\n🖼️ Optimised images & lazy loading\n📦 Code splitting & minification\n🌐 CDN deployment for global speed\n\nFast sites rank better and convert better — it's always worth investing in.",
      quick: ['Services & Pricing', 'Start a Quote'],
    },
    {
      patterns: ['security', 'secure', 'ssl', 'https', 'hacked', 'vulnerability', 'protect'],
      reply: "Security is built in from the start:\n\n🔒 HTTPS / SSL on all deployments\n🛡️ Input validation & sanitisation\n🔑 Secure session management\n🚫 OWASP Top 10 protections\n\nFor e-commerce, PCI compliance is handled via trusted payment gateways (Stripe, PayPal) — card data never touches your server.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['source code', 'github', 'git', 'repository', 'repo', 'code access', 'version control'],
      reply: "Full source code is handed over on project completion — everything on a private <b>GitHub repo</b> transferred to your account.\n\nI use Git throughout development so you have a full commit history. No lock-in, ever.",
      quick: ['Ownership & Rights', 'Start a Quote'],
    },
    {
      patterns: ['multilingual', 'multi language', 'translation', 'language', 'i18n', 'internationalisation', 'localization'],
      reply: "Multi-language support is available as an add-on:\n\n🌐 Internationalisation (i18n) built into the codebase\n🗣️ You supply translated content, I wire it up\n🔀 Language switcher included\n\nMention it in your quote and I'll scope it in.",
      quick: ['Start a Quote'],
    },

    // ── Portfolio & credibility ──────────────────────────────────────────
    {
      patterns: ['portfolio', 'examples', 'past work', 'previous', 'case study', 'showcase', 'work'],
      reply: "You can see featured projects on the homepage — <b>Bloom Studio</b> (website), <b>FitTrack Pro</b> (app), and <b>Luxe Botanics</b> (shop).\n\nI'm happy to share more detailed case studies relevant to your project — just ask when you reach out! 💼",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['review', 'testimonial', 'feedback', 'rating', 'recommend', 'trust', 'reputation'],
      reply: "I have a strong track record across 40+ projects with a 98% client satisfaction rate. I'm happy to provide references or point you to testimonials relevant to your industry on request. 🌟",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['freelance', 'agency', 'team', 'employees', 'company', 'solo', 'contractor'],
      reply: "I'm an independent freelancer — you work <b>directly with me</b>, not through layers of project managers.\n\nThis means faster decisions, direct communication, and no agency markup. For very large projects I can bring in trusted collaborators, but you'll always know who's doing what.",
      quick: ['Start a Quote', 'How does it work'],
    },

    // ── E-commerce specifics ─────────────────────────────────────────────
    {
      patterns: ['subscription', 'recurring', 'membership', 'subscription box'],
      reply: "Subscription and membership functionality is fully supported:\n\n🔄 Recurring billing via Stripe or Shopify Subscriptions\n🔐 Gated member content\n📦 Subscription box product management\n\nAvailable from the Pro tier on shop builds.",
      quick: ['Shop pricing', 'Start a Quote'],
    },
    {
      patterns: ['inventory', 'stock', 'product', 'catalogue', 'catalog', 'variants', 'sku'],
      reply: "Full inventory management is included in all shop tiers:\n\n📦 Product variants (size, colour, etc.)\n📊 Stock level tracking & low-stock alerts\n🏷️ Bulk import via CSV\n🔗 Integration with fulfilment partners\n\nWhether you have 10 products or 10,000, I'll set it up to scale.",
      quick: ['Shop pricing', 'Start a Quote'],
    },

    // ── Misc & small talk ────────────────────────────────────────────────
    {
      patterns: ['thank', 'thanks', 'cheers', 'appreciated', 'helpful'],
      reply: "You're very welcome! 😊 Is there anything else I can help with?",
      quick: ['Services & Pricing', 'Start a Quote'],
    },
    {
      patterns: ['bye', 'goodbye', 'see you', 'later', 'cya'],
      reply: "Take care! Feel free to come back any time. 👋 Looking forward to potentially working together!",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['who are you', 'what are you', 'are you a bot', 'are you human', 'are you ai', 'robot'],
      reply: "I'm Cherry's virtual assistant — an automated bot here to answer your questions about services, pricing, and process.\n\nFor anything complex or personal, the best route is always the <b>contact form</b> — Cherry replies within 24 hours. 🍒",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      patterns: ['discount', 'deal', 'offer', 'promo', 'coupon', 'cheaper', 'negotiate'],
      reply: "I don't run fixed promotions, but I'm always open to a conversation — especially for long-term retainers, bundled projects, or non-profit work.\n\nJust mention your budget in the quote form and I'll see what I can put together. No harm in asking! 😊",
      quick: ['Start a Quote'],
    },
    {
      patterns: ['contract', 'agreement', 'terms', 'legal', 'signed', 'scope of work'],
      reply: "Every project starts with a clear written agreement covering:\n\n📄 Scope of work\n📅 Timeline & milestones\n💳 Payment schedule\n🔄 Revision rounds\n\nNo work begins until both parties have signed off — protecting us both.",
      quick: ['Start a Quote', 'How does it work'],
    },
  ];

  // Tracks consecutive fallbacks to escalate helpfully
  let _fallbackCount = 0;

  const FALLBACK_REPLIES = [
    {
      reply: "Hmm, I'm not quite sure about that one! 🤔 Try asking about services, pricing, timelines, or the tech I use — or pick one of the options below.",
      quick: ['Services & Pricing', 'Project Timeline', 'Tech Stack', 'Start a Quote'],
    },
    {
      reply: "Still not finding a match for that! 😅 I'm best at answering questions about services, pricing, process, and tech.\n\nIf your question is more specific, the <b>contact form</b> is the fastest way to get a direct answer from Cherry.",
      quick: ['Start a Quote', 'Services & Pricing'],
    },
    {
      reply: "It looks like I'm not the best tool for this one — Cherry would be able to answer much better than me! 😊 Click below to send a message directly.",
      quick: ['Open Quote Form'],
      action: 'openContact',
    },
  ];

  const FALLBACK = FALLBACK_REPLIES[0]; // default (overridden by counter logic below)

  /* ── Find response ───────────────────────────────────────────────────── */
  function getResponse(text) {
    const lower = text.toLowerCase().trim();
    for (const entry of KB) {
      if (entry.patterns.some(p => lower.includes(p))) {
        _fallbackCount = 0;
        return entry;
      }
    }
    const fallback = FALLBACK_REPLIES[Math.min(_fallbackCount, FALLBACK_REPLIES.length - 1)];
    _fallbackCount++;
    return fallback;
  }

  /* ── Build HTML ──────────────────────────────────────────────────────── */
  const WIDGET_HTML = `
    <button class="cb-toggle" id="cbToggle" aria-label="Open chat">
      <svg class="cb-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="cb-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span class="cb-dot"></span>
    </button>

    <div class="cb-popup" id="cbPopup" role="dialog" aria-label="Chat with Cherry.dev">
      <div class="cb-header">
        <div class="cb-avatar">🍒</div>
        <div class="cb-header-info">
          <strong>Cherry Assistant</strong>
          <span>Online — usually replies instantly</span>
        </div>
      </div>
      <div class="cb-messages" id="cbMessages"></div>
      <div class="cb-quick-replies" id="cbQuickReplies"></div>
      <div class="cb-input-bar">
        <input type="text" id="cbInput" placeholder="Ask me anything…" autocomplete="off" />
        <button class="cb-send" id="cbSend" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  /* ── Init ────────────────────────────────────────────────────────────── */
  function init() {
    // Inject CSS link if not already present
    if (!document.querySelector('link[href*="chatbot.css"]')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = '/css/chatbot.css';
      document.head.appendChild(link);
    }

    // Inject HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = WIDGET_HTML;
    document.body.appendChild(wrapper.firstElementChild); // toggle button
    document.body.appendChild(wrapper.firstElementChild); // popup

    const toggle    = document.getElementById('cbToggle');
    const popup     = document.getElementById('cbPopup');
    const messages  = document.getElementById('cbMessages');
    const qrBar     = document.getElementById('cbQuickReplies');
    const input     = document.getElementById('cbInput');
    const sendBtn   = document.getElementById('cbSend');

    let isOpen = false;

    /* Open / close */
    function openChat() {
      isOpen = true;
      toggle.classList.add('open');
      popup.classList.add('open');
      input.focus();
      if (messages.children.length === 0) greet();
    }
    function closeChat() {
      isOpen = false;
      toggle.classList.remove('open');
      popup.classList.remove('open');
    }

    toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());

    /* Keyboard close */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    /* Expose global open function for Quick quote links */
    window.openCherryChat = function (prefill) {
      openChat();
      if (prefill) setTimeout(() => sendMessage(prefill), 400);
    };

    /* Add message bubble */
    function addMsg(text, type) {
      const el = document.createElement('div');
      el.className = `cb-msg cb-msg--${type}`;
      el.innerHTML = text.replace(/\n/g, '<br>');
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    /* Typing indicator */
    function showTyping() {
      const el = document.createElement('div');
      el.className = 'cb-typing';
      el.id = 'cbTyping';
      el.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }
    function hideTyping() {
      const el = document.getElementById('cbTyping');
      if (el) el.remove();
    }

    /* Quick reply buttons */
    function setQuickReplies(items) {
      qrBar.innerHTML = '';
      (items || []).forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'cb-qr';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          if (label === 'Open Quote Form' || label === 'Start a Quote') {
            window.location.href = '/contact';
            return;
          }
          // Map button labels to natural-language triggers
          const labelMap = {
            'How to Order':       'how to order',
            'Custom Service':     'custom service',
            'Services & Pricing': 'services',
            'Project Timeline':   'timeline',
            'Tech Stack':         'tech stack',
            'Website pricing':    'website pricing',
            'App pricing':        'app pricing',
            'Shop pricing':       'shop pricing',
            'How does it work':   'how does it work',
            'Ownership & Rights': 'ownership',
            'Contact info':       'contact',
            'Timeline info':      'timeline',
          };
          sendMessage(labelMap[label] || label);
        });
        qrBar.appendChild(btn);
      });
    }

    /* Respond after delay */
    function respond(entry) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMsg(entry.reply, 'bot');
        setQuickReplies(entry.quick);
        if (entry.action === 'openContact') {
          setTimeout(() => { window.location.href = '/contact'; }, 1200);
        }
      }, 700 + Math.random() * 400);
    }

    /* Send a message */
    function sendMessage(text) {
      const trimmed = text.trim();
      if (!trimmed) return;
      addMsg(trimmed, 'user');
      setQuickReplies([]);
      input.value = '';
      respond(getResponse(trimmed));
    }

    /* Greeting */
    function greet() {
      setTimeout(() => {
        addMsg("Hi there! 👋 I'm Cherry's assistant. I can answer questions about services, pricing, and timelines — or help you kick off a project!", 'bot');
        setQuickReplies(['Services & Pricing', 'Project Timeline', 'Start a Quote', 'Tech Stack']);
      }, 300);
    }

    /* Input events */
    sendBtn.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage(input.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
