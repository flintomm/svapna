import { useState } from 'react';

// Posts to the svapna-contact Worker (same endpoint as the contact form),
// with subject forced to "[Library] Pitch" so the inbox can route it.
const ENDPOINT = 'https://svapna-contact.tphch.workers.dev';

export default function LibraryPitchForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('subject', '[Library] Pitch');
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch(ENDPOINT, {
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
  const inputClass = 'w-full bg-transparent px-4 py-3 text-base focus:outline-none focus:bg-neutral-50';
  const labelClass = 'mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block';

  if (status === 'sent') {
    return (
      <div className="mt-4 p-5 md:p-6" style={inputStyle}>
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Pitch received</p>
        <p className="display text-xl md:text-2xl italic mt-2 leading-snug">A reply will follow.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
      <div>
        <label htmlFor="pitch-name" className={labelClass}>Name</label>
        <input id="pitch-name" name="name" type="text" required autoComplete="name" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label htmlFor="pitch-email" className={labelClass}>Email</label>
        <input id="pitch-email" name="email" type="email" required autoComplete="email" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label htmlFor="pitch-message" className={labelClass}>Pitch</label>
        <textarea id="pitch-message" name="message" rows={4} required placeholder="A primary source, a translator's note, a tradition this should cover…" className={`${inputClass} resize-y`} style={inputStyle} />
      </div>
      {/* Honeypot — bots fill this; humans don't see it. */}
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
        Sending the pitch routes name, email, and content through the site's privacy{' '}
        <a href="/about/privacy" className="underline underline-offset-4 hover:text-black">policy</a>.
      </p>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3 px-4 mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
        style={inputStyle}
      >
        <span>{status === 'sending' ? 'Sending…' : 'Send pitch'}</span>
        <span>→</span>
      </button>
    </form>
  );
}
