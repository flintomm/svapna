# svapna-contact

Cloudflare Worker that receives POSTs from the contact form on
https://svapnaproject.org and forwards them to `admin@svapnaproject.org`
via Resend.

## One-time setup

From this directory:

```bash
npx wrangler secret put RESEND_KEY
```

When prompted, paste the Resend API key. It's encrypted into Cloudflare's
secret store and never written to the codebase.

## Deploy

```bash
npx wrangler deploy
```

Wrangler prints the URL the Worker is reachable at (something like
`https://svapna-contact.tphch.workers.dev`). The site's React form needs
that URL set as `CONTACT_ENDPOINT` in `src/DreamYogaApp.jsx`.

## Local dev

```bash
npx wrangler dev
```

Server at http://localhost:8787. To send actual email locally, create
`.dev.vars`:

```
RESEND_KEY=re_...
```

Test from another terminal:

```bash
curl -X POST http://localhost:8787 \
  -F 'name=Test' -F 'email=test@example.com' -F 'message=hello'
```

## Allowed origins

CORS allows POSTs from:
- `https://svapnaproject.org`
- `https://www.svapnaproject.org`
- `http://localhost:5173` (Vite dev server)

Adjust `ALLOWED_ORIGINS` in `src/index.js` to add or remove origins.
