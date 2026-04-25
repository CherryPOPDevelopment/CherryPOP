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
      patterns: ['service', 'offer', 'what do you do', 'build', 'make'],
      reply: "I offer three core services:\n\n🌐 <b>Websites</b> — Landing pages, portals, CMS-powered sites\n📱 <b>Apps</b> — iOS & Android via React Native, PWAs\n🛒 <b>Shops</b> — Shopify, WooCommerce, custom storefronts\n\nWant details on any of these?",
      quick: ['Website pricing', 'App pricing', 'Shop pricing', 'Start a Quote'],
    },
    {
      patterns: ['website price', 'website cost', 'website pricing', 'web price'],
      reply: "Website projects typically start at <b>$800</b> for simple landing pages, up to <b>$5,000+</b> for full custom builds with CMS, SEO, and integrations.\n\nEvery project gets a free, no-obligation quote.",
      quick: ['App pricing', 'Shop pricing', 'Start a Quote'],
    },
    {
      patterns: ['app price', 'app cost', 'app pricing', 'mobile price'],
      reply: "App development usually ranges from <b>$3,000</b> (simple cross-platform) to <b>$10,000+</b> (complex with backend, auth, and APIs).\n\nLet's chat about your specific idea for an accurate number.",
      quick: ['Website pricing', 'Shop pricing', 'Start a Quote'],
    },
    {
      patterns: ['shop price', 'shop cost', 'ecommerce price', 'shopify price', 'store price'],
      reply: "E-commerce builds start around <b>$1,200</b> for basic Shopify setups, going to <b>$6,000+</b> for fully custom storefronts with subscriptions and custom checkout flows.",
      quick: ['Website pricing', 'App pricing', 'Start a Quote'],
    },
    {
      patterns: ['price', 'cost', 'how much', 'rate', 'charge', 'pricing', 'budget'],
      reply: "Pricing depends on the scope, but here's a rough guide:\n\n🌐 Websites: from $800\n📱 Apps: from $3,000\n🛒 Shops: from $1,200\n\nFill in the quote form for an exact number — it only takes 2 minutes!",
      quick: ['Start a Quote', 'Timeline info'],
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
  ];

  const FALLBACK = {
    reply: "I'm not sure about that one! 😅 You can ask me about services, pricing, timelines, or just jump straight to a quote.",
    quick: ['Services & Pricing', 'Project Timeline', 'Start a Quote'],
  };

  /* ── Find response ───────────────────────────────────────────────────── */
  function getResponse(text) {
    const lower = text.toLowerCase().trim();
    for (const entry of KB) {
      if (entry.patterns.some(p => lower.includes(p))) return entry;
    }
    return FALLBACK;
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
          if (label === 'Open Quote Form') {
            window.location.href = '/contact';
            return;
          }
          if (label === 'Start a Quote') {
            window.location.href = '/contact';
            return;
          }
          sendMessage(label);
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
