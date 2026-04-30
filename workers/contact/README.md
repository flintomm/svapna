# svapna-contact

Cloudflare Worker that handles two routes for the Svapna site:

- `POST /api/contact` — contact form. Forwards messages to
  `admin@svapnaproject.org` via Resend.
- `POST /api/contact/subscribe` — email capture from lesson and Support
  pages. Adds the address to the Buttondown subscriber list for newsletter
  broadcasts.

The Worker is mounted same-origin on `svapnaproject.org/api/contact*`
(see `wrangler.toml`). The legacy `svapna-contact.tphch.workers.dev`
subdomain remains live as a transitional fallback and will be retired
once the same-origin route is verified end-to-end.

## One-time setup

From this directory:

```bash
npx wrangler secret put RESEND_KEY
npx wrangler secret put BUTTONDOWN_KEY
```

When prompted, paste the API key for each service. They're encrypted into
Cloudflare's secret store and never written to the codebase. The
Buttondown key is found at https://buttondown.com/settings/programming.

## Manual Cloudflare-dashboard steps for the same-origin route

`wrangler deploy` will register the zone routes from `wrangler.toml`
automatically, but the following must be true on the account first:

1. The `svapnaproject.org` zone is attached to the same Cloudflare
   account the Worker deploys under (Websites -> svapnaproject.org).
2. DNS for the apex and `www` is proxied (orange cloud) — typically via
   the Cloudflare Pages custom-domain binding for the site. Worker
   routes only match traffic flowing through Cloudflare's proxy.
3. After deploy, check Workers & Pages -> svapna-contact -> Settings
   -> Triggers and confirm both route patterns
   (`svapnaproject.org/api/contact*` and `www.svapnaproject.org/api/contact*`)
   are listed against the `svapnaproject.org` zone. If `wrangler deploy`
   reports a route conflict, remove the stale route in the dashboard
   first.

## Deploy

```bash
npx wrangler deploy
```

After deploy, smoke-test the same-origin route:

```bash
curl -X POST https://svapnaproject.org/api/contact \
  -F 'name=Test' -F 'email=test@example.com' -F 'message=hello'

curl -X POST https://svapnaproject.org/api/contact/subscribe \
  -F 'email=test@example.com'
```

Both should return `{"ok":true}` with HTTP 200.

The legacy `https://svapna-contact.tphch.workers.dev` URL also remains
reachable during the migration window because `workers_dev = true` in
`wrangler.toml`.

## Retiring the workers.dev fallback

Once `/api/contact` is verified live and every form on the site has cut
over to the same-origin URL:

1. Set `workers_dev = false` in `wrangler.toml`.
2. `npx wrangler deploy` to apply.
3. Confirm `https://svapna-contact.tphch.workers.dev` returns the
   "Worker not found" page.

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
curl -X POST http://localhost:8787/api/contact \
  -F 'name=Test' -F 'email=test@example.com' -F 'message=hello'

# Subscribe
curl -X POST http://localhost:8787/api/contact/subscribe \
  -F 'email=test@example.com'
```

## Allowed origins

CORS allows POSTs from:
- `https://svapnaproject.org`
- `https://www.svapnaproject.org`
- `http://localhost:4321` (Astro dev server)

Adjust `ALLOWED_ORIGINS` in `src/index.js` to add or remove origins.
