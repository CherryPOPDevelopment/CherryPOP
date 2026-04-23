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
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) NOT NULL,
  service_type ENUM('website','app','shop') NOT NULL,
  budget       VARCHAR(50),
  message      TEXT NOT NULL,
  status       ENUM('new','in_review','accepted','completed','declined') NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed a default admin account  (password: Admin1234!)
-- Replace hash after running:  node -e "const b=require('bcryptjs');console.log(b.hashSync('Admin1234!',12))"
INSERT IGNORE INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@cherrydev.io', '$2a$12$tUBe72W088ZV73.R5lLK7..ydheXjF/9RKMoOyOFR2kFjHNQZTkla', 'admin');
