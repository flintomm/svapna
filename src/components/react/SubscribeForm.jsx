import { useState } from 'react';

// Posts to the svapna-contact Worker's /subscribe route, which adds the
// address to the Buttondown subscriber list. Source: workers/contact/.
const SUBSCRIBE_ENDPOINT = 'https://svapna-contact.tphch.workers.dev/subscribe';

export default function SubscribeForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setError('Network error.');
      setStatus('error');
    }
  };

  const inputStyle = { border: '0.5px solid #000' };
  const inputClass = 'flex-1 bg-transparent px-4 py-3 text-base focus:outline-none focus:bg-neutral-50';
  const labelClass = 'mono text-[10px] uppercase tracking-widest text-neutral-500';

  if (status === 'sent') {
    return (
      <div className="p-6" style={inputStyle}>
        <p className={labelClass}>Subscribed</p>
        <p className="display text-xl md:text-2xl italic mt-2 leading-snug">
          Notes will arrive when they arrive.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="subscribe-email" className="sr-only">Email</label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="email@address"
          className={inputClass}
          style={inputStyle}
        />
        {/* Honeypot — bots fill this; humans don't see it. */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden' }}
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-6 py-3 mono text-[10px] uppercase tracking-widest active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-colors flex items-center justify-between gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          style={inputStyle}
        >
          <span>{status === 'sending' ? 'Sending…' : 'Subscribe'}</span>
          <span>→</span>
        </button>
      </div>
      {status === 'error' && (
        <p className="mono text-[10px] uppercase tracking-widest text-red-700">{error}</p>
      )}
    </form>
  );
}
