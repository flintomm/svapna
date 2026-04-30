import { useState } from 'react';

// Posts to the svapna-contact Cloudflare Worker, which forwards via Resend
// to admin@svapnaproject.org. Source: workers/contact/.
// Routed through the same-origin /api/contact path (see wrangler.toml).
const CONTACT_ENDPOINT = '/api/contact';

export default function ContactForm({ email }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || 'Something went wrong. Please email instead.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please email instead.');
      setStatus('error');
    }
  };

  const inputStyle = { border: '0.5px solid #000' };
  const inputClass = 'w-full bg-transparent px-4 py-3 text-base focus:outline-none focus:bg-neutral-50';
  const labelClass = 'mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block';

  return (
    <div className="pt-4 md:pt-6 space-y-6">
      <div className="hairline-t pt-6 md:pt-8">
        <p className={labelClass}>Or use the form</p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Direct email also works:{' '}
          <a href={`mailto:${email}`} className="underline underline-offset-4 hover:text-black">
            {email}
          </a>
          .
        </p>
      </div>

      {status === 'sent' ? (
        <div className="p-6 md:p-8" style={inputStyle}>
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Message received</p>
          <p className="display text-2xl md:text-3xl italic mt-2 leading-snug">
            Thank you. A reply will follow.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="contact-name" className={labelClass}>Name</label>
            <input id="contact-name" name="name" type="text" required autoComplete="name" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>Email</label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="contact-subject" className={labelClass}>Subject</label>
            <input id="contact-subject" name="subject" type="text" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="contact-message" className={labelClass}>Message</label>
            <textarea id="contact-message" name="message" rows={6} required className={`${inputClass} resize-y`} style={inputStyle} />
          </div>
          {/* Honeypot field — bots fill this; humans don't see it. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden' }}
            aria-hidden="true"
          />
          {status === 'error' && (
            <p className="mono text-[10px] uppercase tracking-widest text-red-700">{error}</p>
          )}
          <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">
            Sending the message routes name, email, and content through the site's privacy{' '}
            <a href="/about/privacy" className="underline underline-offset-4 hover:text-black">policy</a>.
          </p>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 px-5 md:px-6 mono text-[10px] uppercase tracking-widest active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-colors flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={inputStyle}
          >
            <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
            <span>→</span>
          </button>
        </form>
      )}
    </div>
  );
}
