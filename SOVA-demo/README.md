# SOVA Scoop — Demo

A fully standalone demo of the SOVA Scoop hotel concierge platform.
**No database required.** All data is served from in-memory mock data and resets on logout.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# or for live reload during development:
npm run dev
```

Server runs at **http://localhost:4000**

## Demo Credentials

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Customer | demo@sova.com          | Demo1234     |
| Employee | employee@sova.com      | Employee1234 |
| Admin    | admin@sova.com         | Admin1234    |

Credentials are also shown on the login page.

## Configuration

Edit `.env` to change the port or demo credentials:

```
PORT=4000
SESSION_SECRET=demo-only-secret-change-before-deploy

DEMO_ADMIN_EMAIL=admin@sova.com
DEMO_ADMIN_PASSWORD=Admin1234
DEMO_EMPLOYEE_EMAIL=employee@sova.com
DEMO_EMPLOYEE_PASSWORD=Employee1234
DEMO_CUSTOMER_EMAIL=demo@sova.com
DEMO_CUSTOMER_PASSWORD=Demo1234
```

## How It Works

- All data lives in `backend/data/mockData.js` — no MySQL, no external services.
- Session-scoped writes (create/edit/delete places and events) are allowed and stored in the session, but **wiped on logout**.
- Admin-only features (user governance, platform config, invite codes, audit log) show a "not available in demo" message.

## Project Structure

```
demo/
├── .env                        # Environment config (port, demo credentials)
├── package.json                # Dependencies
├── backend/
│   ├── app.js                  # Express server entry point
│   ├── data/
│   │   └── mockData.js         # All mock data + session-scoped store helpers
│   └── routes/
│       ├── auth.js             # Login / logout / location selection
│       ├── events.js           # Full events CRUD (session-scoped)
│       ├── index.js            # Home, admin, employee, static pages
│       └── places.js           # Full places CRUD (session-scoped)
└── frontend/
    ├── public/
    │   ├── css/style.css       # Stylesheet
    │   └── uploads/avatars/    # Demo avatar images
    └── views/                  # EJS templates (mirrors main app views)
```
