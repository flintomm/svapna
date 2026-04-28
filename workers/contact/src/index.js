// Contact form Worker. Receives FormData POSTs from the site, validates,
// drops honeypot submissions, and sends email via Resend.
//
// Secrets (set with `wrangler secret put`):
//   RESEND_KEY — Resend API key

const ALLOWED_ORIGINS = new Set([
  'https://svapnaproject.org',
  'https://www.svapnaproject.org',
  'http://localhost:5173',
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

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

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
  },
};
