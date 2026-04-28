import React, { useState, useEffect } from 'react';
import { historyUnits, curriculumModules, library, articles, homeQuote, themes, aboutPages, moduleDeepening } from './content.js';
import { lessonsByModule, getLesson, welcomeLesson, glossary } from './lessons.js';
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
        {activeSection === 'history' && <HistorySection goTo={goTo} />}
        {activeSection === 'curriculum' && <CurriculumSection goTo={goTo} />}
        {activeSection === 'community' && <CommunitySection />}
        {activeSection === 'library' && <LibrarySection goTo={goTo} />}
        {activeSection === 'support' && <SupportSection />}
        {activeSection.startsWith('about-') && <AboutSection page={activeSection.slice(6)} goTo={goTo} />}
        {activeSection.startsWith('curriculum-') && <ModuleDetail moduleIndex={parseInt(activeSection.slice(11), 10) - 1} goTo={goTo} />}
        {activeSection === 'lesson-welcome' && <WelcomeLessonPage goTo={goTo} />}
        {activeSection === 'glossary' && <GlossaryPage goTo={goTo} />}
        {activeSection.startsWith('lesson-') && activeSection !== 'lesson-welcome' && (() => {
          const rest = activeSection.slice(7); // 'M-L', e.g. '1-3'
          const [m, l] = rest.split('-');
          return <LessonDetail moduleNum={m} lessonNum={l} goTo={goTo} />;
        })()}
        {activeSection.startsWith('article-') && (() => {
          const id = activeSection.slice(8);
          return <ArticleReader articleId={id} goTo={goTo} />;
        })()}
        {activeSection.startsWith('theme-') && <ThemeDetail themeId={activeSection.slice(6)} goTo={goTo} />}
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
              <li><button onClick={() => goTo('glossary')} className="text-left hover:italic transition-all">Glossary</button></li>
              <li><button onClick={() => goTo('about-conduct')} className="text-left hover:italic transition-all">Code of Conduct</button></li>
              <li><button onClick={() => goTo('about-acknowledgments')} className="text-left hover:italic transition-all">Acknowledgments</button></li>
              <li><button onClick={() => goTo('about-contact')} className="text-left hover:italic transition-all">Contact</button></li>
            </ul>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">Dāna</p>
            <p className="text-sm leading-relaxed">
              In the tradition of giving. Take what serves. Pass forward when able.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-10 md:mt-16 pt-6 md:pt-8 hairline-t">
            <div>
              <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">I.</p>
              <p className="text-sm mt-2 leading-snug">Ancient practice<br />from the Himalayan tantras</p>
            </div>
            <div>
              <p className="mono text-[9px] uppercase tracking-widest text-neutral-500">II.</p>
              <p className="text-sm mt-2 leading-snug">Modern science<br />from the sleep laboratory</p>
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
            This course gathers what they learned. It draws from the Tibetan tradition of <em>milam</em>, from Bön sleep yoga, from Hindu commentaries on the four states, and from the modern laboratory work begun at Stanford in the 1980s. It asks for nothing but attention. The work was given to us, and it passes forward.
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
        <FeatureCard num="03" title="Curriculum" desc="Six modules, forty-seven short lessons. The history and the science of the practice. Self-paced." onClick={() => goTo('curriculum')} />
        <FeatureCard num="04" title="Community" desc="An asynchronous forum with dream-sharing circles. Peer-led, lightly moderated." onClick={() => goTo('community')} last />
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
        <h3 className="display text-5xl md:text-5xl lg:text-6xl mt-6 md:mt-8 group-hover:italic transition-all break-words leading-[0.95]">{title}</h3>
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

