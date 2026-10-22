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
| Guest    | guest@sova.com         | Guest1234    |
| Customer | demo@sova.com          | Demo1234     |
| Employee | employee@sova.com      | Employee1234 |
| Management | management@sova.com  | Management1234 |
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
DEMO_MANAGEMENT_PASSWORD=Management1234
DEMO_GUEST_PASSWORD=Guest1234
```

## How It Works

- Recommendation and event data lives in `backend/data/mockData.js`; other session-only demo features live in `backend/data/demoFeatures.js`. No MySQL or external services are required.
- Every signed-in demo role can use the place and event management actions; changes are stored in the session and **wiped on logout**.
- Account settings, reservations, discussion, support, suggestions, shift notes, staff tickets, and onboarding are available to signed-in demo roles; changes are session-only. Employee accounts see the employee workspace, while the management and admin dashboards are reserved for their respective roles. Demo management tools remain available for preview without placing an admin dashboard in the employee workspace.
- The recommendation planner and quiz use the same client-side itinerary builder as SOVA. Itineraries stay in the browser and are not submitted to a server.
- Sample employee registration uses invite code `SOVA-DEMO`; simulated two-factor verification uses `123456`.
- New file uploads are disabled in the demo, including profile-photo form submissions.
- The SOVA demo runs independently from Aurelia. Its browser session cookie is scoped to `/sova-demo`.

## Project Structure

```
SOVA-demo/
├── .env                        # Environment config (port, demo credentials)
├── package.json                # Dependencies
├── backend/
│   ├── app.js                  # Express server entry point
│   ├── data/
│   │   ├── demoFeatures.js     # Session-scoped account, support, and staff features
│   │   └── mockData.js         # Mock places/events + session-scoped store helpers
│   └── routes/
│       ├── auth.js             # Login / logout / location selection
│       ├── events.js           # Full events CRUD (session-scoped)
│       ├── index.js            # Home, admin, employee, static pages
│       ├── places.js           # Full places CRUD (session-scoped)
│       └── tickets.js          # Staff ticket board (session-scoped)
└── frontend/
    ├── public/
    │   ├── css/style.css       # SOVA stylesheet
    │   ├── js/adventure-guide.js # Client-side itinerary planner
    │   ├── images/scoopdesign.jpg # SCOOP project cover
    │   └── uploads/avatars/    # Demo avatar images
    ├── showcase/               # SCOOP showcase pages served by CherryPOP
    └── views/                  # EJS templates (mirrors main app views)
```
