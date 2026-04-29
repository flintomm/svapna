import { useState } from 'react';

// Generic filter chip island. Used by the history timeline and the library
// pull-quotes block. Items render server-side with data-filter attributes;
// the island just toggles which group is visible.
export default function Filter({ id, options, allLabel = 'All' }) {
  const [active, setActive] = useState('all');

  const apply = (value) => {
    setActive(value);
    const root = document.querySelector(`[data-filter-root="${id}"]`);
    if (!root) return;
    const items = root.querySelectorAll('[data-filter-value]');
    items.forEach(el => {
      const v = el.getAttribute('data-filter-value');
      el.style.display = value === 'all' || v === value ? '' : 'none';
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Chip active={active === 'all'} onClick={() => apply('all')}>{allLabel}</Chip>
      {options.map(opt => (
        <Chip key={opt.value} active={active === opt.value} onClick={() => apply(opt.value)}>
          {opt.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-2 transition-colors ${
        active ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
      }`}
      style={{ border: '0.5px solid #000' }}
    >
      {children}
    </button>
  );
}