function HistorySection({ goTo }) {
  const [activeUnit, setActiveUnit] = useState('all');
  const sortedTimeline = [...timelineData.entries].sort((a, b) => a.sort_key - b.sort_key);
  const visibleTimeline = activeUnit === 'all'
    ? sortedTimeline
    : sortedTimeline.filter(e => e.unit === activeUnit);

  return (
    <div className="fade-in">
      <SectionHeader num="§ 02" kicker="Roots of the Practice" title="History." sub="Three millennia, in six movements." />

      {/* UNIT CARDS — each carries a representative quote and links to its
          curriculum module (history unit N maps to curriculum module N). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {historyUnits.map((u, i) => {
          const unitInt = ROMAN_TO_INT[u.num];
          const quote = pickQuoteForUnit(unitInt);
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(`curriculum-${unitInt}`)}
              className="text-left p-6 sm:p-8 md:p-10 hairline-b sm:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(3n+2)]:hairline-r lg:[&:nth-child(3n)]:border-r-0 flex flex-col justify-between active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group"
            >
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="display text-4xl md:text-5xl italic">{u.num}.</span>
                  <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">{u.date}</span>
                </div>
                <h3 className="display text-2xl md:text-3xl mt-6 md:mt-8 leading-tight group-hover:italic transition-all">{u.title}</h3>
                <p className="text-sm leading-relaxed mt-5 md:mt-6 text-neutral-700">{u.blurb}</p>
              </div>
              {quote && (
                <div className="hairline-t pt-4 mt-6">
                  <p className="display text-base md:text-lg italic leading-snug text-neutral-800">&ldquo;{truncate(quote.text, 180)}&rdquo;</p>
                  <p className="mono text-[9px] uppercase tracking-widest mt-3 text-neutral-500">— {quote.attribution}</p>
                </div>
              )}
              <div className="hairline-t pt-4 mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Figures</p>
                  <p className="text-xs leading-relaxed text-neutral-600">{u.figures.join(' · ')}</p>
                </div>
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:translate-x-1 transition-transform shrink-0">Module →</span>
              </div>
            </button>
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
          {visibleTimeline.map((entry, i) => {
            const article = articles[entry.unit - 1];
            return (
              <button
                key={i}
                type="button"
                onClick={() => article && goTo(`article-${article.id}`)}
                disabled={!article}
                className="w-full text-left grid grid-cols-12 hairline-t py-4 md:py-5 px-5 md:px-12 hover:bg-neutral-50 transition-colors group"
              >
                <div className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-widest text-neutral-600 mb-1 md:mb-0">{entry.date}</div>
                <div className="col-span-12 md:col-span-2 mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1 md:mb-0">
                  {timelineData.units[entry.unit]}
                </div>
                <div className="col-span-11 md:col-span-7">
                  <p className="display text-lg md:text-xl leading-tight group-hover:italic transition-all">{entry.title}</p>
                  <p className="text-xs md:text-sm leading-relaxed text-neutral-600 mt-1 md:mt-2">{entry.summary}</p>
                </div>
                <div className="col-span-1 md:col-span-1 mono text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all text-right self-start">→</div>
              </button>
            );
          })}
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

// localStorage hook for lesson-completion progress.
// Each lesson is keyed `${moduleNum}-${lessonNum}` (e.g. '1-3').
function useLessonProgress() {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem('svapna_progress');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const toggle = (key) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      try { window.localStorage.setItem('svapna_progress', JSON.stringify([...next])); } catch {}
      return next;
    });
  };
  return [completed, toggle];
}

function CurriculumSection({ goTo }) {
  const [completed] = useLessonProgress();
  const moduleProgress = (m) => {
    const lessons = lessonsByModule[String(parseInt(m.num, 10))] || [];
    const done = lessons.filter(l => completed.has(`${l.moduleNum}-${l.lessonNum}`)).length;
    return { done, total: lessons.length };
  };
  const enter = (i) => goTo(`curriculum-${i + 1}`);

  return (
    <div className="fade-in">
      <SectionHeader num="§ 03" kicker="The Course" title="Curriculum." sub="Six modules, forty-seven short lessons. Self-paced." />

      {/* Welcome / orientation */}
      <button
        type="button"
        onClick={() => goTo('lesson-welcome')}
        className="w-full text-left p-6 md:p-10 hairline-b active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group"
      >
        <div className="flex justify-between items-baseline">
          <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">§ 00 · Orientation</span>
          <span className="mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:translate-x-1 transition-transform">Read →</span>
        </div>
        <h3 className="display text-3xl md:text-4xl mt-3 group-hover:italic transition-all">Welcome — How to read this course.</h3>
        <p className="text-sm leading-relaxed mt-3 text-neutral-700 max-w-3xl">An orientation before the work begins. What the course is, how it is built, and how it would like to be read.</p>
      </button>

      {/* Mobile: stacked module cards */}
      <div className="md:hidden">
        {curriculumModules.map((m, i) => {
          const p = moduleProgress(m);
          return (
            <button key={m.num} type="button" onClick={() => enter(i)} className="w-full text-left p-6 hairline-b active:bg-neutral-100 transition-colors">
              <div className="flex justify-between items-baseline">
                <span className="display text-4xl italic">{m.roman}.</span>
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{m.lessonCount} lessons</span>
              </div>
              <h3 className="display text-3xl mt-4 leading-tight">{m.title}</h3>
              <p className="text-sm leading-relaxed mt-4 text-neutral-700">{m.blurb}</p>
              <div className="mt-5 flex justify-between items-baseline">
                <span className="mono text-[9px] uppercase tracking-widest text-neutral-500">{p.done} of {p.total} complete</span>
                <span className="mono text-[10px] uppercase tracking-widest">Enter →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop: row buttons */}
      <div className="hidden md:block">
        {curriculumModules.map((m, i) => {
          const p = moduleProgress(m);
          return (
            <button key={m.num} type="button" onClick={() => enter(i)} className="w-full text-left grid grid-cols-12 hairline-b hover:bg-neutral-50 transition-colors group">
              <div className="col-span-1 p-8 hairline-r flex items-center justify-center">
                <span className="display text-3xl italic">{m.roman}</span>
              </div>
              <div className="col-span-2 p-8 hairline-r flex items-center">
                <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{m.lessonCount} lessons</span>
              </div>
              <div className="col-span-3 p-8 hairline-r flex items-center">
                <h3 className="display text-3xl group-hover:italic transition-all leading-tight">{m.title}</h3>
              </div>
              <div className="col-span-4 p-8 hairline-r flex items-center">
                <p className="text-sm leading-relaxed">{m.blurb}</p>
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

function ModuleDetail({ moduleIndex, goTo }) {
  const mod = curriculumModules[moduleIndex];
  const [completed, toggle] = useLessonProgress();
  if (!mod) return null;
  const lessons = lessonsByModule[String(parseInt(mod.num, 10))] || [];
  const deep = moduleDeepening[mod.num];
  const themeLookup = Object.fromEntries(themes.map(t => [t.id, t]));

  const prevIndex = moduleIndex > 0 ? moduleIndex - 1 : null;
  const nextIndex = moduleIndex < curriculumModules.length - 1 ? moduleIndex + 1 : null;

  return (
    <div className="fade-in">
      {/* Crumbs / back link */}
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between">
        <button type="button" onClick={() => goTo('curriculum')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Curriculum
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">
          Module {mod.roman} of VI · {mod.lessonCount} lessons
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">§ 03 · {mod.roman}</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Module {mod.roman} · {mod.lessonCount} lessons</p>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">{mod.title}.</h1>
          <p className="display text-lg md:text-2xl italic mt-4 md:mt-6 text-neutral-600 max-w-3xl leading-snug">{mod.blurb}</p>
        </div>
      </div>

      {/* Module overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Overview</span>
        </div>
        <div className="md:col-span-10 p-6 md:p-12">
          <p className="text-base md:text-lg leading-loose max-w-3xl">{mod.overview}</p>
        </div>
      </div>

      {/* Lesson list */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Lessons</span>
        </div>
        <div className="md:col-span-10">
          {lessons.length === 0 && (
            <div className="p-6 md:p-12">
              <p className="display text-lg md:text-xl italic text-neutral-600 leading-snug">Lessons in preparation.</p>
            </div>
          )}
          {lessons.map((l, i) => {
            const key = `${l.moduleNum}-${l.lessonNum}`;
            const done = completed.has(key);
            return (
              <div key={key} className="grid grid-cols-12 hairline-b">
                <button
                  type="button"
                  onClick={() => goTo(`lesson-${l.moduleNum}-${l.lessonNum}`)}
                  className="col-span-10 md:col-span-11 text-left px-5 md:px-8 py-5 md:py-6 hover:bg-neutral-50 transition-colors group flex items-baseline gap-4 md:gap-6"
                >
                  <span className="mono text-[10px] uppercase tracking-widest text-neutral-400 w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 min-w-0">
                    <span className="display text-lg md:text-2xl leading-snug block group-hover:italic transition-all">{l.title}</span>
                    {l.kicker && (
                      <span className="display text-sm md:text-base text-neutral-500 leading-snug block mt-1">
                        {renderInline(l.kicker, `klk-${l.moduleNum}-${l.lessonNum}`)}
                      </span>
                    )}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:translate-x-1 transition-transform hidden md:inline">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`col-span-2 md:col-span-1 hairline-l flex items-center justify-center mono text-sm transition-colors ${done ? 'bg-black text-white' : 'text-neutral-400 hover:bg-neutral-100'}`}
                  aria-pressed={done}
                  aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {done ? '✓' : '○'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Article cross-link */}
      {deep?.article_link && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Article</span>
          </div>
          <div className="md:col-span-10">
            <button
              type="button"
              onClick={() => goTo(`article-${deep.article_link.id}`)}
              className="w-full text-left grid grid-cols-12 hairline-b py-3 md:py-4 px-5 md:px-8 hover:bg-neutral-50 transition-colors group"
            >
              <div className="col-span-12 sm:col-span-3 mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1 sm:mb-0">
                Library · Articles
              </div>
              <div className="col-span-12 sm:col-span-8 display text-base md:text-lg italic leading-snug">{deep.article_link.label}</div>
              <div className="col-span-12 sm:col-span-1 mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:translate-x-1 transition-transform sm:text-right">→</div>
            </button>
          </div>
        </div>
      )}

      {/* Primary sources */}
      {mod.primary_sources && mod.primary_sources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Primary Sources</span>
          </div>
          <div className="md:col-span-10 p-6 md:p-12 max-w-3xl">
            <ul className="space-y-2 md:space-y-3">
              {mod.primary_sources.map((s, i) => (
                <li key={i} className="display text-base md:text-lg italic leading-snug text-neutral-700">— {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Further reading (annotated) */}
      {deep?.further_reading && deep.further_reading.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Further Reading</span>
          </div>
          <div className="md:col-span-10 p-6 md:p-12">
            <ul className="space-y-5 md:space-y-6 max-w-3xl">
              {deep.further_reading.map((r, i) => (
                <li key={i}>
                  <p className="display text-base md:text-lg italic leading-snug">{r.title}</p>
                  <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{r.author}</p>
                  <p className="text-sm leading-relaxed text-neutral-600 mt-2">{r.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Themes engaged */}
      {deep?.theme_links && deep.theme_links.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Themes Engaged</span>
          </div>
          <div className="md:col-span-10 p-6 md:p-12">
            <div className="flex flex-wrap gap-2">
              {deep.theme_links.map(id => {
                const t = themeLookup[id];
                if (!t) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTo(`theme-${id}`)}
                    className="mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 text-neutral-700 hover:bg-black hover:text-white transition-colors"
                    style={{ border: '0.5px solid rgba(0,0,0,0.3)' }}
                  >
                    {t.label} →
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module nav */}
      <div className="hairline-b grid grid-cols-2">
        <div className="hairline-r p-5 md:p-8">
          {prevIndex !== null ? (
            <button type="button" onClick={() => goTo(`curriculum-${prevIndex + 1}`)} className="text-left w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">← Previous Module</p>
              <p className="display text-xl md:text-2xl mt-2">{curriculumModules[prevIndex].title}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">Beginning</span>
          )}
        </div>
        <div className="p-5 md:p-8 text-right">
          {nextIndex !== null ? (
            <button type="button" onClick={() => goTo(`curriculum-${nextIndex + 1}`)} className="text-right w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Next Module →</p>
              <p className="display text-xl md:text-2xl mt-2">{curriculumModules[nextIndex].title}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">End of course</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Tiny markdown renderer covering the lesson-file dialect: paragraphs,
// `## Subheading`, `*italic*`, `**bold**`, `_italic_`, and `> blockquote`.
// Bold takes priority over italic to handle `**...**` correctly.
function renderInline(text, keyPrefix) {
  const out = [];
  let i = 0;
  let buf = '';
  let key = 0;
  const flush = () => { if (buf) { out.push(buf); buf = ''; } };
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2) {
        flush();
        out.push(React.createElement('strong', { key: `${keyPrefix}-${key++}` }, text.slice(i + 2, end)));
        i = end + 2;
        continue;
      }
    }
    if (text[i] === '*') {
      const end = text.indexOf('*', i + 1);
      if (end > i + 1 && text[end + 1] !== '*') {
        flush();
        out.push(React.createElement('em', { key: `${keyPrefix}-${key++}` }, text.slice(i + 1, end)));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === '_') {
      const end = text.indexOf('_', i + 1);
      if (end > i + 1) {
        flush();
        out.push(React.createElement('em', { key: `${keyPrefix}-${key++}` }, text.slice(i + 1, end)));
        i = end + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

function MarkdownBody({ text }) {
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className="max-w-3xl space-y-5 md:space-y-6">
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="display text-2xl md:text-3xl leading-tight pt-4 md:pt-6">
              {renderInline(block.slice(3), `h-${i}`)}
            </h3>
          );
        }
        if (block.startsWith('# ')) {
          return (
            <h2 key={i} className="display text-3xl md:text-4xl leading-tight pt-4 md:pt-6">
              {renderInline(block.slice(2), `h-${i}`)}
            </h2>
          );
        }
        if (block.startsWith('> ')) {
          const inner = block.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ').trim();
          return (
            <blockquote key={i} className="pl-4 md:pl-5 my-2 italic text-neutral-700" style={{ borderLeft: '0.5px solid #000' }}>
              {renderInline(inner, `bq-${i}`)}
            </blockquote>
          );
        }
        return (
          <p key={i} className="text-base md:text-lg leading-loose">
            {renderInline(block, `p-${i}`)}
          </p>
        );
      })}
    </div>
  );
}

function LessonDetail({ moduleNum, lessonNum, goTo }) {
  const lesson = getLesson(moduleNum, lessonNum);
  const mod = curriculumModules.find(m => parseInt(m.num, 10) === parseInt(moduleNum, 10));
  const lessons = lessonsByModule[String(parseInt(moduleNum, 10))] || [];
  const idx = lessons.findIndex(l => parseInt(l.lessonNum, 10) === parseInt(lessonNum, 10));
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const [completed, toggle] = useLessonProgress();

  if (!lesson || !mod) {
    return (
      <div className="p-12 max-w-2xl">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-6">Lesson in preparation</p>
        <p className="display text-xl md:text-2xl italic text-neutral-600 leading-snug mb-8">The lesson text is being readied for publication.</p>
        <button type="button" onClick={() => goTo('curriculum')} className="mono text-[10px] uppercase tracking-widest underline">← Curriculum</button>
      </div>
    );
  }

  const moduleIndex = curriculumModules.indexOf(mod);
  const key = `${lesson.moduleNum}-${lesson.lessonNum}`;
  const done = completed.has(key);

  return (
    <div className="fade-in">
      {/* Crumbs */}
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between flex-wrap gap-3">
        <button type="button" onClick={() => goTo(`curriculum-${moduleIndex + 1}`)} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Module {mod.roman} · {mod.title}
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">
          Lesson {lesson.lessonNum} of {lessons.length}
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">§ 03 · {mod.roman}.{lesson.lessonNum}</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Module {mod.roman} · Lesson {lesson.lessonNum}</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">{lesson.title}</h1>
          {lesson.kicker && (
            <p className="display text-lg md:text-2xl mt-4 md:mt-6 text-neutral-600 max-w-3xl leading-snug">
              {renderInline(lesson.kicker, `lk-${lesson.moduleNum}-${lesson.lessonNum}`)}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0 flex md:flex-col items-baseline md:items-start gap-3">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Lesson</span>
          <button
            type="button"
            onClick={() => toggle(key)}
            className={`mono text-[9px] uppercase tracking-widest px-3 py-2 transition-colors md:mt-2 ${done ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
            style={{ border: '0.5px solid #000' }}
            aria-pressed={done}
          >
            {done ? '✓ Complete' : 'Mark complete'}
          </button>
        </div>
        <div className="md:col-span-10 p-6 md:p-12">
          <MarkdownBody text={lesson.body} />
        </div>
      </div>

      {/* Discussion prompt */}
      {lesson.prompt && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Take it to the community</span>
          </div>
          <div className="md:col-span-10 p-6 md:p-12 max-w-3xl">
            <p className="display text-lg md:text-2xl italic leading-relaxed text-neutral-800">&ldquo;{renderInline(lesson.prompt, `lp-${lesson.moduleNum}-${lesson.lessonNum}`)}&rdquo;</p>
            <button
              type="button"
              onClick={() => goTo('community')}
              className="mt-5 md:mt-6 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-black hover:text-white transition-colors"
              style={{ border: '0.5px solid #000' }}
            >
              <span>Join the discussion</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Prev/next within module + module hand-off */}
      <div className="hairline-b grid grid-cols-2">
        <div className="hairline-r p-5 md:p-8">
          {prev ? (
            <button type="button" onClick={() => goTo(`lesson-${prev.moduleNum}-${prev.lessonNum}`)} className="text-left w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">← Lesson {prev.lessonNum}</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{prev.title}</p>
            </button>
          ) : (
            <button type="button" onClick={() => goTo(`curriculum-${moduleIndex + 1}`)} className="text-left w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">← Module {mod.roman}</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{mod.title}</p>
            </button>
          )}
        </div>
        <div className="p-5 md:p-8 text-right">
          {next ? (
            <button type="button" onClick={() => goTo(`lesson-${next.moduleNum}-${next.lessonNum}`)} className="text-right w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Lesson {next.lessonNum} →</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{next.title}</p>
            </button>
          ) : curriculumModules[moduleIndex + 1] ? (
            <button type="button" onClick={() => goTo(`curriculum-${moduleIndex + 2}`)} className="text-right w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Next Module →</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{curriculumModules[moduleIndex + 1].title}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">End of course</span>
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeLessonPage({ goTo }) {
  if (!welcomeLesson) {
    return <div className="p-12">Welcome lesson unavailable.</div>;
  }
  return (
    <div className="fade-in">
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between flex-wrap gap-3">
        <button type="button" onClick={() => goTo('curriculum')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Curriculum
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">Orientation</span>
      </div>
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">§ 00</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Before the work begins</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">{welcomeLesson.title}.</h1>
          {welcomeLesson.kicker && (
            <p className="display text-lg md:text-2xl mt-4 md:mt-6 text-neutral-600 max-w-3xl leading-snug">
              {renderInline(welcomeLesson.kicker, 'wk')}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Welcome</span>
        </div>
        <div className="md:col-span-10 p-6 md:p-12">
          <MarkdownBody text={welcomeLesson.body} />
        </div>
      </div>
      {welcomeLesson.prompt && (
        <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
          <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Take it to the community</span>
          </div>
          <div className="md:col-span-10 p-6 md:p-12 max-w-3xl">
            <p className="display text-lg md:text-2xl italic leading-relaxed text-neutral-800">&ldquo;{renderInline(welcomeLesson.prompt, 'wp')}&rdquo;</p>
            <button
              type="button"
              onClick={() => goTo('community')}
              className="mt-5 md:mt-6 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-black hover:text-white transition-colors"
              style={{ border: '0.5px solid #000' }}
            >
              <span>Join the discussion</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
      <div className="hairline-b grid grid-cols-2">
        <div className="hairline-r p-5 md:p-8">
          <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">Beginning</span>
        </div>
        <div className="p-5 md:p-8 text-right">
          <button type="button" onClick={() => goTo('lesson-1-1')} className="text-right w-full hover:italic transition-all">
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Begin Module I →</p>
            <p className="display text-base md:text-xl mt-2 leading-snug italic">Why we begin here</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function GlossaryPage({ goTo }) {
  if (!glossary) {
    return (
      <div className="p-12 max-w-2xl">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-6">Glossary in preparation</p>
        <button type="button" onClick={() => goTo('home')} className="mono text-[10px] uppercase tracking-widest underline">← Home</button>
      </div>
    );
  }
  return (
    <div className="fade-in">
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between flex-wrap gap-3">
        <button type="button" onClick={() => goTo('home')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Home
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">Reference</span>
      </div>
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">§ —</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mb-3 md:mb-4">Five languages</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">{glossary.title}.</h1>
          {glossary.kicker && (
            <p className="display text-lg md:text-2xl mt-4 md:mt-6 text-neutral-600 max-w-3xl leading-snug">
              {renderInline(glossary.kicker, 'gk')}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Glossary</span>
        </div>
        <div className="md:col-span-10 p-6 md:p-12">
          <MarkdownBody text={glossary.body} />
        </div>
      </div>
    </div>
  );
}

const FORUM_URL = 'https://community.svapnaproject.org';

const FORUM_CATEGORIES = [
  { num: 'I',    name: 'Foundations',           slug: 'foundations',           blurb: 'Practice itself: dream journaling, sleep hygiene, attention through the day. Specific techniques (MILD, WILD, recognition by inquiry) belong here. Beginners welcome — no question wasted.' },
  { num: 'II',   name: 'History',               slug: 'history',               blurb: 'The lineages the course traces — Vedic, Upaniṣadic, Indian Buddhist, Mahāyāna, Tibetan, Daoist, Sufi, Western. Discuss a primary text, a translator’s choice, a teacher’s place in the broader story.' },
  { num: 'III',  name: 'Curriculum',            slug: 'curriculum',            blurb: 'One thread per lesson, anchored to the course material. New lessons get their threads as you move through them. Old threads stay open; coming back months later is one of the gifts.' },
  { num: 'IV',   name: 'Community',             slug: 'community',             blurb: 'The town square. Introductions, announcements, gentle conversation that doesn’t fit elsewhere. Welcome posts go here on your first day; we read them.' },
  { num: 'V',    name: 'Library',               slug: 'library',               blurb: 'Books, papers, films, podcasts, primary sources. Recommendations, summaries, critical readings, reading-group threads.' },
  { num: 'VI',   name: 'Support',               slug: 'support',               blurb: 'Help with practice, with technical issues on the site, with life situations affecting your practice. Volunteers lend their time; nothing here is treated as therapy or medical advice.' },
  { num: 'VII',  name: 'Dream-Sharing Circles', slug: 'dream-sharing-circles', blurb: 'Small opt-in groups where members share dreams. Witnessing without interpretation, unless interpretation is invited. Circles cap at twelve.' },
  { num: 'VIII', name: 'Practice Partners',     slug: 'practice-partners',     blurb: '1:1 mutual accountability for a specific practice. Post what you’re working on; other members reply or DM. Either of you can step away.' },
  { num: 'IX',   name: 'Experiences',           slug: 'experiences',           blurb: 'Personal dream reports, lucidity reports, reports from the threshold. The community’s job is to witness. Interpretation only when the poster invites it.' },
  { num: 'X',    name: 'Lineage and Teachers',  slug: 'lineage-and-teachers',  blurb: 'Specific teachers, specific transmissions, specific schools. Where a teaching the course covered shows up in someone you’ve actually studied with.' },
  { num: 'XI',   name: 'Meta',                  slug: 'meta',                  blurb: 'The forum about the forum. Feature requests, code-of-conduct interpretations, moderation questions, accessibility issues.' },
  { num: 'XII',  name: 'Off-Topic',             slug: 'off-topic',             blurb: 'Everything else. Music, food, gardening, what you’re reading. Anything that doesn’t have a home in the categories above.' },
];

function CommunitySection() {
  const pillars = [
    { num: 'i.',   title: 'Forums',             body: 'Organized by topic and lineage. Twelve categories, from Foundations to Off-Topic — each with its own conversation. Listed in full below.', href: `${FORUM_URL}/categories` },
    { num: 'ii.',  title: 'Dream Circles',      body: 'Small opt-in groups of eight to twelve. Members share dreams. Witnessing without interpretation, unless invited. Asynchronous, so time zones do not separate us.', href: `${FORUM_URL}/c/dream-sharing-circles` },
    { num: 'iii.', title: 'Practice Partners',  body: 'A bulletin board for 1:1 partners working on similar techniques. Accountability without obligation. Either of you can step away.', href: `${FORUM_URL}/c/practice-partners` },
    { num: 'iv.',  title: 'Code of Conduct',    body: 'Respect for personal experience, cultural traditions, and the vulnerability of sharing dreams. No interpretation without invitation. No proselytizing. No advice unless asked.', href: `${FORUM_URL}/guidelines` },
  ];
  return (
    <div className="fade-in">
      <SectionHeader num="§ 04" kicker="Together, Asynchronously" title="Community." sub={<>The forum lives at <span className="not-italic mono text-base md:text-lg">community.svapnaproject.org</span>. Peer-led, lightly moderated.</>} />

      {/* Visit-the-forum CTA */}
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        <div className="md:col-span-2 p-5 md:p-8 hairline-b md:hairline-r md:border-b-0">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">The Forum</span>
        </div>
        <div className="md:col-span-10 p-6 sm:p-8 md:p-12 max-w-3xl">
          <p className="display text-2xl md:text-3xl leading-snug italic text-neutral-800">
            An asynchronous Discourse community. Free to read, free to join, no advertising, no tracking.
          </p>
          <a
            href={FORUM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 md:mt-8 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-black hover:text-white transition-colors"
            style={{ border: '0.5px solid #000' }}
          >
            <span>Visit community.svapnaproject.org</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Pillars — each opens a destination on the forum */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {pillars.map((it, i) => (
          <a
            key={i}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className={`block p-6 sm:p-8 md:p-12 hairline-b ${i % 2 === 0 ? 'md:hairline-r' : ''} active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group`}
          >
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{it.num}</span>
            <h3 className="display text-4xl md:text-5xl mt-3 md:mt-4 group-hover:italic transition-all">{it.title}</h3>
            <p className="mt-5 md:mt-6 leading-relaxed text-neutral-700 text-sm md:text-base">{it.body}</p>
            <p className="mono text-[10px] uppercase tracking-widest mt-5 md:mt-6 group-hover:translate-x-1 transition-transform inline-block">Open ↗</p>
          </a>
        ))}
      </div>

      {/* All twelve categories */}
      <CategoriesBlock />
    </div>
  );
}

function CategoriesBlock() {
  return (
    <div className="hairline-b">
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 02</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Categories.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          The full list. Each opens its category on the forum.
        </p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden hairline-t">
        {FORUM_CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`${FORUM_URL}/c/${c.slug}`}
            target="_blank"
            rel="noreferrer"
            className="block hairline-b p-5 active:bg-neutral-100 transition-colors"
          >
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{c.num}</span>
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">/c/{c.slug}</span>
            </div>
            <h3 className="display text-xl italic leading-tight mt-2">{c.name}</h3>
            <p className="text-sm mt-3 text-neutral-700 leading-relaxed">{c.blurb}</p>
            <p className="mono text-[10px] uppercase tracking-widest mt-3 text-neutral-500">Open ↗</p>
          </a>
        ))}
      </div>

      {/* Desktop: annotated list */}
      <div className="hidden md:block hairline-t">
        {FORUM_CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`${FORUM_URL}/c/${c.slug}`}
            target="_blank"
            rel="noreferrer"
            className="grid grid-cols-12 hairline-b py-6 px-8 hover:bg-neutral-50 transition-colors group"
          >
            <div className="col-span-2 mono text-[10px] uppercase tracking-widest text-neutral-500 pt-1">{c.num}</div>
            <div className="col-span-9">
              <div className="display text-xl md:text-2xl italic leading-tight group-hover:translate-x-1 transition-transform">{c.name}</div>
              <p className="text-sm md:text-base mt-3 leading-relaxed text-neutral-700 max-w-3xl">{c.blurb}</p>
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-400 mt-3">/c/{c.slug}</p>
            </div>
            <div className="col-span-1 mono text-[10px] uppercase tracking-widest text-neutral-400 text-right">↗</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function LibrarySection({ goTo }) {
  return (
    <div className="fade-in">
      <SectionHeader num="§ 05" kicker="Articles and Citations" title="Library." sub="Long-form articles on the traditions, with the citations behind them." />
      <ArticlesBlock goTo={goTo} />
      <BibliographyBlock />
      <ThemesBlock goTo={goTo} />
      <PullQuotesBlock />
    </div>
  );
}

// Six long-form articles drawn from /reference-material/09_research/. Each
// opens an in-page reader (ArticleReader) that lazy-loads the article body.
function ArticlesBlock({ goTo }) {
  return (
    <div className="hairline-b">
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 02</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Articles.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          Six long-form essays — one per tradition — drawn from the project research files. Where the texts in the bibliography below come from, what they argue, and how they meet.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 hairline-t">
        {articles.map((a, i) => {
          const isLastRow = i >= articles.length - (articles.length % 2 === 0 ? 2 : 1);
          const isLeft = i % 2 === 0;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => goTo(`article-${a.id}`)}
              className={`text-left p-6 sm:p-8 md:p-10 hairline-b ${isLeft ? 'md:hairline-r' : ''} ${isLastRow ? 'md:border-b-0' : ''} active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group`}
            >
              <div className="flex justify-between items-baseline">
                <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">№ {a.num}</p>
                <p className="mono text-[9px] uppercase tracking-widest text-neutral-400">~{(a.word_count / 1000).toFixed(1)}k words</p>
              </div>
              <h3 className="display text-3xl md:text-4xl mt-3 md:mt-4 leading-tight">{a.label}</h3>
              <p className="display text-base md:text-lg italic text-neutral-600 mt-2 md:mt-3 leading-snug">{a.title}</p>
              <p className="text-sm leading-relaxed mt-4 md:mt-5 text-neutral-700">{a.blurb}</p>
              <p className="mono text-[10px] uppercase tracking-widest mt-5 md:mt-6 group-hover:translate-x-1 transition-transform inline-block">Read →</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Each library entry now carries an editorial summary plus a 'reference'
// pointer to where the source lives in the project's reference-material folder.
// The block prints them as a citation-style annotated list.
function BibliographyBlock() {
  return (
    <div className="hairline-b">
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 03</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Summaries &amp; References.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          A short editorial summary of each text in the corpus, with its working citation.
        </p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden hairline-t">
        {library.map((item, i) => (
          <div key={i} className="hairline-b p-5">
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{item.type}</span>
              <span className="mono text-[10px] text-neutral-500">{item.year}</span>
            </div>
            <h3 className="display text-xl italic leading-tight mt-2">{item.title}</h3>
            <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{item.author}</p>
            {item.summary && (
              <p className="text-sm mt-3 text-neutral-700 leading-relaxed">{item.summary}</p>
            )}
            {item.reference && (
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-400 mt-3 break-words">{item.reference}</p>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: annotated list */}
      <div className="hidden md:block hairline-t">
        {library.map((item, i) => (
          <div key={i} className="grid grid-cols-12 hairline-b py-6 px-8 hover:bg-neutral-50 transition-colors">
            <div className="col-span-2 mono text-[10px] uppercase tracking-widest text-neutral-500 pt-1">{item.type}</div>
            <div className="col-span-9">
              <div className="display text-xl md:text-2xl italic leading-tight">{item.title}</div>
              <div className="text-sm pt-1 text-neutral-700">{item.author}</div>
              {item.summary && (
                <p className="text-sm md:text-base mt-3 leading-relaxed text-neutral-700 max-w-3xl">{item.summary}</p>
              )}
              {item.reference && (
                <p className="mono text-[10px] uppercase tracking-widest text-neutral-400 mt-3 break-words">{item.reference}</p>
              )}
            </div>
            <div className="col-span-1 text-right mono text-xs pt-1 text-neutral-500">{item.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemesBlock({ goTo }) {
  return (
    <div className="hairline-b">
      <div className="px-5 md:px-12 pt-10 md:pt-16 pb-4">
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 04</p>
        <h2 className="display text-4xl md:text-6xl mt-2 md:mt-3">Themes.</h2>
        <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl">
          Fourteen cross-cutting concerns that recur across the corpus. Click any theme to see actual passages from the primary texts.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hairline-t">
        {themes.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(`theme-${t.id}`)}
            className="text-left p-6 md:p-8 hairline-b sm:[&:nth-child(odd)]:hairline-r lg:[&:nth-child(3n+1)]:hairline-r lg:[&:nth-child(3n+2)]:hairline-r lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-child(even)]:border-r-0 active:bg-neutral-100 md:hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex justify-between items-baseline">
              <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">№ {String(i + 1).padStart(2, '0')}</span>
              <span className="mono text-[9px] uppercase tracking-widest text-neutral-400">{t.sources} sources</span>
            </div>
            <h3 className="display text-2xl md:text-3xl mt-4 leading-tight group-hover:italic transition-all">{t.label}</h3>
            <p className="text-sm leading-relaxed mt-3 md:mt-4 text-neutral-700">{t.desc}</p>
            <p className="mono text-[10px] uppercase tracking-widest mt-4 md:mt-5 text-neutral-500 group-hover:text-black group-hover:translate-x-1 transition-all inline-block">Browse passages →</p>
          </button>
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
        <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Fig. 05</p>
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
      <SectionHeader num="§ 06" kicker="Dāna" title="Support." sub="If it's been useful, pass it on." />
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 hairline-b md:hairline-r">
          <p className="display text-xl sm:text-2xl md:text-3xl italic leading-relaxed">
            The course, the history, the community — open to anyone. If it's helped, buy us a coffee. Or buy one for someone else.
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

// ----- ARTICLE READER ----------------------------------------------------
// Lazy-loads the long-form research articles compiled from
// /reference-material/09_research/. Each article is rendered as a sequence of
// typed blocks (h2/h3, paragraphs, blockquotes, lists, rules) so we can keep
// editorial typography without depending on a markdown runtime.

function ArticleReader({ articleId, goTo }) {
  const meta = articles.find(a => a.id === articleId);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    if (!meta) {
      setError('Unknown article.');
      return;
    }
    import('./data/articles.json')
      .then(mod => {
        if (cancelled) return;
        const found = (mod.default.articles || []).find(a => a.id === articleId);
        if (!found) setError('Article not found in articles.json.');
        else setData(found);
      })
      .catch(err => { if (!cancelled) setError(String(err)); });
    return () => { cancelled = true; };
  }, [articleId, meta]);

  if (!meta) return <div className="p-12">Unknown article.</div>;

  // Prev / next navigation across the six articles.
  const idx = articles.findIndex(a => a.id === articleId);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx < articles.length - 1 ? articles[idx + 1] : null;

  return (
    <div className="fade-in">
      {/* Crumb / back */}
      <div className="hairline-b px-5 md:px-12 py-4 flex items-center justify-between flex-wrap gap-3">
        <button type="button" onClick={() => goTo('library')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Library
        </button>
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">Article № {meta.num}</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 hairline-b">
        <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
          <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Article</span>
        </div>
        <div className="col-span-9 md:col-span-10 p-5 md:p-8">
          <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">№ {meta.num} · {meta.label}</p>
          <h1 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mt-3 md:mt-4">{meta.title}</h1>
          <p className="display text-base md:text-xl italic text-neutral-600 mt-3 md:mt-4 max-w-3xl leading-snug">{meta.blurb}</p>
        </div>
      </div>

      {error && <div className="p-12 text-red-700">Error loading article: {error}</div>}
      {!data && !error && (
        <div className="p-12 mono text-[10px] uppercase tracking-widest text-neutral-500">Loading…</div>
      )}

      {data && <ArticleBody article={data} />}

      {/* Prev / next */}
      <div className="hairline-b grid grid-cols-2">
        <div className="hairline-r p-5 md:p-8">
          {prev ? (
            <button type="button" onClick={() => goTo(`article-${prev.id}`)} className="text-left w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">← Previous</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{prev.label}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">Beginning</span>
          )}
        </div>
        <div className="p-5 md:p-8 text-right">
          {next ? (
            <button type="button" onClick={() => goTo(`article-${next.id}`)} className="text-right w-full hover:italic transition-all">
              <p className="mono text-[10px] uppercase tracking-widest text-neutral-500">Next →</p>
              <p className="display text-base md:text-xl mt-2 leading-snug italic">{next.label}</p>
            </button>
          ) : (
            <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">End</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleBody({ article }) {
  return (
    <div className="px-5 md:px-12 py-10 md:py-16">
      <div className="max-w-3xl space-y-5 md:space-y-6">
        {(article.blocks || []).map((b, i) => {
          if (b.kind === 'rule') {
            return <div key={i} className="hairline-t my-4 md:my-6" />;
          }
          if (b.kind === 'h2') {
            return (
              <h2 key={i} className="display text-2xl md:text-3xl leading-tight mt-8 md:mt-12 mb-2">{b.text}</h2>
            );
          }
          if (b.kind === 'h3') {
            return (
              <h3 key={i} className="display text-xl md:text-2xl italic leading-snug mt-6 md:mt-8 mb-1 text-neutral-800">{b.text}</h3>
            );
          }
          if (b.kind === 'quote') {
            return (
              <blockquote key={i} className="hairline-l pl-5 md:pl-6 display text-lg md:text-xl italic leading-relaxed text-neutral-700">
                {b.text}
              </blockquote>
            );
          }
          if (b.kind === 'list') {
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 text-base md:text-lg leading-loose">
                {(b.items || []).map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
          }
          // 'p' (default)
          return (
            <p key={i} className="text-base md:text-lg leading-loose">{b.text}</p>
          );
        })}
      </div>
    </div>
  );
}

// ----- THEME DETAIL ------------------------------------------------------

function ThemeDetail({ themeId, goTo }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    import('./data/themed_passages.json')
      .then(mod => {
        if (cancelled) return;
        setData(mod.default[themeId] || null);
      })
      .catch(err => { if (!cancelled) setError(String(err)); });
    return () => { cancelled = true; };
  }, [themeId]);

  return (
    <div className="fade-in">
      <div className="hairline-b px-5 md:px-12 py-4">
        <button type="button" onClick={() => goTo('library')} className="mono text-[10px] uppercase tracking-widest hover:italic transition-all">
          ← Library · Themes
        </button>
      </div>

      {error && <div className="p-12 text-red-700">Error: {error}</div>}
      {!data && !error && (
        <div className="p-12 mono text-[10px] uppercase tracking-widest text-neutral-500">Loading…</div>
      )}

      {data === null && !error && (
        <div className="p-12">Theme not found.</div>
      )}

      {data && (
        <>
          {/* Header */}
          <div className="grid grid-cols-12 hairline-b">
            <div className="col-span-3 md:col-span-2 p-5 md:p-8 hairline-r flex items-start">
              <span className="mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Theme</span>
            </div>
            <div className="col-span-9 md:col-span-10 p-5 md:p-8">
              <h1 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">{data.label}.</h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-neutral-700 max-w-3xl">{data.description}</p>
              <div className="mt-5 md:mt-6 flex flex-wrap gap-2">
                <span className="mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 text-neutral-700" style={{ border: '0.5px solid rgba(0,0,0,0.3)' }}>{data.entries.length} sources</span>
                <span className="mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 text-neutral-700" style={{ border: '0.5px solid rgba(0,0,0,0.3)' }}>{data.total_passage_hits} passage hits</span>
              </div>
              {data.keywords && data.keywords.length > 0 && (
                <div className="mt-5 md:mt-6">
                  <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Keywords</p>
                  <p className="text-sm leading-relaxed text-neutral-600">{data.keywords.join(' · ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Source entries with passages */}
          {data.entries.map((entry, i) => (
            <div key={i} className="hairline-b">
              <div className="px-5 md:px-12 py-6 md:py-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <h2 className="display text-xl md:text-2xl italic leading-tight">{entry.source_title}{entry.section_title ? ` — ${entry.section_title}` : ''}</h2>
                  <span className="mono text-[9px] uppercase tracking-widest text-neutral-500">{entry.match_count} matches</span>
                </div>
                <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mt-2">{entry.tradition}{entry.page_range ? ` · pp. ${entry.page_range[0]}–${entry.page_range[1]}` : ''}</p>
              </div>
              {entry.passages && entry.passages.length > 0 && (
                <div className="px-5 md:px-12 pb-6 md:pb-8 space-y-4">
                  {entry.passages.map((p, j) => (
                    <div key={j} className="hairline-t pt-4">
                      <p className="mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">… {p.keyword}</p>
                      <p className="text-sm md:text-base leading-relaxed text-neutral-700 italic">…{p.snippet}…</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

