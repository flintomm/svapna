// Dreaming: a descent through one night. Scrolling sets the depth; the depth sets the light and the clock.
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

  let pref = null; try { pref = localStorage.getItem('svapna_mode'); } catch (e) { /* private mode */ }
  let mode = pref === 'light' || pref === 'night' ? pref : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'night');
  const modeBtn = $('mode');
  const paintMode = () => { modeBtn.textContent = mode === 'light' ? 'Night' : 'Light'; document.documentElement.dataset.mode = mode; };
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
  function size() { measureRail(); if (fallScene) fallScene.size(); cv.width = Math.round(innerWidth * .5); cv.height = Math.round(innerHeight * .5); if (gl) gl.viewport(0, 0, cv.width, cv.height); measure(); }
  const mouse = [0, 0], m = [0, 0];
  // On a phone, tilting it moves the view, once the reader asks for that and the phone allows it.
  const tilt = { on: false, b0: null, g0: null };
  const onTilt = e => { if (e.beta == null || e.gamma == null) return; if (tilt.b0 == null) { tilt.b0 = e.beta; tilt.g0 = e.gamma; }
    mouse[0] = Math.max(-.5, Math.min(.5, (e.gamma - tilt.g0) / 36)); mouse[1] = Math.max(-.5, Math.min(.5, (tilt.b0 - e.beta) / 36)); };
  const tiltButtons = [...document.querySelectorAll('[data-tilt]')];
  const paintTilt = () => tiltButtons.forEach(b => { b.dataset.was = b.dataset.was || b.textContent; b.textContent = tilt.on ? 'Tilting' : b.dataset.was; b.setAttribute('aria-pressed', String(tilt.on)); });
  function startTilt() {
    const D = window.DeviceOrientationEvent; if (!D) return Promise.resolve(false);
    const go = () => { tilt.b0 = tilt.g0 = null; addEventListener('deviceorientation', onTilt); tilt.on = true; try { sessionStorage.setItem('svapna_tilt', '1'); } catch (e) { /* private mode */ } paintTilt(); return true; };
    if (typeof D.requestPermission === 'function') return D.requestPermission().then(r => (r === 'granted' ? go() : false)).catch(() => false);
    return Promise.resolve(go());
  }
  function stopTilt() { removeEventListener('deviceorientation', onTilt); tilt.on = false; mouse[0] = mouse[1] = 0; try { sessionStorage.removeItem('svapna_tilt'); } catch (e) { /* private mode */ } paintTilt(); }
  if (window.DeviceOrientationEvent && matchMedia('(pointer: coarse)').matches && !reduce) {
    tiltButtons.forEach(b => { b.hidden = false; b.addEventListener('click', () => (tilt.on ? stopTilt() : startTilt())); });
    // Once allowed, it carries from page to page: the first touch on the next page turns it back on.
    let again = false; try { again = sessionStorage.getItem('svapna_tilt') === '1'; } catch (e) { /* private mode */ }
    if (again) addEventListener('touchend', function once() { removeEventListener('touchend', once); if (!tilt.on) startTilt(); });
  }

  // If the phone takes the graphics away (a long time in the background), the page starts again when they return.
  for (const id of ["abyss","fall"]) { const c = document.getElementById(id); if (c) { c.addEventListener('webglcontextlost', e => e.preventDefault()); c.addEventListener('webglcontextrestored', () => location.reload()); } }

  addEventListener('pointermove', e => { mouse[0] = e.clientX / innerWidth - .5; mouse[1] = .5 - e.clientY / innerHeight; });

  // ---- the fall: one body of light, carried down through the whole night ----
  // The same petals are present from the first screen to the last. At each depth they take a different form:
  // a quiet globe, a restless swarm, a slow drift, one long wave, a storm, a lotus, a still plain, a sun.
  document.documentElement.className = 'js';
  const UNIT = 34;                                    // world units between depths
  const fallScene = (function () {
    const cv3 = $('fall'), T = window.THREE; if (!T || !cv3) return null;
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: cv3, antialias: true, alpha: true }); } catch (e) { return null; }
    let ratio = Math.min(innerWidth < 820 ? 2 : 1.75, devicePixelRatio || 1); renderer.setPixelRatio(ratio);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(55, 1, .1, 400);
    const night = () => mode === 'night';
    const add = () => (night() ? T.AdditiveBlending : T.NormalBlending);
    const dotTex = (function () { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    let seed = 5; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const bell = (d, c, w) => Math.max(0, 1 - Math.abs(d - c) / w), step = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const X0 = () => (innerWidth < 820 ? 0 : innerWidth < 1200 ? 8 : 10);   // the body sits to the right of the words on wide screens

    // Motes fill the whole column. They are still; the camera's fall makes them rise.
    const N = 5200, mp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const a = rnd() * 6.283, r = 3 + rnd() * 26; mp[i * 3] = Math.cos(a) * r; mp[i * 3 + 1] = 14 - rnd() * (UNIT * 9.6 + 28); mp[i * 3 + 2] = -6 - Math.abs(Math.sin(a)) * r - rnd() * 30; }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3));
    if (innerWidth < 820) mg.setDrawRange(0, Math.round(N * .5));
    const motes = new T.Points(mg, new T.PointsMaterial({ size: .5, map: dotTex, transparent: true, depthWrite: false, sizeAttenuation: true })); scene.add(motes);

    // The body: petals of light.
    const petalTex = (function () { const c = document.createElement('canvas'); c.width = 96; c.height = 256; const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 256, 0, 0); g.addColorStop(0, 'rgba(255,255,255,.15)'); g.addColorStop(.35, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,.55)');
      x.fillStyle = g; x.beginPath(); x.moveTo(48, 254); x.bezierCurveTo(-18, 170, 2, 60, 48, 2); x.bezierCurveTo(94, 60, 114, 170, 48, 254); x.fill();
      const v = x.createLinearGradient(0, 0, 96, 0); v.addColorStop(0, 'rgba(0,0,0,.28)'); v.addColorStop(.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.28)'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = v; x.fillRect(0, 0, 96, 256);
      const t2 = new T.CanvasTexture(c); t2.anisotropy = 4; return t2; })();
    const petalGeo = new T.PlaneGeometry(.62, 1.9); petalGeo.translate(0, .95, 0);
    const RINGS = 14, CORE = 9, ringN = k => 10 + k * 8; let M = 0; for (let k = 0; k < RINGS; k++) M += ringN(k);
    const body = new T.InstancedMesh(petalGeo, new T.MeshBasicMaterial({ map: petalTex, transparent: true, side: T.DoubleSide, depthWrite: false }), M);
    const C = h => new T.Color(h), dreamCols = ['#ff4fd8', '#31d8ff', '#ffd24a', '#a070ff', '#3df0c0'].map(C);
    const PAL = {
      night: { globe: C('#ffe2bd'), swarm: C('#ffd0a0'), drift: ['#8f7bff', '#ffb7a0', '#3fc7c9'].map(C), wave: C('#6f80c0'), clearA: C('#4fc8ff'), clearB: C('#d8f6ff'), ground: ['#aab4ff', '#7d8cff'].map(C), sunA: C('#ffc98a'), sunB: C('#fff0cf') },
      light: { globe: C('#20264a'), swarm: C('#1a1f3a'), drift: ['#7a66f0', '#f09a80', '#22a8b0'].map(C), wave: C('#6f80c0'), clearA: C('#0a84d8'), clearB: C('#0b2a6a'), ground: ['#3a3fa0', '#6a5fd0'].map(C), sunA: C('#f0a04a'), sunB: C('#ffc98a') },
    };
    const sh = [];
    for (let k = 0, i = 0; k < RINGS; k++) for (let j = 0; j < ringN(k); j++, i++) {
      // a place on a sphere (spread evenly), used by the globe, the swarm, the drift and the sun
      const gy = 1 - 2 * (i + .5) / M, gr = Math.sqrt(1 - gy * gy), ga = i * 2.399963;
      sh.push({ i, dx: Math.cos(ga) * gr, dy: gy, dz: Math.sin(ga) * gr, r1: rnd(), r2: rnd(), r3: rnd(), ph: rnd() * 6.283,
        r: 1.5 + rnd() * 8.5, a: rnd() * 6.283, h: (rnd() - .5) * 20, sp: (.25 + rnd() * .9) * (rnd() < .5 ? -1 : 1), wob: rnd() * 6.283, c: dreamCols[i % 5], s: .7 + rnd() * .9,
        k, th: j / ringN(k) * 6.283 + k * .31, rad: .55 + k * .92, late: k >= CORE, ax: new T.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize() }); }
    body.instanceColor = new T.InstancedBufferAttribute(new Float32Array(M * 3), 3); body.frustumCulled = false; scene.add(body);
    const flare = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0xffffff, transparent: true, depthWrite: false })); scene.add(flare);
    const vast = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0x4a55d8, transparent: true, depthWrite: false })); scene.add(vast);
    const sun = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0xffc98a, transparent: true, depthWrite: false })); scene.add(sun);

    // One form of the body. Writes where a petal is, how it is turned, its size and its colour.
    const up = new T.Vector3(0, 1, 0), v = new T.Vector3(), eu = new T.Euler(), qFlat = new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2 + .1);
    const mk = () => ({ p: new T.Vector3(), q: new T.Quaternion(), s: new T.Vector3(), c: new T.Color() }), A = mk(), B = mk();
    const ctx = { n: true, pal: PAL.night, nar: false, work: 0, spin: 0, px: 0, py: 0, rise: 0 };
    function pose(kind, p, t, o) {
      const pal = ctx.pal;
      if (kind === 0) {            // the day, gathered: a globe of small lights turning slowly
        const a = t * .12, c = Math.cos(a), s = Math.sin(a), x = p.dx * c - p.dz * s, z = p.dx * s + p.dz * c;
        o.p.set(x * 5.6, p.dy * 5.6, z * 5.6); o.q.setFromUnitVectors(up, v.set(x, p.dy, z)); o.s.set(.42 * p.s, .42 * p.s, 1); o.c.copy(pal.globe);
      } else if (kind === 1) {     // awake: the globe comes apart into a restless swarm
        const R = 4 + 6 * p.r1; o.p.set(p.dx * R + Math.sin(t * 7 + p.ph) * .35, p.dy * R + Math.cos(t * 6.3 + p.ph * 1.3) * .35, p.dz * R + Math.sin(t * 5.1 + p.ph * .7) * .35);
        o.q.setFromAxisAngle(p.ax, t * 2.2 + p.ph); o.s.set(.26, .7 * p.s, 1); o.c.copy(pal.swarm);
      } else if (kind === 2) {     // drifting: slow, soft, half-formed
        const R = 5 + 7 * p.r1, b = 1 + .12 * Math.sin(t * .2 + p.ph); o.p.set(p.dx * R + Math.sin(t * .11 + p.ph) * 3, p.dy * R * .8 + Math.cos(t * .09 + p.ph) * 2.4, p.dz * R + Math.sin(t * .07 + p.ph) * 2);
        o.q.setFromAxisAngle(p.ax, t * .15 + p.ph); o.s.set(1.5 * b, .8 * b, 1); o.c.copy(pal.drift[p.i % 3]).multiplyScalar(ctx.n ? .5 : 1);
      } else if (kind === 3) {     // deep sleep: everything settles into one long slow wave, almost gone
        const u = p.r1, ph = u * 7 - t * .5, env = Math.sin(u * Math.PI) * 1.9; o.p.set((u - .5) * 46, Math.sin(ph) * env + (p.r2 - .5) * .5, (p.r3 - .5) * 4);
        eu.set(0, 0, -Math.PI / 2 + Math.atan(Math.cos(ph) * env * .15), 'XYZ'); o.q.setFromEuler(eu); o.s.set(.3, .42, 1); o.c.copy(pal.wave).multiplyScalar(.4);
      } else if (kind === 4) {     // dreaming: the wave breaks into a storm of colour
        const a = p.a + t * p.sp; o.p.set(Math.cos(a) * p.r, p.h + Math.sin(t * .6 + p.wob) * 1.2, Math.sin(a) * p.r * .7);
        o.q.setFromAxisAngle(p.ax, a * 1.7 + p.wob); o.s.set(p.s, p.s, 1); o.c.copy(p.c); if (!ctx.n) o.c.multiplyScalar(.85);
      } else if (kind === 5) {     // lucid: the storm closes into a lotus; worked, its rings turn against each other and answer the hand
        const w = ctx.work, th = p.th + (p.k % 2 ? -1 : 1) * (t * .02 + ctx.spin * .09), rr = p.rad * (ctx.nar ? .78 : .7) * (1 + .03 * Math.sin(t * .8)) * (1 + w * .12 * Math.sin(t * .9 + p.k));
        const tx = Math.cos(th) * rr, ty = Math.sin(th) * rr; let lift = .32 + p.k * .035, sc = p.s * (p.late ? w : 1);
        if (w > 0) { const f = w * Math.max(0, 1 - Math.hypot(tx - ctx.px, ty - ctx.py) / 6.5); lift += f * 1.1; sc *= 1 + f * .7; }
        eu.set(lift, 0, th - Math.PI / 2, 'ZXY'); o.q.setFromEuler(eu); o.p.set(tx, ty, -p.k * .12); sc *= .88 + p.k * .03; o.s.set(sc, sc, 1);
        o.c.copy(p.c); if (!ctx.n) o.c.multiplyScalar(.85); o.c.lerp(p.k % 2 ? pal.clearA : pal.clearB, 1 - w); if (w > 0) o.c.offsetHSL(w * (.5 + .5 * Math.sin(t * .35 + p.k * .7)) * .22, 0, 0);
      } else if (kind === 6) {     // the ground: the lotus lies down and opens out into a still plain
        const th = p.th + (p.k % 2 ? -1 : 1) * t * .012, rr = 1.6 + p.k * 2 + p.r2 * .8; o.p.set(Math.cos(th) * rr, -4.6 + Math.sin(t * .3 + rr * .5) * .12, -Math.sin(th) * rr - 4);
        eu.set(0, 0, th - Math.PI / 2, 'XYZ'); o.q.setFromEuler(eu).premultiply(qFlat); o.s.set(p.s * 1.15, p.s * 1.15, 1); o.c.copy(pal.ground[p.k % 2]).multiplyScalar(ctx.n ? .7 : 1);
      } else {                     // morning: the plain gathers into a sun and rises; at the end it lets go
        const a = t * .05, c = Math.cos(a), s = Math.sin(a), x = p.dx * c - p.dz * s, z = p.dx * s + p.dz * c, R = 4.4 * Math.cbrt(p.r1) + (kind === 8 ? 30 * p.r2 : 0);
        o.p.set(x * R, p.dy * R + ctx.rise + (kind === 8 ? 14 * p.r3 : 0), z * R); o.q.setFromUnitVectors(up, v.set(x, p.dy, z));
        const g = kind === 8 ? .0001 : .62 * p.s; o.s.set(g, g, 1); o.c.copy(pal.sunA).lerp(pal.sunB, 1 - p.r1);
      }
    }
    // Which two forms the body is between at each depth, from the opening (-1) to the end (8).
    const FROM = [0, 1, 2, 3, 4, 5, 5, 6, 7], TO = [1, 2, 3, 4, 5, 5, 6, 7, 8];

    const o = new T.Object3D(), tmpC = new T.Color();
    let Ls = 0, tAcc = 0, lastSnap = 0, wasLucid = false, push = 0, born = 0;
    return {
      size() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); },
      soften() { if (ratio <= 1) return false; ratio = Math.max(1, ratio - .5); renderer.setPixelRatio(ratio); renderer.setSize(innerWidth, innerHeight, false); mg.setDrawRange(0, Math.round(N * .4)); return true; },
      render(dt, d, mouse, inChamber) {
        const t = (tAcc += dt / 1000), ad = add(), x0 = X0(), n = night(), nar = innerWidth < 820;
        const y = -Math.max(-.6, d) * UNIT;
        const w0 = 1 - step(.35, 1.05, d), w1 = bell(d, 1, .95), wd = step(2.45, 3, d) * (1 - step(5.5, 6.1, d)), w6 = bell(d, 6, .95), w7 = step(6.5, 7.1, d);
        const lucid = step(3.5, 3.72, d), work = step(4.55, 5, d) * (1 - step(5.5, 6, d));
        Ls += (lucid - Ls) * Math.min(1, dt / 150);                 // the snap is quick
        if (lucid > .5 && !wasLucid && performance.now() - lastSnap > 1500) { lastSnap = performance.now(); const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
        wasLucid = lucid > .5;
        push += ((inChamber ? 1 : 0) - push) * Math.min(1, dt / 500);
        born = Math.min(1, born + dt / 1600);

        // The camera: restless when awake, rolling as sleep comes, still in deep sleep, swept round in the dream,
        // locked steady once lucid, wide and slow on the ground, tilting up toward morning.
        const jit = w0 * .05, roll = w1 * Math.sin(t * .23) * .16 + wd * (1 - Ls) * Math.sin(t * .5) * .1;
        cam.position.set(mouse[0] * 1.2 + Math.sin(t * 13) * jit, y + mouse[1] * .8 + Math.cos(t * 11) * jit, 4 - push * (nar ? 1.5 : 5));
        cam.rotation.set(-.04 + w7 * .16 + mouse[1] * .05, -mouse[0] * .06 + wd * (1 - Ls) * Math.sin(t * .31) * .12, roll);
        const fov = 55 + wd * (1 - Ls) * 16 - Ls * wd * 9 + w6 * 26 - push * 12; if (Math.abs(cam.fov - fov) > .05) { cam.fov += (fov - cam.fov) * Math.min(1, dt / 400); cam.updateProjectionMatrix(); }

        // Motes thin to nothing in deep sleep and turn gold near morning.
        const dens = .85 * (1 - bell(d, 2, 1.15)) * (1 - .6 * w6);
        motes.material.blending = ad; motes.material.opacity = Math.max(0, dens) * (n ? .8 : .55);
        motes.material.color.set(n ? '#cfd8ff' : '#2a2f55').lerp(tmpC.set(n ? '#ffd9a0' : '#c2702a'), w7).lerp(tmpC.set(n ? '#bff6ff' : '#0a6fd0'), Ls * wd * .7);
        motes.material.size = .34 + w1 * .9 + w6 * .5;

        // The body stays with the reader the whole way down.
        const dd = Math.max(-1, Math.min(7.999, d)), seg = Math.floor(dd), f = dd - seg, ka = FROM[seg + 1], kb = TO[seg + 1];
        const e = seg === 3 ? Ls * Ls * (3 - 2 * Ls) : seg === 2 ? step(.45, .8, f) : seg === 5 ? step(.45, .95, f) : seg === 7 ? step(.3, 1, f) : step(.25, .8, f);
        const size = nar ? .78 : .9, cx = x0, cy = y + (nar ? 12 : 0), cz = nar ? -40 : -19;
        ctx.n = n; ctx.pal = n ? PAL.night : PAL.light; ctx.nar = nar; ctx.work = work; ctx.spin += dt / 1000 * work;
        ctx.px = (mouse[0] * 26 - 4) / size; ctx.py = mouse[1] * 14 / size; ctx.rise = -7 + 9 * step(6.4, 7.6, d);
        for (let i = 0; i < M; i++) { const p = sh[i];
          pose(ka, p, t, A);
          if (kb !== ka && e > .001) { pose(kb, p, t, B); A.p.lerp(B.p, e); A.q.slerp(B.q, e); A.s.lerp(B.s, e); A.c.lerp(B.c, e); }
          o.position.set(cx + A.p.x * size, cy + A.p.y * size, cz + A.p.z * size); o.quaternion.copy(A.q); o.scale.set(Math.max(.0001, A.s.x * size), Math.max(.0001, A.s.y * size), 1); o.updateMatrix();
          body.setMatrixAt(i, o.matrix); body.setColorAt(i, A.c); }
        body.instanceMatrix.needsUpdate = true; body.instanceColor.needsUpdate = true;
        // Light adds to light in the dark; the lotus alone is solid. The change of blending hides behind the flash, and behind a dip on the way out.
        const solid = !n || (Ls > .5 && d < 5.55);
        body.material.blending = solid ? T.NormalBlending : T.AdditiveBlending;
        body.material.opacity = born * (n ? (solid ? .92 : .8) : .86) * (n ? 1 - .7 * bell(d, 5.55, .1) : 1);

        const since = (performance.now() - lastSnap) / 1000, lot = Ls * (1 - step(5.3, 5.9, d));
        flare.visible = lot > .02; flare.position.set(cx, cy, cz - 2); flare.scale.setScalar(7 + 60 * Math.exp(-since * 2.2)); flare.material.opacity = lot * (.22 + .78 * Math.exp(-since * 2)) * (1 - work * .5); flare.material.blending = ad; flare.material.color.set(n ? '#bfeaff' : '#ffffff');
        vast.visible = w6 > .01; vast.position.set(cx, cy - 4, cz - 40); vast.scale.setScalar(150); vast.material.opacity = w6 * (n ? .5 : .35); vast.material.blending = ad;
        sun.visible = w7 > .01; sun.position.set(cx, cy + ctx.rise * size, cz - 6); sun.scale.setScalar(26 + w7 * 30); sun.material.opacity = w7 * (n ? .7 : .45) * (1 - .5 * step(7.4, 8, d)); sun.material.blending = ad;
        renderer.render(scene, cam);
      },
    };
  })();

  // ---- the rail is a scrub bar: drag along it and the night moves under the finger ----
  const gauge = $('gauge'), thumb = $('thumb'), clockEl = $('clock'), NAMES = links.map(a => a.title);
  let stops = [0, 1];
  function measureRail() { stops = links.map(a => a.offsetTop + a.offsetHeight / 2); }
  const railY = d => { const x = Math.max(0, Math.min(stops.length - 1, d)), i = Math.min(stops.length - 2, Math.floor(x)); return stops[i] + (stops[i + 1] - stops[i]) * (x - i); };
  const depthAt = clientY => { const y = clientY - $('rail').getBoundingClientRect().top; let i = 0; while (i < stops.length - 2 && y > stops[i + 1]) i++; return Math.max(0, Math.min(stops.length - 1, i + (y - stops[i]) / (stops[i + 1] - stops[i]))); };
  // The scroll position at which a given depth sits in the middle of the screen. Sections run -1, 0..7, 8.
  const scrollFor = d => { const x = Math.max(0, Math.min(centres.length - 1, d + 1)), i = Math.min(centres.length - 2, Math.floor(x)); return centres[i] + (centres[i + 1] - centres[i]) * (x - i) - innerHeight / 2; };
  let scrub = null, scrubbed = 0;
  const root = document.documentElement;
  gauge.addEventListener('pointerdown', e => { scrub = { y: e.clientY, on: false, id: e.pointerId }; });
  gauge.addEventListener('pointermove', e => {
    if (!scrub) return;
    if (!scrub.on && Math.abs(e.clientY - scrub.y) > 5) {
      scrub.on = true; try { gauge.setPointerCapture(scrub.id); } catch (err) { /* older browsers */ }
      document.body.classList.add('scrubbing'); root.style.scrollSnapType = 'none'; root.style.scrollBehavior = 'auto';
      $('rail-hint').hidden = true; try { localStorage.setItem('svapna_scrubbed', '1'); } catch (err) { /* private mode */ }
    }
    if (scrub.on) { e.preventDefault(); scrollTo(0, scrollFor(depthAt(e.clientY))); }
  });
  const endScrub = () => {
    if (!scrub) return; const was = scrub.on; scrub = null; if (!was) return;
    scrubbed = performance.now(); document.body.classList.remove('scrubbing'); root.style.scrollBehavior = '';
    // Come to rest on the nearest depth.
    scrollTo({ top: scrollFor(Math.round(readDepth())), behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => { root.style.scrollSnapType = ''; }, 900);
  };
  gauge.addEventListener('pointerup', endScrub); gauge.addEventListener('pointercancel', endScrub);
  gauge.addEventListener('click', e => { if (performance.now() - scrubbed < 400) e.preventDefault(); }, true);
  try { if (localStorage.getItem('svapna_scrubbed') === '1') $('rail-hint').hidden = true; } catch (err) { /* private mode */ }

  // ---- frame ----
  let last = 0, ph = 0, shown = 99, inChamber = false, slowN = 0, slowT = 0, tcN = 0;
  const themeMeta = document.querySelector('meta[name=theme-color]');
  let doneNight = false;
  function mark(key) { try { const F = JSON.parse(localStorage.getItem('svapna_done') || '{}') || {}; F[key] = 1; localStorage.setItem('svapna_done', JSON.stringify(F)); } catch (e) { /* private mode */ } }
  function frame(ts) {
    const raw = ts - last || 16, dt = Math.min(64, raw); last = ts;
    // After the first moments, watch the frame time; if the phone is struggling, draw a little less finely.
    if (fallScene && ts > 2500 && !document.hidden && raw < 200) { slowN++; slowT += raw; if (slowN >= 90) { if (slowT / slowN > 24) fallScene.soften(); slowN = slowT = 0; } }
    const want = readDepth(); depth += (want - depth) * (reduce ? 1 : Math.min(1, dt / 260));
    const tbl = mode === 'light' ? LIGHT : NIGHT, k = row(tbl, depth);
    ph += dt / 1000 * k.n[1] * (reduce ? .2 : 1);
    m[0] += (mouse[0] - m[0]) * .05; m[1] += (mouse[1] - m[1]) * .05;
    if (fallScene && !document.hidden) fallScene.render(dt, depth, m, inChamber);
    if (U) {
      gl.uniform2f(U.r, cv.width, cv.height); gl.uniform2fv(U.m, m); gl.uniform1f(U.ph, ph); gl.uniform1f(U.amt, k.n[0] * (fallScene ? .5 : 1)); gl.uniform1f(U.sharp, k.n[2]); gl.uniform1f(U.rise, k.n[3]); gl.uniform1f(U.ptr, k.n[4]);
      gl.uniform1f(U.nar, innerWidth < 820 ? 1 : 0); gl.uniform1f(U.dk, mode === 'night' ? 1 : 0); gl.uniform1f(U.seed, ts % 97);
      gl.uniform3fv(U.base, k.base); gl.uniform3fv(U.c0, k.c0); gl.uniform3fv(U.c1, k.c1); gl.uniform3fv(U.c2, k.c2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else document.body.style.background = `rgb(${k.base.map(v => Math.round(v * 255))})`;
    // Words are dark on a light ground and light on a dark one.
    const lum = .2126 * k.base[0] + .7152 * k.base[1] + .0722 * k.base[2];
    document.body.classList.toggle('light-now', lum > .5);
    // The colour the phone draws around the page follows the night.
    if ((tcN = (tcN + 1) % 12) === 0 && themeMeta) { const c = 'rgb(' + k.base.map(v => Math.round(v * 255)).join(',') + ')'; if (themeMeta.content !== c) themeMeta.content = c; }
    if (depth > 7.7 && !doneNight) { doneNight = true; mark('night'); }
    const near = Math.round(depth);
    if (near !== shown) {
      shown = near; links.forEach(a => a.classList.toggle('on', +a.dataset.i === near));
      const id = sections.find(s => +s.dataset.depth === near); if (id && history.replaceState && seen >= 0) { try { history.replaceState(null, '', '#' + id.id); } catch (e) { /* Safari limits how often the address may change */ } } seen = 1;
    }
    const mins = Math.round(lerpList(MIN, depth)) + 23 * 60, hh = Math.floor(mins / 60) % 24, mm = mins % 60;
    const clockText = ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2), at = Math.max(0, Math.min(7, Math.round(depth)));
    if (clockEl.textContent !== clockText) { clockEl.textContent = clockText; $('scrub-time').textContent = clockText; }
    if (clockEl.dataset.name !== NAMES[at]) { clockEl.dataset.name = NAMES[at]; $('scrub-name').textContent = NAMES[at]; }
    const ty = railY(depth); thumb.style.transform = 'translateY(' + ty.toFixed(1) + 'px)'; clockEl.style.transform = 'translateY(' + ty.toFixed(1) + 'px) translateY(-50%)';
    requestAnimationFrame(frame);
  }

  // ---- words arrive a few at a time ----
  function words(el, ms) {
    if (el.dataset.split) return; el.dataset.split = '1';
    const text = el.textContent; el.textContent = '';
    text.split(' ').forEach((w, i) => { const sp = document.createElement('span'); sp.className = 'w'; sp.style.transitionDelay = (i * ms) + 'ms'; sp.textContent = w + ' '; el.append(sp); });
  }
  document.querySelectorAll('main h1, main h2').forEach(el => { const em = el.querySelector('em'); if (em) { /* keep the italic clause whole */ } else words(el, 70); });
  document.querySelectorAll('main .plate > .voice blockquote').forEach(el => { words(el, 38); el.querySelectorAll('.w').forEach(sp => { sp.style.transitionDelay = (700 + parseFloat(sp.style.transitionDelay)) + 'ms'; }); });

  // ---- the deep path: the scene opens up and its voices come one at a time ----
  const LAYERS = JSON.parse($('layers').textContent), chamber = $('chamber'); let items = [], at = 0;
  function showItem(i) {
    at = (i + items.length) % items.length; const it = items[at], main = $('chamber-main'); main.textContent = '';
    $('chamber-label').textContent = it.label; $('chamber-by').textContent = it.by || ''; $('chamber-count').textContent = (at + 1) + ' / ' + items.length;
    const link = $('chamber-link'); link.hidden = !it.href; if (it.href) link.href = it.href;
    if (it.kind === 'say') { const p = document.createElement('p'); p.className = 'say'; p.textContent = '“' + it.text + '”'; main.append(p); words(p, 30); }
    else if (it.kind === 'idea') { const h = document.createElement('p'), p = document.createElement('p'); h.className = 'idea-t'; h.textContent = it.title; p.className = 'idea-s'; p.textContent = it.text; main.append(h, p); words(p, 16); }
    else { const box = document.createElement('div'); box.className = 'names'; it.terms.forEach(tm => { const p = document.createElement('p'), lab = document.createElement('span'); lab.className = 'small'; lab.textContent = tm.who; const v = document.createElement(tm.href ? 'a' : 'span'); v.textContent = tm.term; if (tm.href) v.href = tm.href; p.append(lab, v); box.append(p); }); main.append(box); }
    main.querySelectorAll('.w').forEach(sp => { sp.style.opacity = 0; }); requestAnimationFrame(() => requestAnimationFrame(() => main.querySelectorAll('.w').forEach(sp => { sp.style.opacity = ''; })));
  }
  function openChamber(n) {
    const L = LAYERS[n];
    items = [{ kind: 'names', label: L.name + ' · what it has been called', terms: L.terms }]
      .concat(L.quotes.map((v, i) => ({ kind: 'say', label: L.name + ' · voice ' + (i + 1) + ' of ' + L.quotes.length, text: v.text, by: v.by + ' · ' + v.cite })))
      .concat(L.ideas.map(x => ({ kind: 'idea', label: L.name + ' · what was learned here', title: x.title, text: x.short, href: x.href })));
    mark('deeper');
    inChamber = true; document.body.classList.add('in-chamber'); chamber.hidden = false; showItem(1 < items.length ? 1 : 0);
  }
  function closeChamber() { inChamber = false; document.body.classList.remove('in-chamber'); chamber.hidden = true; }
  document.querySelectorAll('.deeper').forEach(b => b.addEventListener('click', () => openChamber(+b.dataset.layer)));
  $('chamber-close').addEventListener('click', closeChamber); $('chamber-next').addEventListener('click', () => showItem(at + 1)); $('chamber-prev').addEventListener('click', () => showItem(at - 1));
  addEventListener('keydown', e => { if (chamber.hidden) return; if (e.key === 'Escape') closeChamber(); if (e.key === 'ArrowRight') showItem(at + 1); if (e.key === 'ArrowLeft') showItem(at - 1); });
  addEventListener('scroll', () => { if (inChamber && Math.abs(readDepth() - depth) > .6) closeChamber(); }, { passive: true });

  // ---- the same material, by date ----
  const sheet = $('dates'), openDates = () => { sheet.hidden = false; }, closeDates = () => { sheet.hidden = true; };
  $('open-dates').addEventListener('click', openDates); $('open-dates-2').addEventListener('click', openDates); $('open-dates-3').addEventListener('click', openDates); $('close-dates').addEventListener('click', closeDates);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDates(); });
  document.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => setTimeout(measure, 50)));

  if (location.hash === '#by-date') openDates();
  addEventListener('resize', size); size(); depth = readDepth();
  requestAnimationFrame(frame);
})();
