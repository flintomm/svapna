import React, { useState, useEffect } from 'react';
import { historyUnits, curriculumPhases, library, homeQuote, themes, aboutPages } from './content.js';
import timelineData from './data/timeline.json';
import quotesData from './data/quotes.json';

export default function DreamYogaApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const nav = [
    { id: 'home', label: 'Home', num: '01' },
    { id: 'history', label: 'History', num: '02' },
    { id: 'curriculum', label: 'Curriculum', num: '03' },
    { id: 'community', label: 'Community', num: '04' },
    { id: 'library', label: 'Library', num: '05' },
    { id: 'support', label: 'Support', num: '06' },
  ];

  const goTo = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <style>{`
        * { border-radius: 0 !important; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
        html { -webkit-text-size-adjust: 100%; }
        body { overscroll-behavior-y: none; }
        .display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }
        .grid-bg {
          background-image:
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        @media (min-width: 768px) {
          .grid-bg { background-size: 80px 80px; }
        }
        .vert-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
        .fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-slide {
          animation: menuSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-item {
          animation: menuItemFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes menuItemFade {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hairline-b { border-bottom: 0.5px solid #000; }
        .hairline-t { border-top: 0.5px solid #000; }
        .hairline-r { border-right: 0.5px solid #000; }
        .hairline-l { border-left: 0.5px solid #000; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* TOP BAR */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 hairline-b">
        <div className="flex items-center justify-between px-5 md:px-8 py-3.5 md:py-4">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="mono text-[10px] uppercase tracking-widest">∴ Svapna</div>
            <div className="mono text-[10px] uppercase tracking-widest text-neutral-400 hidden sm:block">Est. MMXXVI</div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {nav.map(item => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeSection === item.id ? 'text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                <span className="mr-1.5 opacity-50">{item.num}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-end gap-1.5 w-10 h-10 -mr-2"
            aria-label="Menu"
          >
            <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? 'w-6 translate-y-[7px] rotate-45' : 'w-6'}`} />
            <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? 'w-0' : 'w-4'}`} />
            <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? 'w-6 -translate-y-[7px] -rotate-45' : 'w-6'}`} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 lg:hidden menu-slide overflow-y-auto">
          <div className="hairline-b px-5 py-4">
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Index</p>
          </div>
          {nav.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className="menu-item w-full text-left hairline-b px-5 py-6 flex items-baseline justify-between active:bg-neutral-100 transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-baseline gap-5">
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-400 w-6">{item.num}</span>
                <span className={`display text-4xl ${activeSection === item.id ? 'italic' : ''}`}>{item.label}</span>
              </div>
              <span className="mono text-[10px] text-neutral-400">→</span>
            </button>
          ))}
          <div className="px-5 py-8">
            <p className="display text-xl italic text-neutral-500 leading-relaxed">
              "All that we see or seem<br />is but a dream within a dream."
            </p>
            <p className="mono text-[9px] uppercase tracking-widest mt-4 text-neutral-400">— E. A. Poe, 1849</p>
          </div>
        </div>
      )}

      {/* SIDE RAIL — desktop only */}
      <div className="fixed left-0 top-0 bottom-0 w-12 hairline-r z-40 flex-col items-center justify-between py-20 hidden xl:flex">
        <div className="vert-text mono text-[9px] uppercase tracking-[0.3em] text-neutral-500">
          A study in dream and dissolution
        </div>
        <div className="mono text-[9px] text-neutral-400">
          {String(Math.min(99, Math.floor(scrollY / 20))).padStart(2, '0')}
        </div>
      </div>

      {/* MAIN */}
      <main className="xl:pl-12 pt-14 md:pt-16">
        {activeSection === 'home' && <HomeSection goTo={goTo} />}
        {activeSection === 'history' && <HistorySection />}
        {activeSection === 'curriculum' && <CurriculumSection goTo={goTo} />}
        {activeSection === 'community' && <CommunitySection />}
        {activeSection === 'library' && <LibrarySection />}
        {activeSection === 'support' && <SupportSection />}
        {activeSection.startsWith('about-') && <AboutSection page={activeSection.slice(6)} goTo={goTo} />}
        {activeSection.startsWith('curriculum-') && <PhaseDetail phaseIndex={parseInt(activeSection.slice(11), 10) - 1} goTo={goTo} />}
      </main>

      {/* FOOTER */}
      <footer className="xl:ml-12 hairline-t mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-6 p-8 md:p-12 hairline-b md:hairline-r md:border-b-0">
            <p className="display text-2xl md:text-3xl italic leading-tight">
              "All that we see or seem<br />is but a dream within a dream."
            </p>
            <p className="mono text-[10px] uppercase tracking-widest mt-5 md:mt-6 text-neutral-500">— E. A. Poe, 1849</p>
          </div>
          <div className="md:col-span-3 p-8 md:p-12 hairline-b md:hairline-r md:border-b-0">
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">Index</p>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => goTo('about-colophon')} className="text-left hover:italic transition-all">Colophon</button></li>
              <li><button onClick={() => goTo('about-conduct')} className="text-left hover:italic transition-all">Code of Conduct</button></li>
              <li><button onClick={() => goTo('about-acknowledgments')} className="text-left hover:italic transition-all">Acknowledgments</button></li>
              <li><button onClick={() => goTo('about-contact')} className="text-left hover:italic transition-all">Contact</button></li>
            </ul>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">Offered Freely</p>
            <p className="text-sm leading-relaxed">
              In the tradition of dāna. Take what serves you. Give if you can.
            </p>
          </div>
        </div>
        <div className="hairline-t px-5 md:px-12 py-4 flex flex-col sm:flex-row justify-between gap-2 mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">
          <span>© Svapna Project</span>
          <span>Vol. I / Iss. I</span>
          <span>MMXXVI</span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ num, kicker, title, sub }) {
  return (
    <div className="grid grid-cols-12 hairline-b fade-in">
      <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
        <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">{num}</span>
      </div>
      <div className="col-span-9 md:col-span-10 p-5 md:p-8">
        <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">{kicker}</p>
        <h1 className="display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight">{title}</h1>
        {sub && <p className="display text-lg md:text-2xl italic mt-4 md:mt-6 text-neutral-600 max-w-2xl">{sub}</p>}
      </div>
    </div>
  );
}

