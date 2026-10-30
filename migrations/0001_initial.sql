CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'client')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('website', 'app', 'shop', 'other')),
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'accepted', 'completed', 'declined')),
  payment_status TEXT NOT NULL DEFAULT 'none' CHECK (payment_status IN ('none', 'pending', 'paid', 'failed')),
  stripe_session_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS inquiries_updated_at
AFTER UPDATE ON inquiries
FOR EACH ROW
BEGIN
  UPDATE inquiries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS site_content_updated_at
AFTER UPDATE ON site_content
FOR EACH ROW
BEGIN
  UPDATE site_content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used IN (0, 1)),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_token_hash ON password_reset_tokens(token_hash);

INSERT OR IGNORE INTO site_content (section, content) VALUES
('hero', '{"badge":"✦ Available for projects","title":"I build digital experiences that convert & scale","subtitle":"Freelance developer specialising in websites, mobile apps, and full-featured online shops. Clean code. On time. No fluff.","cta_primary":"Start a Project","cta_secondary":"View My Work","stat1_num":"10+","stat1_label":"Projects Delivered","stat2_num":"98%","stat2_label":"Client Satisfaction","stat3_num":"2yr","stat3_label":"Experience"}'),
('about', '{"tag":"About me","title":"Turning ideas into working products","body1":"I''m a full-stack freelance developer with 2 years of experience building websites, mobile apps, and online shops. I specialise in no-code development and design with a special interest in python, java, mysql, and css code. I am very passionate and excited to continue to learn and grow my skills and knowledge-- and to work with you!","body2":"","cta":"Work with me"}'),
('services', '{"tag":"What I do","title":"Services","subtitle":"End-to-end solutions built around your goals.","website_title":"Website Development","website_desc":"Blazing-fast, responsive websites engineered for performance and SEO. From landing pages to complex portals.","app_title":"App Development","app_desc":"Cross-platform mobile & web applications that feel native on every device. Built with modern frameworks.","shop_title":"Shop Development","shop_desc":"High-converting e-commerce stores with seamless checkout, inventory management, and payment integration."}'),
('contact', '{"tag":"Let''s talk","title":"Start a Project","subtitle":"Fill in the form and I''ll get back to you within 24 hours.","info1":"📍 Remote — worldwide","info2":"⏱ Response within 24h","info3":"📅 Currently accepting new clients"}');
