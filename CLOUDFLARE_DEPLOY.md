# Deploy CherryPOP to Cloudflare Workers and D1

The Cloudflare Worker serves the main CherryPOP website and API. Cloudflare D1 is the production SQLite database. The existing XAMPP/MySQL database is local to a PC and cannot be reached by a Worker or connected to D1 using Hyperdrive. This project includes a D1 schema migration and an opt-in script to export existing MySQL data for import.

## One-time setup

1. Sign in to Cloudflare from PowerShell:

   ```powershell
   npx.cmd --yes wrangler@latest login
   ```

   Use `npx.cmd` in PowerShell if the `npx` command is blocked by script execution policy.

2. Create the D1 database if it does not already exist:

   ```powershell
   npx.cmd --yes wrangler@latest d1 create cherrypop
   ```

   Copy the generated database ID into `wrangler.jsonc` as `database_id`. The current CherryPOP database has already been created and its ID is configured there.

3. Apply the schema and default public content:

   ```powershell
   npx.cmd --yes wrangler@latest d1 migrations apply cherrypop --remote
   ```

4. Export your XAMPP database locally. Configure `Backend/.env` with the local MySQL connection settings first. This export contains personal information and password hashes; it is gitignored and must be kept private:

   ```powershell
   node Backend/scripts/export-d1-data.js --confirm-sensitive-output
   ```

   The script exports users, inquiries, editable site content, and password-reset tokens. It clears those tables before inserting the exported records, so only run the import against the newly created D1 database before real users submit data. If the XAMPP database still has the seeded admin account with its published default password, run `node Backend/scripts/change-seeded-admin-password.js` in an interactive terminal first. It prompts for the replacement password without echoing it; the export script refuses to migrate the known default hash.

5. Import the data into D1:

   ```powershell
   npx.cmd --yes wrangler@latest d1 execute cherrypop --remote --file=Backend/d1-data-import.sql
   ```

   Verify the imported data before switching live traffic. Securely delete `Backend/d1-data-import.sql` after confirming the import; it contains sensitive user data.

6. Configure Worker secrets from the repository root. Wrangler prompts for each value; do not put secret values in source control or chat:

   ```powershell
   npx.cmd --yes wrangler@latest secret put SESSION_SECRET
   npx.cmd --yes wrangler@latest secret put RESEND_API_KEY
   npx.cmd --yes wrangler@latest secret put STRIPE_SECRET_KEY
   npx.cmd --yes wrangler@latest secret put STRIPE_WEBHOOK_SECRET
   npx.cmd --yes wrangler@latest secret put SOVA_ORIGIN
   npx.cmd --yes wrangler@latest secret put AURELIA_ORIGIN
   ```

   `SESSION_SECRET` must be a unique random value of at least 32 characters. Email and Stripe secrets are optional unless those features are enabled. `SOVA_ORIGIN` and `AURELIA_ORIGIN` must be public HTTPS URLs that Cloudflare can reach, not `localhost` and not the Worker domain itself. Use a DNS-only or proxied hostname that points at the VPS and serves those apps (for example an Nginx `server` block for `aurelia-origin.cherrypopdevelopment.com` proxying to port 5000 and `sova-origin.cherrypopdevelopment.com` proxying to port 4000), or `https://sova.cherrypopdevelopment.com` if `workers/sova` is deployed. The Worker returns `503` for an unconfigured origin and `502` if it cannot be reached.

   Aurelia's static frontend is bundled with the Worker and served at `/aurelia/`; only `/aurelia/api/*` is proxied to `AURELIA_ORIGIN`, so the Aurelia backend must be running there. `/sova-demo/*` is fully proxied to `SOVA_ORIGIN`. The Worker rewrites root-relative links, redirects, and cookie paths so both apps work under their path prefixes.

## Deploy

Once the D1 database ID, schema/data, and required secrets are configured:

```powershell
npx.cmd --yes wrangler@latest deploy
```

Wrangler builds static assets from the frontend, CSS, images, Botanics, and project showcase. The Worker routes the apex and `www` domain to Cloudflare, so deploying will switch live traffic to the Worker. Keep the existing VPS available as a rollback until the checks below pass.

This Worker is configured for the Workers Paid plan with a 30-second CPU limit because existing bcrypt cost-12 password hashing exceeds Cloudflare's Free Worker CPU budget. The Worker maintains signed, secure, HTTP-only sessions without server-local session storage.

## Verify deployment

1. Open the home page, login, contact, FAQ, and service pages.
2. Confirm `/api/content/hero` returns content and submit a test inquiry.
3. Verify the inquiry appears in D1 and any configured notification/confirmation email arrives.
4. Sign in, refresh, and confirm the session persists. The `connect.sid` cookie should be `Secure` and `HttpOnly`.
5. Test `/sova-demo` and `/aurelia` when their origin secrets are configured.
6. If Stripe is configured, set the Stripe webhook endpoint to `https://cherrypopdevelopment.com/api/payments/webhook` and complete a test checkout.