function HomeSection({ goTo }) {
  return (
    <div className="fade-in">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-7 p-6 sm:p-10 md:p-16 lg:p-20 hairline-b md:hairline-r md:border-b-0 flex flex-col justify-between min-h-[70vh] md:min-h-[80vh]">
          <div>
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-6 md:mb-8">A Course in Six Movements</p>
            <h1 className="display text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight">
              Awaken<br /><span className="italic">within</span><br />the dream.
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 md:mt-16 pt-6 md:pt-8 hairline-t">
            <div>
              <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">I.</p>
              <p className="text-sm mt-2 leading-snug">Ancient practice<br />from the Himalayan tantras</p>
            </div>
            <div>
              <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">II.</p>
              <p className="text-sm mt-2 leading-snug">Modern science<br />from the sleep laboratory</p>
            </div>
            <div>
              <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">III.</p>
              <p className="text-sm mt-2 leading-snug">Offered freely<br />to anyone who will listen</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 grid-bg p-6 sm:p-10 md:p-12 flex flex-col justify-between relative min-h-[60vh] md:min-h-0">
          <div className="absolute top-6 right-6 md:top-12 md:right-12 mono text-[9px] uppercase tracking-widest text-neutral-500">
            FIG. 01
          </div>
          <div className="flex-1 flex items-center justify-center py-8">
            <svg viewBox="0 0 300 300" className="w-full max-w-[260px] sm:max-w-sm">
              <circle cx="150" cy="150" r="140" fill="none" stroke="black" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="100" fill="none" stroke="black" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="black" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="20" fill="none" stroke="black" strokeWidth="0.5" />
              <line x1="10" y1="150" x2="290" y2="150" stroke="black" strokeWidth="0.5" />
              <line x1="150" y1="10" x2="150" y2="290" stroke="black" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="250" y2="250" stroke="black" strokeWidth="0.5" strokeDasharray="2,4" />
              <line x1="250" y1="50" x2="50" y2="250" stroke="black" strokeWidth="0.5" strokeDasharray="2,4" />
              <text x="155" y="20" fontSize="8" fontFamily="JetBrains Mono">jāgrat</text>
              <text x="155" y="295" fontSize="8" fontFamily="JetBrains Mono">turīya</text>
              <text x="5" y="155" fontSize="8" fontFamily="JetBrains Mono">svapna</text>
              <text x="255" y="155" fontSize="8" fontFamily="JetBrains Mono">suṣupti</text>
              <circle cx="150" cy="150" r="3" fill="black" />
            </svg>
          </div>
          <div className="hairline-t pt-4 mt-6 md:mt-8">
            <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">
              The Four States — Mandukya Upanishad
            </p>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">An Introduction</span>
        </div>
        <div className="md:col-span-10 p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <p className="display text-xl md:text-2xl leading-relaxed italic">
            For three millennia, contemplatives have entered the dream knowingly — not to escape waking life, but to understand its nature.
          </p>
          <p className="text-base leading-loose">
            This course gathers what they learned. It draws from the Tibetan tradition of <em>milam</em>, from Bön sleep yoga, from Hindu commentaries on the four states, and from the modern laboratory work begun at Stanford in the 1980s. It asks nothing of you but attention. It costs nothing. It is what was given to us, passed forward.
          </p>
        </div>
      </div>

      {/* PULL QUOTE */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Epigraph</span>
        </div>
        <div className="md:col-span-10 p-8 md:p-16 lg:p-20">
          <p className="display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug md:leading-tight italic">
            &ldquo;{homeQuote.text}&rdquo;
          </p>
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            <span className="mono text-[10px] uppercase tracking-widest">— {homeQuote.attribution}</span>
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1 sm:mt-0">{homeQuote.citation}</span>
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        <FeatureCard num="02" title="History" desc="Six units tracing the practice from the Upanishads to the sleep lab." onClick={() => goTo('history')} />
        <FeatureCard num="03" title="Curriculum" desc="Eight to twelve weeks of progressive practice, from dream recall to the bardo." onClick={() => goTo('curriculum')} />
        <FeatureCard num="04" title="Community" desc="Forums, dream circles, and practice partners. Peer-led, lightly moderated." onClick={() => goTo('community')} last />
      </div>
    </div>
  );
}

function FeatureCard({ num, title, desc, last, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-8 md:p-12 ${!last ? 'md:hairline-r' : ''} hairline-b min-h-[280px] md:min-h-[400px] flex flex-col justify-between active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors cursor-pointer group`}
    >
      <div>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">§ {num}</span>
        <h3 className="display text-5xl md:text-6xl mt-6 md:mt-8 group-hover:italic transition-all">{title}</h3>
      </div>
      <div className="mt-8">
        <p className="text-sm leading-relaxed text-neutral-700 mb-5 md:mb-6">{desc}</p>
        <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-widest">
          <span>Enter</span>
          <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
        </div>
      </div>
    </button>
  );
}

// Map roman num "I"–"VI" → integer 1–6, used for filtering quotes & timeline.
const ROMAN_TO_INT = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };

function pickQuoteForUnit(unitNum) {
  // Return a representative quote for a given history unit (1–6).
  const matches = quotesData.quotes.filter(q => q.unit === unitNum);
  return matches[0] || null;
}

function HistorySection() {
  const [activeUnit, setActiveUnit] = useState('all');
  const sortedTimeline = [...timelineData.entries].sort((a, b) => a.sort_key - b.sort_key);
  const visibleTimeline = activeUnit === 'all'
    ? sortedTimeline
    : sortedTimeline.filter(e => e.unit === activeUnit);

  return (
    <div className="fade-in">
      <SectionHeader num="§ 02" kicker="Roots of the Practice" title="History." sub="Three millennia in six movements, from the cave to the laboratory." />

      {/* UNIT CARDS — each carries a representative quote */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {historyUnits.map((u, i) => {
          const unitInt = ROMAN_TO_INT[u.num];
          const quote = pickQuoteForUnit(unitInt);
          return (
            <div
              key={i}
              className="p-6 sm:p-8 md:p-10 hairline-b sm:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(3n+2)]:hairline-r lg:[&:nth-child(3n)]:border-r-0 flex flex-col justify-between active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group"
            >
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="display text-4xl md:text-5xl italic">{u.num}.</span>
                  <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">{u.date}</span>
                </div>
                <h3 className="display text-2xl md:text-3xl mt-6 md:mt-8 leading-tight">{u.title}</h3>
                <p className="text-sm leading-relaxed mt-5 md:mt-6 text-neutral-700">{u.blurb}</p>
              </div>
              {quote && (
                <div className="hairline-t pt-4 mt-6">
                  <p className="display text-base md:text-lg italic leading-snug text-neutral-800">&ldquo;{truncate(quote.text, 180)}&rdquo;</p>
                  <p className="mono text-[9px] uppercase tracking-widest mt-3 text-neutral-500">— {quote.attribution}</p>
                </div>
              )}
              <div className="hairline-t pt-4 mt-4">
                <p className="mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Figures</p>
                <p className="text-xs leading-relaxed text-neutral-600">{u.figures.join(' · ')}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TIMELINE */}
      <div className="hairline-b">
        <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 02</p>
          <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Timeline.</h2>
          <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
            {timelineData.entries.length} dated events across the six units. Filter by unit.
          </p>
        </div>
        <div className="px-5 md:px-12 py-4 hairline-t flex flex-wrap gap-2">
          <UnitFilterChip active={activeUnit === 'all'} onClick={() => setActiveUnit('all')} label="All" />
          {[1, 2, 3, 4, 5, 6].map(n => (
            <UnitFilterChip
              key={n}
              active={activeUnit === n}
              onClick={() => setActiveUnit(n)}
              label={`${['I','II','III','IV','V','VI'][n-1]}. ${timelineData.units[n]}`}
            />
          ))}
        </div>
        <div>
          {visibleTimeline.map((entry, i) => (
            <div key={i} className="grid grid-cols-12 hairline-t py-4 md:py-5 px-5 md:px-12 hover:bg-neutral-50 transition-colors">
              <div className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-widest text-neutral-600 mb-1 md:mb-0">{entry.date}</div>
              <div className="col-span-12 md:col-span-2 mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1 md:mb-0">
                {timelineData.units[entry.unit]}
              </div>
              <div className="col-span-12 md:col-span-8">
                <p className="display text-lg md:text-xl leading-tight">{entry.title}</p>
                <p className="text-xs md:text-sm leading-relaxed text-neutral-600 mt-1 md:mt-2">{entry.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitFilterChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-2 transition-colors ${
        active ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
      }`}
      style={{ border: '0.5px solid #000' }}
    >
      {label}
    </button>
  );
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  // Cut at last word boundary before maxLen
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  return slice.slice(0, lastSpace > 0 ? lastSpace : maxLen).trimEnd() + '…';
}

