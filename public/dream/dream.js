// Dreaming: a descent through one night. Scrolling sets the depth; the depth sets the light, the clock and the sound.
(function () {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  // One row per depth: -1 the opening, 0..7 the layers, 8 the end. Colours are background, then three lights.
  const NIGHT = [
    ['#0c1226', '#ffb45e', '#5b7dff', '#ff8f6b', .55, .5, .6, 0, .2],
    ['#0b1022', '#ffb45e', '#5b7dff', '#ff8f6b', .5, .45, .65, 0, .2],
    ['#090a1c', '#8f7bff', '#ffb7a0', '#3fc7c9', .6, .22, .12, 0, .3],
    ['#000002', '#1b2550', '#141a3a', '#101530', .1, .04, .05, 0, .05],
    ['#0a0420', '#ff4fd8', '#31d8ff', '#ffd24a', 1, .8, .42, 0, .5],
    ['#03142a', '#7ff3ff', '#ffffff', '#4f8dff', .9, .32, 1, 0, .6],
    ['#0a0a24', '#a070ff', '#3df0c0', '#ffd24a', 1, .6, .7, 0, 1.6],
    ['#05070f', '#3a44b8', '#2a3a8a', '#55409a', .42, .07, .04, 0, .15],
    ['#1b1424', '#ffb27a', '#ffd9a0', '#ff8f6b', .55, .3, .3, .9, .3],
    ['#f3f6ff', '#ffc98a', '#bcd0ff', '#ffe2b8', .55, .25, .25, 1.1, .3],
  ];
  const LIGHT = [
    ['#ffffff', '#ffb000', '#2654ff', '#00b894', .6, .5, .5, 0, .2],
    ['#ffffff', '#ffb000', '#2654ff', '#00b894', .55, .45, .55, 0, .2],
    ['#f3f1ff', '#9a86ff', '#ffb9a2', '#39c2c9', .7, .22, .12, 0, .3],
    ['#020206', '#1b2550', '#141a3a', '#101530', .1, .04, .05, 0, .05],
    ['#fff7ff', '#ff3fc4', '#18c8ff', '#ffc21a', 1, .8, .42, 0, .5],
    ['#f2fbff', '#16d6ff', '#2a66ff', '#8fe9ff', .85, .32, 1, 0, .6],
    ['#faf7ff', '#8a5cff', '#00cfa0', '#ffc21a', 1, .6, .7, 0, 1.6],
    ['#eef0ff', '#aab4ff', '#c9ccff', '#b9a8ff', .6, .07, .04, 0, .15],
    ['#fff8f4', '#ffb27a', '#bcd0ff', '#ff9f7b', .7, .3, .3, .9, .3],
    ['#ffffff', '#ffc98a', '#bcd0ff', '#ffe2b8', .6, .25, .25, 1.0, .3],
  ];
  // Which rows have a dark background, so the words turn light.
  const DARK = { night: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0], light: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0] };
  const MIN = [0, 0, 20, 65, 100, 385, 415, 440, 480, 490];      // minutes after 23:00
  const TONE = [110, 110, 98, 49, 147, 220, 196, 65, 131, 165];  // hertz, for the optional sound
  const LOUD = [.8, .8, .7, .22, 1, .9, 1, .5, .8, .6];

  let pref = null; try { pref = localStorage.getItem('svapna_mode'); } catch (e) { /* private mode */ }
  let mode = pref === 'light' || pref === 'night' ? pref : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'night');
  const modeBtn = $('mode');
  const paintMode = () => { modeBtn.textContent = mode === 'light' ? 'Night' : 'Light'; };
  modeBtn.addEventListener('click', () => { mode = mode === 'light' ? 'night' : 'light'; try { localStorage.setItem('svapna_mode', mode); } catch (e) { /* private mode */ } paintMode(); });
  paintMode();

  // ---- depth from scroll ----
  const sections = [...document.querySelectorAll('section[data-depth]')], links = [...document.querySelectorAll('.gauge a')];
  let centres = [], depth = -1, seen = -1;
  const measure = () => { centres = sections.map(s => s.offsetTop + s.offsetHeight / 2); };
  function readDepth() {
    const y = scrollY + innerHeight / 2;
    let i = 0; while (i < centres.length - 2 && y > centres[i + 1]) i++;
    const f = Math.max(0, Math.min(1, (y - centres[i]) / (centres[i + 1] - centres[i])));
    return +sections[i].dataset.depth + f * (+sections[i + 1].dataset.depth - +sections[i].dataset.depth);
  }
  const row = (table, d) => {
    const x = Math.max(0, Math.min(table.length - 1, d + 1)), i = Math.min(table.length - 2, Math.floor(x)), f = x - i, a = table[i], b = table[i + 1];
    const mixc = k => { const p = hex(a[k]), q = hex(b[k]); return p.map((v, j) => v + (q[j] - v) * f); };
    return { base: mixc(0), c0: mixc(1), c1: mixc(2), c2: mixc(3), n: [4, 5, 6, 7, 8].map(k => a[k] + (b[k] - a[k]) * f), i, f };
  };
  const lerpList = (list, d) => { const x = Math.max(0, Math.min(list.length - 1, d + 1)), i = Math.min(list.length - 2, Math.floor(x)); return list[i] + (list[i + 1] - list[i]) * (x - i); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { threshold: .35 });
    sections.forEach(s => io.observe(s));
  } else sections.forEach(s => s.classList.add('in'));

  // ---- the light: one shader, steered by the depth ----
  const cv = $('abyss'), gl = cv.getContext('webgl', { antialias: false, alpha: false });
  let U = null;
  if (gl) {
    const fs = `precision highp float;uniform vec2 r,m;uniform float ph,amt,sharp,rise,ptr,nar,dk,seed;uniform vec3 base,c0,c1,c2;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(11.3,7.1);a*=.5;}return v;}
void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y;p+=m*ptr*.22;
 vec2 q=p+.55*vec2(fbm(p*1.1+ph*.07),fbm(p*1.1-ph*.06+9.));
 vec2 s=q+.35*vec2(fbm(q*1.7+ph*.1+3.),fbm(q*1.7-ph*.08+21.));
 float w=mix(.34,.035,sharp);
 float a=smoothstep(.56-w,.56+w,fbm(s*1.15+vec2(0.,ph*.04)));
 float b=smoothstep(.58-w,.58+w,fbm(s*1.15+vec2(31.,-ph*.05)));
 float d=smoothstep(.6-w,.6+w,fbm(s*1.15+vec2(-17.,ph*.06)+5.));
 vec3 col=base;col=mix(col,c2,d*.9*amt);col=mix(col,c1,b*.82*amt);col=mix(col,c0,a*.86*amt);
 float up=rise*smoothstep(.75,-.65,p.y+.25*fbm(p*1.3+ph*.05));
 col=mix(col,mix(c0,c1,.5+.5*sin(p.x*2.+ph*.2)),clamp(up,0.,1.));
 float keep=mix(smoothstep(-.95,.3,p.x),smoothstep(-.15,.6,p.y),nar);
 col=mix(mix(base,col,.3),col,keep);
 col*=mix(1.,1.-.45*smoothstep(.4,1.1,length(p*vec2(.8,1.))),dk);
 col+=(h(gl_FragCoord.xy+seed)-.5)*.03;
 gl_FragColor=vec4(col,1.);}`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}')); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      gl.useProgram(pr); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      U = Object.fromEntries(['r', 'm', 'ph', 'amt', 'sharp', 'rise', 'ptr', 'nar', 'dk', 'seed', 'base', 'c0', 'c1', 'c2'].map(k => [k, gl.getUniformLocation(pr, k)]));
    }
  }
  function size() { cv.width = Math.round(innerWidth * .5); cv.height = Math.round(innerHeight * .5); if (gl) gl.viewport(0, 0, cv.width, cv.height); measure(); }
  const mouse = [0, 0], m = [0, 0];
  addEventListener('pointermove', e => { mouse[0] = e.clientX / innerWidth - .5; mouse[1] = .5 - e.clientY / innerHeight; });

  // ---- optional sound: a low tone that follows the depth ----
  let audio = null;
  $('sound').addEventListener('click', () => {
    if (!audio) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const ctx = new A(), out = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; out.gain.value = 0;
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = ctx.createGain(); o1.type = 'sine'; o2.type = 'sine'; g2.gain.value = .35;
      o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(out); out.connect(ctx.destination); o1.start(); o2.start();
      audio = { ctx, out, lp, o1, o2, on: false };
    }
    audio.on = !audio.on; if (audio.on) audio.ctx.resume();
    $('sound').textContent = audio.on ? 'Sound on' : 'Sound off'; $('sound').setAttribute('aria-pressed', String(audio.on));
  });

  // ---- frame ----
  let last = 0, ph = 0, shown = 99;
  function frame(ts) {
    const dt = Math.min(64, ts - last || 16); last = ts;
    const want = readDepth(); depth += (want - depth) * (reduce ? 1 : Math.min(1, dt / 260));
    const tbl = mode === 'light' ? LIGHT : NIGHT, k = row(tbl, depth);
    ph += dt / 1000 * k.n[1] * (reduce ? .2 : 1);
    m[0] += (mouse[0] - m[0]) * .05; m[1] += (mouse[1] - m[1]) * .05;
    if (U) {
      gl.uniform2f(U.r, cv.width, cv.height); gl.uniform2fv(U.m, m); gl.uniform1f(U.ph, ph); gl.uniform1f(U.amt, k.n[0]); gl.uniform1f(U.sharp, k.n[2]); gl.uniform1f(U.rise, k.n[3]); gl.uniform1f(U.ptr, k.n[4]);
      gl.uniform1f(U.nar, innerWidth < 820 ? 1 : 0); gl.uniform1f(U.dk, mode === 'night' ? 1 : 0); gl.uniform1f(U.seed, ts % 97);
      gl.uniform3fv(U.base, k.base); gl.uniform3fv(U.c0, k.c0); gl.uniform3fv(U.c1, k.c1); gl.uniform3fv(U.c2, k.c2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else document.body.style.background = `rgb(${k.base.map(v => Math.round(v * 255))})`;
    // Words are dark on a light ground and light on a dark one.
    const lum = .2126 * k.base[0] + .7152 * k.base[1] + .0722 * k.base[2];
    document.body.classList.toggle('light-now', lum > .5);
    const near = Math.round(depth);
    if (near !== shown) {
      shown = near; links.forEach(a => a.classList.toggle('on', +a.dataset.i === near));
      const id = sections.find(s => +s.dataset.depth === near); if (id && history.replaceState && seen >= 0) history.replaceState(null, '', '#' + id.id); seen = 1;
    }
    const mins = Math.round(lerpList(MIN, depth)) + 23 * 60, hh = Math.floor(mins / 60) % 24, mm = mins % 60;
    $('clock').textContent = ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2);
    if (audio) {
      const t = audio.ctx.currentTime, f = lerpList(TONE, depth);
      audio.o1.frequency.setTargetAtTime(f, t, .6); audio.o2.frequency.setTargetAtTime(f * 1.498, t, .6);
      audio.lp.frequency.setTargetAtTime(200 + 1400 * k.n[0], t, .6); audio.out.gain.setTargetAtTime(audio.on ? .07 * lerpList(LOUD, depth) : 0, t, .4);
    }
    requestAnimationFrame(frame);
  }

  // ---- the same material, by date ----
  const sheet = $('dates'), openDates = () => { sheet.hidden = false; }, closeDates = () => { sheet.hidden = true; };
  $('open-dates').addEventListener('click', openDates); $('open-dates-2').addEventListener('click', openDates); $('close-dates').addEventListener('click', closeDates);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDates(); });
  document.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => setTimeout(measure, 50)));

  addEventListener('resize', size); size(); depth = readDepth();
  requestAnimationFrame(frame);
})();
