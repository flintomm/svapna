// Cloudflare Worker for the Svapna site. Handles two routes:
//
//   POST /          — contact form. Validates and emails admin@ via Resend.
//   POST /subscribe — email capture. Adds the address to the Buttondown
//                     subscriber list so it can receive future broadcasts.
//
// Secrets (set with `wrangler secret put`):
//   RESEND_KEY     — Resend API key (contact form)
//   BUTTONDOWN_KEY — Buttondown API key (subscribe form)

const ALLOWED_ORIGINS = new Set([
  'https://svapnaproject.org',
  'https://www.svapnaproject.org',
  'http://localhost:4321',
]);

const TO_ADDRESS = 'admin@svapnaproject.org';
const FROM_ADDRESS = 'Svapna Contact <noreply@svapnaproject.org>';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 10000;

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://svapnaproject.org';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    if (url.pathname === '/subscribe') {
      return handleSubscribe(request, env, origin);
    }
    return handleContact(request, env, origin);
  },
};

async function handleContact(request, env, origin) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data' }, 400, origin);
  }

  // Honeypot — bots fill `_gotcha`, humans never see it. Accept silently
  // so the bot doesn't learn the request was rejected.
  if ((form.get('_gotcha') ?? '').toString().trim()) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  const name = (form.get('name') ?? '').toString().trim();
  const email = (form.get('email') ?? '').toString().trim();
  const subject = (form.get('subject') ?? '').toString().trim();
  const message = (form.get('message') ?? '').toString().trim();

  if (!name || !email || !message) {
    return jsonResponse({ error: 'Name, email, and message are required.' }, 400, origin);
  }
  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'Email looks invalid.' }, 400, origin);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: 'Message is too long.' }, 400, origin);
  }

  const subjectLine = subject ? `[Contact] ${subject}` : '[Contact] New message';
  const text = `From: ${name} <${email}>\n\n${message}`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      reply_to: email,
      subject: subjectLine,
      text,
    }),
  });

  if (!send.ok) {
    const body = await send.text().catch(() => '');
    console.error('Resend failed', send.status, body.slice(0, 500));
    return jsonResponse({ error: 'Email send failed.' }, 502, origin);
  }

  return jsonResponse({ ok: true }, 200, origin);
}

async function handleSubscribe(request, env, origin) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data' }, 400, origin);
  }

  // Honeypot — accept silently to avoid leaking signal to bots.
  if ((form.get('_gotcha') ?? '').toString().trim()) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  const email = (form.get('email') ?? '').toString().trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'Email looks invalid.' }, 400, origin);
  }

  if (!env.BUTTONDOWN_KEY) {
    console.error('BUTTONDOWN_KEY is not set');
    return jsonResponse({ error: 'Subscription is not configured.' }, 500, origin);
  }

  const send = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.BUTTONDOWN_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  });

  // Buttondown returns 201 on create. Several 4xx outcomes are treated as
  // success so the form never reveals subscriber-list state to the caller:
  //   - email_already_exists — address is already on the list
  //   - subscriber_blocked   — address tripped the account firewall
  // Genuine failures (auth, network, schema) still surface as 502.
  if (send.ok) {
    return jsonResponse({ ok: true }, 200, origin);
  }
  const bodyText = await send.text().catch(() => '');
  if (/already|exists|duplicate|blocked|firewall/i.test(bodyText)) {
    return jsonResponse({ ok: true }, 200, origin);
  }
  console.error('Buttondown subscribe failed', send.status, bodyText.slice(0, 500));
  return jsonResponse({ error: 'Subscription failed.' }, 502, origin);
}