// localStorage hook for module-completion progress.
// Returns [completed: Set<string>, toggle: (moduleNum) => void].
function useModuleProgress() {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem('svapna_progress');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const toggle = (moduleNum) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(moduleNum)) next.delete(moduleNum); else next.add(moduleNum);
      try { window.localStorage.setItem('svapna_progress', JSON.stringify([...next])); } catch {}
      return next;
    });
  };
  return [completed, toggle];
}

function CurriculumSection({ goTo }) {
  const [completed] = useModuleProgress();
  const phaseProgress = (phase) => {
    const done = phase.modules.filter(m => completed.has(m.num)).length;
    return { done, total: phase.modules.length };
  };
  const enter = (i) => goTo(`curriculum-${i + 1}`);

  return (
    <div className="fade-in">
      <SectionHeader num="§ 03" kicker="The Course" title="Curriculum." sub="Twelve weeks. Six phases. Each lesson: a reading, a practice, a prompt." />

      {/* Mobile: stacked card buttons */}
      <div className="md:hidden">
        {curriculumPhases.map((w, i) => {
          const p = phaseProgress(w);
          return (
            <button key={i} type="button" onClick={() => enter(i)} className="w-full text-left p-6 hairline-b active:bg-neutral-100 transition-colors">
              <div className="flex justify-between items-baseline">
                <span className="display text-4xl italic">{w.phase}.</span>
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">Wk. {w.weeks}</span>
              </div>
              <h3 className="display text-3xl mt-4">{w.title}</h3>
              <p className="text-sm leading-relaxed mt-4 text-neutral-700">{w.focus}</p>
              <div className="mt-5 flex justify-between items-baseline">
                <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">{w.practices.join(' · ')}</p>
              </div>
              <div className="mt-3 flex justify-between items-baseline">
                <span className="mono text-[9px] uppercase tracking-widest text-neutral-500">{p.done} of {p.total} complete</span>
                <span className="mono text-[10px] uppercase tracking-widest">Enter →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop: row buttons */}
      <div className="hidden md:block">
        {curriculumPhases.map((w, i) => {
          const p = phaseProgress(w);
          return (
            <button key={i} type="button" onClick={() => enter(i)} className="w-full text-left grid grid-cols-12 hairline-b hover:bg-neutral-50 transition-colors group">
              <div className="col-span-1 p-8 hairline-r flex items-center justify-center">
                <span className="display text-3xl italic">{w.phase}</span>
              </div>
              <div className="col-span-2 p-8 hairline-r flex items-center">
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">Wk. {w.weeks}</span>
              </div>
              <div className="col-span-3 p-8 hairline-r flex items-center">
                <h3 className="display text-4xl group-hover:italic transition-all">{w.title}</h3>
              </div>
              <div className="col-span-4 p-8 hairline-r flex items-center">
                <p className="text-sm leading-relaxed">{w.focus}</p>
              </div>
              <div className="col-span-2 p-8 flex items-center justify-between gap-4">
                <span className="mono text-[9px] uppercase tracking-widest text-neutral-500">{p.done}/{p.total}</span>
                <span className="mono text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhaseDetail({ phaseIndex, goTo }) {
  const phase = curriculumPhases[phaseIndex];
  const [completed, toggle] = useModuleProgress();
  if (!phase) return null;

  const prevIndex = phaseIndex > 0 ? phaseIndex - 1 : null;
  const nextIndex = phaseIndex < curriculumPhases.length - 1 ? phaseIndex + 1 : null;

  return (
    <div className="fade-in">
      {/* Crumbs / back link */}
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between">
        <button type="button" onClick={() => goTo('curriculum')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Curriculum
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">
          Phase {phase.phase} of VI · Wk. {phase.weeks}
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">§ 03 · {phase.phase}</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Phase {phase.phase} · {phase.weeks}</p>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">{phase.title}.</h1>
          <p className="mt-6 md:mt-10 text-base md:text-lg leading-loose max-w-3xl">{phase.synthesis}</p>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
            {phase.practices.map(p => (
              <span key={p} className="mono text-[9px] uppercase tracking-widest px-3 py-2 text-neutral-700" style={{ border: '0.5px solid rgba(0,0,0,0.3)' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Modules */}
      {phase.modules.map(m => (
        <ModuleCard key={m.num} module={m} done={completed.has(m.num)} onToggle={() => toggle(m.num)} />
      ))}

      {/* Phase nav */}
      <div className="hairline-b grid grid-cols-2">
        <div className="hairline-r p-5 md:p-8">
          {prevIndex !== null ? (
            <button type="button" onClick={() => goTo(`curriculum-${prevIndex + 1}`)} className="text-left w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">← Previous</p>
              <p className="display text-xl md:text-2xl mt-2">{curriculumPhases[prevIndex].title}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">Beginning</span>
          )}
        </div>
        <div className="p-5 md:p-8 text-right">
          {nextIndex !== null ? (
            <button type="button" onClick={() => goTo(`curriculum-${nextIndex + 1}`)} className="text-right w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Next →</p>
              <p className="display text-xl md:text-2xl mt-2">{curriculumPhases[nextIndex].title}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">End of course</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module: m, done, onToggle }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-12 hairline-b">
      {/* Module number rail */}
      <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0 flex md:flex-col justify-between md:justify-start gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Module</p>
          <p className="display text-5xl md:text-6xl mt-1 md:mt-2">{m.num}</p>
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-2 md:mt-3">{m.week}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`mono text-[9px] uppercase tracking-widest px-3 py-2 transition-colors ${done ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'} md:self-start`}
          style={{ border: '0.5px solid #000' }}
          aria-pressed={done}
        >
          {done ? '✓ Complete' : 'Mark complete'}
        </button>
      </div>

      {/* Module body */}
      <div className="md:col-span-10 p-6 md:p-12 space-y-8 md:space-y-10">
        <h2 className="display text-3xl sm:text-4xl md:text-5xl leading-tight">{m.title}</h2>

        {/* Objectives */}
        <div>
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Learning Objectives</p>
          <ol className="space-y-2 md:space-y-3">
            {m.objectives.map((o, i) => (
              <li key={i} className="text-base leading-relaxed flex gap-4">
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1.5 shrink-0 w-6">{String(i + 1).padStart(2, '0')}</span>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Readings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div>
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">Primary Reading</p>
            <p className="display text-lg italic leading-snug">{m.primary_reading}</p>
          </div>
          {m.secondary_reading && (
            <div>
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">Secondary Reading</p>
              <p className="display text-lg italic leading-snug">{m.secondary_reading}</p>
            </div>
          )}
        </div>

        {/* Practice */}
        <div>
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Practice</p>
          <p className="text-base leading-loose">{m.practice}</p>
        </div>

        {/* Prompt */}
        <div className="hairline-t pt-6 md:pt-8">
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Journal Prompt</p>
          <p className="display text-lg md:text-xl italic leading-relaxed text-neutral-800">&ldquo;{m.prompt}&rdquo;</p>
        </div>

        {/* Key terms */}
        <div className="hairline-t pt-6">
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">Key Terms</p>
          <div className="flex flex-wrap gap-2">
            {m.key_terms.map(t => (
              <span key={t} className="mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 text-neutral-700" style={{ border: '0.5px solid rgba(0,0,0,0.3)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CommunitySection() {
  const items = [
    { num: 'i.', title: 'Forums', body: 'Organized by topic — induction, interpretation, tradition, science — and by experience level. Beginners and adepts have separate rooms by default, with a shared commons.' },
    { num: 'ii.', title: 'Dream Circles', body: 'Small opt-in groups of eight to twelve. Members share dreams. Witnessing without interpretation, unless invited. Asynchronous, so time zones do not separate us.' },
    { num: 'iii.', title: 'Practice Partners', body: 'A matching system that pairs members working on similar techniques. Accountability without obligation. Either of you can step away.' },
    { num: 'iv.', title: 'Code of Conduct', body: 'Respect for personal experience, cultural traditions, and the vulnerability of sharing dreams. No interpretation without invitation. No proselytizing. No advice unless asked.' },
  ];
  return (
    <div className="fade-in">
      <SectionHeader num="§ 04" kicker="Together, Asynchronously" title="Community." sub="Peer-led. Lightly moderated. Built to outlive its founders." />
      <div className="grid grid-cols-1 md:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className={`p-6 sm:p-8 md:p-12 hairline-b ${i % 2 === 0 ? 'md:hairline-r' : ''}`}>
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{it.num}</span>
            <h3 className="display text-4xl md:text-5xl mt-3 md:mt-4">{it.title}</h3>
            <p className="mt-5 md:mt-6 leading-relaxed text-neutral-700 text-sm md:text-base">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LibrarySection() {
  return (
    <div className="fade-in">
      <SectionHeader num="§ 05" kicker="Selected Readings" title="Library." sub="Primary sources, contemporary studies, and the papers that anchor the science." />
      <BibliographyBlock />
      <ThemesBlock />
      <PullQuotesBlock />
    </div>
  );
}

function BibliographyBlock() {
  return (
    <div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        {library.map((item, i) => (
          <div key={i} className="hairline-b p-5 active:bg-neutral-100 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{item.type}</span>
              <span className="mono text-[10px] text-neutral-500">{item.year}</span>
            </div>
            <h3 className="display text-xl italic leading-tight mt-2">{item.title}</h3>
            <p className="text-sm mt-2 text-neutral-700">{item.author}</p>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block hairline-b">
        <div className="grid grid-cols-12 hairline-b mono text-[10px] uppercase tracking-widest text-neutral-500 py-4 px-8">
          <div className="col-span-2">Type</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Author</div>
          <div className="col-span-1 text-right">Year</div>
        </div>
        {library.map((item, i) => (
          <div key={i} className="grid grid-cols-12 hairline-b py-5 px-8 hover:bg-neutral-50 transition-colors">
            <div className="col-span-2 mono text-[10px] uppercase tracking-widest text-neutral-500 pt-1">{item.type}</div>
            <div className="col-span-6 display text-xl md:text-2xl italic leading-tight">{item.title}</div>
            <div className="col-span-3 text-sm pt-1">{item.author}</div>
            <div className="col-span-1 text-right mono text-xs pt-1">{item.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemesBlock() {
  return (
    <div className="hairline-b">
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 03</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Themes.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          Fourteen cross-cutting concerns that recur across the corpus. Each appears in dozens of sections across the primary texts.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hairline-t">
        {themes.map((t, i) => (
          <div
            key={t.id}
            className="p-6 md:p-8 hairline-b sm:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(3n+1)]:hairline-r lg:[&:nth-child(3n+2)]:hairline-r lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-child(even)]:border-r-0"
          >
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">№ {String(i + 1).padStart(2, '0')}</span>
              <span className="mono text-[9px] uppercase tracking-widest text-neutral-400">{t.sources} sources</span>
            </div>
            <h3 className="display text-2xl md:text-3xl mt-4 leading-tight">{t.label}</h3>
            <p className="text-sm leading-relaxed mt-3 md:mt-4 text-neutral-700">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PullQuotesBlock() {
  // Show all 30 quotes, filterable by tradition.
  const traditions = Array.from(new Set(quotesData.quotes.map(q => q.tradition))).sort();
  const [activeTradition, setActiveTradition] = useState('all');
  const visible = activeTradition === 'all'
    ? quotesData.quotes
    : quotesData.quotes.filter(q => q.tradition === activeTradition);

  return (
    <div>
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 04</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Pull-quotes.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          {quotesData.quotes.length} curated passages from the corpus, with citations. Filter by tradition.
        </p>
      </div>
      <div className="px-5 md:px-12 py-4 hairline-t hairline-b flex flex-wrap gap-2">
        <UnitFilterChip active={activeTradition === 'all'} onClick={() => setActiveTradition('all')} label="All" />
        {traditions.map(t => (
          <UnitFilterChip
            key={t}
            active={activeTradition === t}
            onClick={() => setActiveTradition(t)}
            label={t}
          />
        ))}
      </div>
      <div>
        {visible.map((q) => (
          <div key={q.id} className="hairline-b px-5 md:px-12 py-8 md:py-10">
            <p className="display text-lg md:text-2xl italic leading-snug md:leading-relaxed text-neutral-800">&ldquo;{q.text}&rdquo;</p>
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
              <span className="mono text-[10px] uppercase tracking-widest">— {q.attribution}</span>
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{q.citation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportSection() {
  return (
    <div className="fade-in">
      <SectionHeader num="§ 06" kicker="Dāna — The Practice of Generosity" title="Support." sub="Everything is free. If it serves you, you may pass something forward." />
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 hairline-b md:hairline-r">
          <p className="display text-xl sm:text-2xl md:text-3xl italic leading-relaxed">
            The dream-yoga traditions were never sold. They were transmitted, hand to hand, in exchange for whatever the student could offer — sometimes nothing.
          </p>
          <p className="mt-6 md:mt-8 leading-loose text-neutral-700 text-sm md:text-base">
            We keep that arrangement. The course, the history, the community — open to anyone. No tiers, no premium, no paywall, no scarcity. If the work has been useful, you can buy us a coffee. Once we are sustainable, your contribution rolls forward as a coffee for someone else — though access was never withheld in the first place. The gesture is what matters: <em>I received, and now I give.</em>
          </p>
        </div>
        <div className="md:col-span-5 p-6 sm:p-10 md:p-12 hairline-b flex flex-col justify-between gap-10">
          <div>
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Running Total</p>
            <p className="display text-6xl md:text-7xl mt-3 md:mt-4">$ 0</p>
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-2">contributed to date</p>
          </div>
          <div className="space-y-3">
            <button className="w-full py-4 px-5 md:px-6 mono text-[10px] uppercase tracking-widest active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-colors text-left flex justify-between items-center" style={{ border: '0.5px solid #000' }}>
              <span>Buy a coffee</span>
              <span>→</span>
            </button>
            <button className="w-full py-4 px-5 md:px-6 mono text-[10px] uppercase tracking-widest active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-colors text-left flex justify-between items-center" style={{ border: '0.5px solid #000' }}>
              <span>Buy someone a coffee</span>
              <span>→</span>
            </button>
          </div>
        </div>
        <div className="md:col-span-12 p-6 sm:p-10 md:p-12 hairline-b">
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-5 md:mb-6">Where contributions go</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            <div>
              <p className="display text-3xl md:text-4xl">i.</p>
              <p className="mt-2 md:mt-3 text-sm leading-relaxed">Hosting and infrastructure.</p>
            </div>
            <div>
              <p className="display text-3xl md:text-4xl">ii.</p>
              <p className="mt-2 md:mt-3 text-sm leading-relaxed">Audio and video production.</p>
            </div>
            <div>
              <p className="display text-3xl md:text-4xl">iii.</p>
              <p className="mt-2 md:mt-3 text-sm leading-relaxed">Translation into other languages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutSection({ page, goTo }) {
  const data = aboutPages[page];
  if (!data) return null;
  const tabs = [
    { id: 'colophon', label: 'Colophon' },
    { id: 'conduct', label: 'Code of Conduct' },
    { id: 'acknowledgments', label: 'Acknowledgments' },
    { id: 'contact', label: 'Contact' },
  ];
  return (
    <div className="fade-in">
      <SectionHeader num="§ —" kicker={data.kicker} title={`${data.title}.`} />
      <div className="px-5 md:px-12 py-3 hairline-b flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(`about-${t.id}`)}
            className={`mono text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-2 transition-colors ${
              page === t.id ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            style={{ border: '0.5px solid #000' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">{data.title}</span>
        </div>
        <div className="md:col-span-10 p-6 md:p-12 max-w-3xl space-y-6 md:space-y-8">
          {data.paragraphs.map((p, i) => (
            <p key={i} className="text-base md:text-lg leading-loose">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
