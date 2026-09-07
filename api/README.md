# Intake relay

`intake.mjs` is a server-only handler for a platform such as Vercel, Netlify, or a small Node-compatible edge service. It is not a browser endpoint to run without a protected deployment.

Configure these environment variables in the hosting platform's secret store:

```text
PUBLIC_ORIGIN=https://swanlawfirm.com
ODYSSEUS_EMAIL_URL=https://odysseus.internal.example/api/email/send
ODYSSEUS_EMAIL_TOKEN=<server-only relay token>
INTAKE_RECIPIENT=intake@swanlawfirm.com
```

The Odysseus URL must be an authenticated, HTTPS reverse-proxy route that is explicitly permitted to send intake mail through the configured SMTP account. Do not expose the Odysseus admin UI, IMAP/SMTP ports, token, session cookie, or LLM endpoints to the public internet.

The handler rejects non-JSON requests, wrong origins, invalid fields, oversized values, and bursts above five requests per IP per fifteen minutes. It does not log form contents.
