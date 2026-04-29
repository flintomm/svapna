import { useEffect, useState } from 'react';

// Persisted in localStorage under `svapna_progress` as a JSON array of
// `${moduleNum}-${lessonNum}` keys. The list rendering itself (which lessons
// exist in a module) is server-rendered; this island only owns the checkbox
// state for a single lesson key and emits a `svapna:progress` CustomEvent so
// other islands on the page can react if they want to.

function readSet() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem('svapna_progress');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeSet(set) {
  try {
    window.localStorage.setItem('svapna_progress', JSON.stringify([...set]));
  } catch {
    /* swallow */
  }
}

// Square checkbox used in module lesson lists.
export function LessonCheckbox({ progressKey }) {
  // Render `false` on the server so SSR HTML matches the initial hydration
  // pass; sync the real value from localStorage right after mount and on every
  // progress event.
  const [done, setDone] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(readSet().has(progressKey));
    const onUpdate = (e) => {
      if (e?.detail?.key === progressKey) setDone(Boolean(e.detail.done));
    };
    window.addEventListener('svapna:progress', onUpdate);
    return () => window.removeEventListener('svapna:progress', onUpdate);
  }, [progressKey]);

  const toggle = () => {
    const set = readSet();
    const next = !set.has(progressKey);
    if (next) set.add(progressKey); else set.delete(progressKey);
    writeSet(set);
    setDone(next);
    window.dispatchEvent(new CustomEvent('svapna:progress', { detail: { key: progressKey, done: next } }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`w-full h-full flex items-center justify-center mono text-sm transition-colors ${done ? 'bg-black text-white' : 'text-neutral-400 hover:bg-neutral-100'}`}
      aria-pressed={done}
      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
    >
      {done ? '✓' : '○'}
    </button>
  );
}

// Pill button used on the lesson detail page itself.
export function LessonProgressButton({ progressKey }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(readSet().has(progressKey));
    const onUpdate = (e) => {
      if (e?.detail?.key === progressKey) setDone(Boolean(e.detail.done));
    };
    window.addEventListener('svapna:progress', onUpdate);
    return () => window.removeEventListener('svapna:progress', onUpdate);
  }, [progressKey]);

  const toggle = () => {
    const set = readSet();
    const next = !set.has(progressKey);
    if (next) set.add(progressKey); else set.delete(progressKey);
    writeSet(set);
    setDone(next);
    window.dispatchEvent(new CustomEvent('svapna:progress', { detail: { key: progressKey, done: next } }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`mono text-[9px] uppercase tracking-widest px-3 py-2 transition-colors md:mt-2 ${done ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
      style={{ border: '0.5px solid #000' }}
      aria-pressed={done}
    >
      {done ? '✓ Complete' : 'Mark complete'}
    </button>
  );
}
