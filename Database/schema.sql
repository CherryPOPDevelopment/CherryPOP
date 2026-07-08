-- CherryDev Freelance App - MySQL Schema
-- Run: mysql -u root -p < Database/schema.sql

CREATE DATABASE IF NOT EXISTS cherrypop_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cherrypop_dev;

-- Admin / client accounts
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','client') NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client project inquiries submitted via the contact form
CREATE TABLE IF NOT EXISTS inquiries (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(100) NOT NULL,
  service_type      ENUM('website','app','shop','other') NOT NULL,
  budget            VARCHAR(50),
  message           TEXT NOT NULL,
  status            ENUM('new','in_review','accepted','completed','declined') NOT NULL DEFAULT 'new',
  payment_status    ENUM('none','pending','paid','failed') NOT NULL DEFAULT 'none',
  stripe_session_id VARCHAR(255) DEFAULT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Editable site content sections
CREATE TABLE IF NOT EXISTS site_content (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  section    VARCHAR(80)  NOT NULL UNIQUE,  -- e.g. 'hero', 'about', 'services'
  content    LONGTEXT     NOT NULL,         -- JSON blob of fields
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default content (can be overwritten via dashboard)
INSERT IGNORE INTO site_content (section, content) VALUES
('hero', '{"badge":"✦ Available for projects","title":"I build digital experiences that convert & scale","subtitle":"Freelance developer specialising in websites, mobile apps, and full-featured online shops. Clean code. On time. No fluff.","cta_primary":"Start a Project","cta_secondary":"View My Work","stat1_num":"40+","stat1_label":"Projects Delivered","stat2_num":"98%","stat2_label":"Client Satisfaction","stat3_num":"5yr","stat3_label":"Experience"}'),
('about', '{"tag":"About me","title":"Turning ideas into working products","body1":"I\'m a full-stack freelance developer with 5 years of experience shipping production-grade products for startups, agencies, and direct clients.","body2":"I care about clean code, honest timelines, and making sure every project actually grows your business — not just looks good in a Figma file.","cta":"Work with me"}'),
('services', '{"tag":"What I do","title":"Services","subtitle":"End-to-end solutions built around your goals.","website_title":"Website Development","website_desc":"Blazing-fast, responsive websites engineered for performance and SEO. From landing pages to complex portals.","app_title":"App Development","app_desc":"Cross-platform mobile & web applications that feel native on every device. Built with modern frameworks.","shop_title":"Shop Development","shop_desc":"High-converting e-commerce stores with seamless checkout, inventory management, and payment integration."}'),
('contact', '{"tag":"Let\'s talk","title":"Start a Project","subtitle":"Fill in the form and I\'ll get back to you within 24 hours.","info1":"📍 Remote — worldwide","info2":"⏱ Response within 24h","info3":"📅 Currently accepting new clients"}');

-- Seed a default admin account  (password: Admin1234!)
-- Replace hash after running:  node -e "const b=require('bcryptjs');console.log(b.hashSync('Admin1234!',12))"
INSERT IGNORE INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@cherrydev.io', '$2a$12$tUBe72W088ZV73.R5lLK7..ydheXjF/9RKMoOyOFR2kFjHNQZTkla', 'admin');

-- Password reset tokens (for forgot-password flow)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used       TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Migration for existing databases: add 'other' to inquiries service_type
ALTER TABLE inquiries MODIFY COLUMN service_type ENUM('website','app','shop','other') NOT NULL;
-- Migration: add Stripe payment columns
SET @payment_status_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'inquiries'
    AND COLUMN_NAME = 'payment_status'
);
SET @payment_status_sql := IF(
  @payment_status_exists = 0,
  "ALTER TABLE inquiries ADD COLUMN payment_status ENUM('none','pending','paid','failed') NOT NULL DEFAULT 'none'",
  'SELECT 1'
);
PREPARE payment_status_stmt FROM @payment_status_sql;
EXECUTE payment_status_stmt;
DEALLOCATE PREPARE payment_status_stmt;

SET @stripe_session_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'inquiries'
    AND COLUMN_NAME = 'stripe_session_id'
);
SET @stripe_session_sql := IF(
  @stripe_session_exists = 0,
  'ALTER TABLE inquiries ADD COLUMN stripe_session_id VARCHAR(255) DEFAULT NULL',
  'SELECT 1'
);
PREPARE stripe_session_stmt FROM @stripe_session_sql;
EXECUTE stripe_session_stmt;
DEALLOCATE PREPARE stripe_session_stmt;
