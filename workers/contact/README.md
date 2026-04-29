# svapna-contact

Cloudflare Worker that handles two routes for the Svapna site:

- `POST /` — contact form. Forwards messages to `admin@svapnaproject.org`
  via Resend.
- `POST /subscribe` — email capture from lesson and Support pages. Adds
  the address to the Buttondown subscriber list for newsletter
  broadcasts.

## One-time setup

From this directory:

```bash
npx wrangler secret put RESEND_KEY
npx wrangler secret put BUTTONDOWN_KEY
```

When prompted, paste the API key for each service. They're encrypted into
Cloudflare's secret store and never written to the codebase. The
Buttondown key is found at https://buttondown.com/settings/programming.

## Deploy

```bash
npx wrangler deploy
```

Wrangler prints the URL the Worker is reachable at (something like
`https://svapna-contact.tphch.workers.dev`). The site's React forms need
that URL set as `CONTACT_ENDPOINT` in
`src/components/react/ContactForm.jsx` and `SUBSCRIBE_ENDPOINT` in
`src/components/react/SubscribeForm.jsx`.

## Local dev

```bash
npx wrangler dev
```

Server at http://localhost:8787. To exercise either route locally, create
`.dev.vars`:

```
RESEND_KEY=re_...
BUTTONDOWN_KEY=...
```

Test from another terminal:

```bash
# Contact form
curl -X POST http://localhost:8787 \
  -F 'name=Test' -F 'email=test@example.com' -F 'message=hello'

# Subscribe
curl -X POST http://localhost:8787/subscribe \
  -F 'email=test@example.com'
```

## Allowed origins

CORS allows POSTs from:
- `https://svapnaproject.org`
- `https://www.svapnaproject.org`
- `http://localhost:5173` (Vite dev server)

Adjust `ALLOWED_ORIGINS` in `src/index.js` to add or remove origins.
