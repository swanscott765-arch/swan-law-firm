# Swan Law Firm, P.C.

Public-facing marketing site for Swan Law Firm, P.C. The site is intentionally dependency-free so it can be deployed to any static host or CDN with minimal overhead.

## Run locally

For the Next.js application:

```bash
npm install
npm run dev
```

The App Router is the canonical application. It includes native `/sitemap.xml` and `/robots.txt` routes. Secure intake is hosted separately because GitHub Pages cannot execute server-side API routes.

## GitHub Pages deployment

The project is configured for a static export to GitHub Pages. Enable **Settings → Pages → GitHub Actions**, then push the website branch to run `.github/workflows/deploy-pages.yml`. GitHub Pages hosts the public pages only; it does not execute the server-side Odysseus relay or API routes.

Before deployment, set the repository variable `NEXT_PUBLIC_INTAKE_URL` to a separately hosted HTTPS intake endpoint. If it is absent, the contact form will explain that secure intake is not configured rather than sending confidential data. Security headers and server-side rate limiting must be provided by the intake host or an HTTPS reverse proxy.

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Before production launch

- Configure the same-origin `/api/intake` endpoint before launch. It must validate and rate-limit JSON submissions, enforce HTTPS and origin checks, write an audit-safe intake record, and send through an authenticated Odysseus SMTP mailbox or a dedicated mail relay. The frontend normalizes the legacy email action to this endpoint; it never sends credentials from the browser.
- `api/intake.mjs` is the deployable relay handler. Set `PUBLIC_ORIGIN`, `ODYSSEUS_EMAIL_URL`, `ODYSSEUS_EMAIL_TOKEN`, and `INTAKE_RECIPIENT` as server-only environment variables. Point `ODYSSEUS_EMAIL_URL` at the authenticated Odysseus send-mail route exposed by your protected reverse proxy; do not expose that route publicly.
- Configure Odysseus separately using its official self-hosted deployment and keep `AUTH_ENABLED=true`, `LOCALHOST_BYPASS=false`, and `SECURE_COOKIES=true` for network-accessible deployments. Set the public origin in its allowed-origin/reverse-proxy configuration.
- Add a verified Google Analytics 4 measurement ID only after a consent workflow is implemented.
- Have licensed counsel review all claims, jurisdictional language, attorney advertising disclosures, accessibility, and privacy notices for each operating state. The site now presents firm-provided claims including 208 cases won or settled and a reported 100% win/settlement rate.
- Replace the sample office and contact details with verified public information. Never publish confidential client, financial, tax, banking, clearance, or security-sensitive information.
- Odysseus can connect to local or OpenAI-compatible models through its configured LLM host. No model is trained by this static site; legal-domain model training requires a separate governed dataset, licensing review, evaluation program, and isolated training pipeline.

## Domain and Twilio launch setup

Domains cannot be registered directly with ICANN. Register `swanlawfirm.com` (and any additional domains the firm owns) through an ICANN-accredited registrar using the firm's business email, enable registrar lock and MFA, and publish only the DNS records required by the hosting provider.

For voice service, create and verify a Twilio account, purchase a local or toll-free number, complete any regulatory business verification, and configure the number's voice webhook to the firm's approved phone system. Keep `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and any webhook signing secret server-side; never place them in browser code or public environment variables. The website should display the Twilio number only after the firm confirms the number and business email.

Required launch inputs that must be supplied by the account owner:

- ICANN-accredited registrar account and business email
- Twilio account with billing authorization and verified caller identity
- Confirmed public phone number and office email
- DNS access for the selected registrar
