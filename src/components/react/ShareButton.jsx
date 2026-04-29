import { useState } from 'react';

const SHARE_URL = 'https://svapnaproject.org';
const SHARE_TITLE = 'Svapna — a course in dream yoga';

export default function ShareButton() {
  const [status, setStatus] = useState('idle'); // idle | shared | copied | error

  const handleClick = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ url: SHARE_URL, title: SHARE_TITLE });
        setStatus('shared');
        setTimeout(() => setStatus('idle'), 2000);
      } catch {
        // user cancelled — leave status alone
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const label =
    status === 'shared' ? 'Shared' :
    status === 'copied' ? 'Link copied' :
    status === 'error' ? 'Copy failed' :
    'Share the link';

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-4 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-black hover:text-white transition-colors"
      style={{ border: '0.5px solid #000' }}
    >
      <span>{label}</span>
      <span>→</span>
    </button>
  );
}
