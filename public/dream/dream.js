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
  function size() { if (fallScene) fallScene.size(); cv.width = Math.round(innerWidth * .5); cv.height = Math.round(innerHeight * .5); if (gl) gl.viewport(0, 0, cv.width, cv.height); measure(); }
  const mouse = [0, 0], m = [0, 0];
  addEventListener('pointermove', e => { mouse[0] = e.clientX / innerWidth - .5; mouse[1] = .5 - e.clientY / innerHeight; });

  // ---- the fall: a column of space the camera sinks through, with its own scene at each depth ----
  document.documentElement.className = 'js';
  const UNIT = 34;                                    // world units between depths
  const fallScene = (function () {
    const cv3 = $('fall'), T = window.THREE; if (!T || !cv3) return null;
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: cv3, antialias: true, alpha: true }); } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(55, 1, .1, 400);
    const night = () => mode === 'night';
    const add = () => (night() ? T.AdditiveBlending : T.NormalBlending);
    // A soft round dot, used for motes, glows and the sun.
    const dotTex = (function () { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    let seed = 5; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const bell = (d, c, w) => Math.max(0, 1 - Math.abs(d - c) / w), step = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const X0 = () => (innerWidth < 820 ? 0 : 7);       // scenes sit to the right of the words on wide screens

    // Motes fill the whole column. They are still; the camera's fall makes them rise.
    const N = 5200, mp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const a = rnd() * 6.283, r = 3 + rnd() * 26; mp[i * 3] = Math.cos(a) * r; mp[i * 3 + 1] = 14 - rnd() * (UNIT * 9.6 + 28); mp[i * 3 + 2] = -6 - Math.abs(Math.sin(a)) * r - rnd() * 30; }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3));
    const motes = new T.Points(mg, new T.PointsMaterial({ size: .5, map: dotTex, transparent: true, depthWrite: false, sizeAttenuation: true })); scene.add(motes);

    // 0 Awake: restless, sharp strokes.
    const LN = 420, lp = new Float32Array(LN * 6);
    for (let i = 0; i < LN; i++) { const x = (rnd() - .5) * 26, y = (rnd() - .5) * 20, z = -8 - rnd() * 26, a = rnd() * 6.283, l = .3 + rnd() * 1.6; lp.set([x, y, z, x + Math.cos(a) * l, y + Math.sin(a) * l, z], i * 6); }
    const lg = new T.BufferGeometry(); lg.setAttribute('position', new T.BufferAttribute(lp, 3));
    const strokes = new T.LineSegments(lg, new T.LineBasicMaterial({ transparent: true })); scene.add(strokes);

    // 1 Drifting: large soft shapes and half-formed figures.
    const blobs = []; const blobCols = ['#8f7bff', '#ffb7a0', '#3fc7c9', '#b9a0ff', '#ffd0b8'];
    for (let i = 0; i < 12; i++) { const sp = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: blobCols[i % 5], transparent: true, depthWrite: false })); sp.userData = { x: (rnd() - .5) * 26, y: (rnd() - .5) * 22, z: -10 - rnd() * 22, s: 7 + rnd() * 12, p: rnd() * 6.283 }; scene.add(sp); blobs.push(sp); }
    const forms = []; for (let i = 0; i < 4; i++) { const m = new T.LineSegments(new T.WireframeGeometry(i % 2 ? new T.IcosahedronGeometry(2.6, 0) : new T.TorusKnotGeometry(1.6, .5, 40, 6)), new T.LineBasicMaterial({ transparent: true })); m.userData = { x: (rnd() - .5) * 16, y: (rnd() - .5) * 12, z: -12 - rnd() * 10, p: rnd() * 6.283 }; scene.add(m); forms.push(m); }

    // 2 Deep sleep: one long slow wave, barely there.
    const WN = 160, wp = new Float32Array(WN * 3), wg = new T.BufferGeometry(); wg.setAttribute('position', new T.BufferAttribute(wp, 3));
    const wave = new T.Line(wg, new T.LineBasicMaterial({ color: 0x8090c8, transparent: true })); scene.add(wave);

    // 3-5 The dream: shards that swirl (dreaming), lock into a lattice (lucid), then answer the pointer (working).
    const M = 900, shardGeo = new T.TetrahedronGeometry(.27), shards = new T.InstancedMesh(shardGeo, new T.MeshBasicMaterial({ transparent: true }), M);
    const sh = [], dreamCols = ['#ff4fd8', '#31d8ff', '#ffd24a', '#a070ff', '#3df0c0'].map(c => new T.Color(c)), clearA = new T.Color('#bff6ff'), clearB = new T.Color('#ffffff'), tmpC = new T.Color();
    const G = Math.ceil(Math.cbrt(M));
    for (let i = 0; i < M; i++) { const gx = i % G, gy = Math.floor(i / G) % G, gz = Math.floor(i / (G * G));
      sh.push({ r: 1.5 + rnd() * 8.5, a: rnd() * 6.283, h: (rnd() - .5) * 20, sp: (.25 + rnd() * .9) * (rnd() < .5 ? -1 : 1), wob: rnd() * 6.283, c: dreamCols[i % 5], lx: (gx - (G - 1) / 2) * 1.2, ly: (gy - (G - 1) / 2) * 1.2, lz: (gz - (G - 1) / 2) * 1.2, s: .6 + rnd() * 1.2, late: i > M * .45 }); }
    shards.instanceColor = new T.InstancedBufferAttribute(new Float32Array(M * 3), 3); scene.add(shards);
    const flare = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0xffffff, transparent: true, depthWrite: false })); scene.add(flare);

    // 6 The ground: a horizon and one wide, still light.
    const ring = new T.Mesh(new T.TorusGeometry(46, .03, 6, 220), new T.MeshBasicMaterial({ color: 0xaab4ff, transparent: true })); ring.rotation.x = Math.PI / 2; scene.add(ring);
    const vast = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0x4a55d8, transparent: true, depthWrite: false })); scene.add(vast);
    // 7 Morning: light coming up from below.
    const sun = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: 0xffc98a, transparent: true, depthWrite: false })); scene.add(sun);

    const o = new T.Object3D(), AXIS = new T.Vector3(.5, .7, .3).normalize(), ptr = new T.Vector3(), colA = new T.Color('#0a84d8'), colB = new T.Color('#0b2a6a');
    let Ls = 0, tAcc = 0, lastSnap = 0, wasLucid = false, push = 0;
    return {
      size() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); },
      render(dt, d, mouse, inChamber) {
        const t = (tAcc += dt / 1000), ad = add(), x0 = X0(), n = night();
        const y = -Math.max(-.6, d) * UNIT;
        // How much each scene is present at this depth.
        const w0 = 1 - step(.35, 1.05, d), w1 = bell(d, 1, .95), w2 = bell(d, 2, .8), wd = step(2.45, 3, d) * (1 - step(5.5, 6.1, d)), w6 = bell(d, 6, .95), w7 = step(6.5, 7.1, d);
        const lucid = step(3.5, 3.72, d), work = step(4.55, 5, d) * (1 - step(5.5, 6, d));
        Ls += (lucid - Ls) * Math.min(1, dt / 150);                 // the snap is quick
        if (lucid > .5 && !wasLucid && performance.now() - lastSnap > 1500) { lastSnap = performance.now(); const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); if (audio && audio.on) chime(); }
        wasLucid = lucid > .5;
        push += ((inChamber ? 1 : 0) - push) * Math.min(1, dt / 500);

        // The camera: restless when awake, rolling as sleep comes, still in deep sleep, swept round in the dream,
        // locked steady once lucid, wide and slow on the ground, tilting up toward morning.
        const jit = w0 * .05, roll = w1 * Math.sin(t * .23) * .16 + wd * (1 - Ls) * Math.sin(t * .5) * .1;
        cam.position.set(mouse[0] * 1.2 + Math.sin(t * 13) * jit, y + mouse[1] * .8 + Math.cos(t * 11) * jit, 4 - push * (innerWidth < 820 ? 1.5 : 5));
        cam.rotation.set(-.04 + w7 * .16 + mouse[1] * .05, -mouse[0] * .06 + wd * (1 - Ls) * Math.sin(t * .31) * .12, roll);
        const fov = 55 + wd * (1 - Ls) * 16 - Ls * wd * 9 + w6 * 26 - push * 12; if (Math.abs(cam.fov - fov) > .05) { cam.fov += (fov - cam.fov) * Math.min(1, dt / 400); cam.updateProjectionMatrix(); }

        // Motes thin to nothing in deep sleep and turn gold near morning.
        const dens = .85 * (1 - bell(d, 2, 1.15)) * (1 - .6 * w6);
        motes.material.blending = ad; motes.material.opacity = Math.max(0, dens) * (n ? .8 : .55);
        motes.material.color.set(n ? '#cfd8ff' : '#2a2f55').lerp(tmpC.set(n ? '#ffd9a0' : '#c2702a'), w7).lerp(tmpC.set(n ? '#bff6ff' : '#0a6fd0'), Ls * wd * .7);
        motes.material.size = .34 + w1 * .9 + w6 * .5;                 // soft and large while drifting

        strokes.visible = w0 > .01; strokes.position.y = 0;
        strokes.rotation.z = Math.sin(t * 9) * .012 + Math.sin(t * 23) * .006; strokes.material.opacity = w0 * (n ? .5 : .55); strokes.material.color.set(n ? '#ffd6a8' : '#1a1f3a'); strokes.material.blending = ad;
        strokes.position.x = x0 + Math.sin(t * 17) * .05;

        blobs.forEach(sp => { const u = sp.userData; sp.visible = w1 > .01; sp.position.set(x0 + u.x + Math.sin(t * .11 + u.p) * 3, -UNIT + u.y + Math.cos(t * .09 + u.p) * 2.4, u.z); sp.scale.setScalar(u.s * (1 + .12 * Math.sin(t * .2 + u.p))); sp.material.opacity = w1 * (n ? .3 : .42); sp.material.blending = ad; });
        forms.forEach(m => { const u = m.userData; m.visible = w1 > .01; m.position.set(x0 + u.x, -UNIT + u.y + Math.sin(t * .13 + u.p) * 1.5, u.z); m.rotation.set(t * .05 + u.p, t * .07, 0); m.material.opacity = w1 * (.1 + .1 * Math.sin(t * .31 + u.p)); m.material.color.set(n ? '#ffffff' : '#30306a'); });

        wave.visible = w2 > .01; if (wave.visible) { for (let i = 0; i < WN; i++) { const u = i / (WN - 1); wp[i * 3] = x0 - 4 + (u - .5) * 44; wp[i * 3 + 1] = -2 * UNIT + Math.sin(u * 7 - t * .5) * 1.7 * Math.sin(u * 3.14); wp[i * 3 + 2] = -16; } wg.attributes.position.needsUpdate = true; wave.material.opacity = w2 * .22; }

        // The dream.
        shards.visible = wd > .01;
        if (shards.visible) {
          const nar = innerWidth < 820, cyC = -UNIT * Math.max(3, Math.min(5.3, d)) + (nar ? 13 : 0), cz = nar ? -42 : -19, spin = t * .06;
          ptr.set(x0 + mouse[0] * 26 - 4, cyC + mouse[1] * 14, cz);
          for (let i = 0; i < M; i++) { const p = sh[i], a = p.a + t * p.sp * (1 - Ls * .97);
            // swirling
            let px = x0 + Math.cos(a) * p.r, py = cyC + p.h + Math.sin(t * .6 + p.wob) * 1.2, pz = cz + Math.sin(a) * p.r * .7;
            // lattice, turning slowly as one body
            const lx = p.lx * Math.cos(spin) - p.lz * Math.sin(spin), lz = p.lx * Math.sin(spin) + p.lz * Math.cos(spin);
            const e = Ls * Ls * (3 - 2 * Ls); px += (x0 + lx - px) * e; py += (cyC + p.ly - py) * e; pz += (cz + lz - pz) * e;
            let sc = p.s * wd * (p.late ? Math.max(1 - Ls, work) : 1);   // the later half vanish at lucidity and return, multiplied, when the dream is worked
            if (work > 0) { const dx = px - ptr.x, dy = py - ptr.y, dist = Math.hypot(dx, dy) + .001, f = work * Math.max(0, 1 - dist / 7); px += dx / dist * f * 2.4; py += dy / dist * f * 2.4; pz += f * 2.5; sc *= 1 + f * 1.1; }
            o.position.set(px, py, pz); o.quaternion.setFromAxisAngle(AXIS, a * (1 - Ls) + p.wob); o.scale.setScalar(Math.max(.0001, sc)); o.updateMatrix(); shards.setMatrixAt(i, o.matrix);
            tmpC.copy(p.c); if (!n) tmpC.multiplyScalar(.8); tmpC.lerp(n ? (i % 3 ? clearA : clearB) : (i % 3 ? colA : colB), e * (1 - work));
            if (work > 0) tmpC.offsetHSL(work * (.15 * Math.sin(t * .7 + p.wob) + (px - x0) * .012), 0, 0);
            shards.setColorAt(i, tmpC); }
          shards.instanceMatrix.needsUpdate = true; shards.instanceColor.needsUpdate = true; shards.material.opacity = Math.min(1, wd * 1.2) * (n ? .9 - work * .35 : .9); shards.material.blending = n ? T.AdditiveBlending : T.NormalBlending;
          const since = (performance.now() - lastSnap) / 1000; flare.visible = Ls > .02 && wd > .1; flare.position.set(x0, cyC, cz); flare.scale.setScalar(10 + 60 * Math.exp(-since * 2.2)); flare.material.opacity = Ls * wd * (.25 + .7 * Math.exp(-since * 2)) * (1 - work * .6); flare.material.blending = ad; flare.material.color.set(n ? '#dffaff' : '#8fd8ff');
        } else flare.visible = false;

        ring.visible = vast.visible = w6 > .01; ring.position.set(x0, -6 * UNIT - 3, -30); ring.rotation.z = t * .01; ring.material.opacity = w6 * (n ? .5 : .6); ring.material.color.set(n ? '#aab4ff' : '#3a3fa0');
        vast.position.set(x0 + 4, -6 * UNIT + 2, -70); vast.scale.setScalar(150); vast.material.opacity = w6 * (n ? .5 : .35); vast.material.blending = ad;
        sun.visible = w7 > .01; sun.position.set(x0, -7 * UNIT - 26 + step(6.5, 8, d) * 30, -55); sun.scale.setScalar(70 + w7 * 60); sun.material.opacity = w7 * (n ? .95 : .6); sun.material.blending = ad;
        renderer.render(scene, cam);
      },
    };
  })();

  // ---- optional sound, off until asked for: a drone and breath of noise that follow the depth, a chime at lucidity ----
  let audio = null;
  function chime() {
    const c = audio.ctx, t = c.currentTime;
    [880, 1318.5, 1760].forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05 / (i + 1), t + .02 + i * .06); g.gain.exponentialRampToValueAtTime(.0001, t + 2.6); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 2.8); });
  }
  $('sound').addEventListener('click', () => {
    if (!audio) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const ctx = new A(), out = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; out.gain.value = 0;
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), o3 = ctx.createOscillator(), g2 = ctx.createGain(), g3 = ctx.createGain(); o1.type = 'sine'; o2.type = 'sine'; o3.type = 'triangle'; g2.gain.value = .35; g3.gain.value = .12;
      // a breath of filtered noise, like air moving
      const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true; const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.Q.value = .7; const ng = ctx.createGain(); ng.gain.value = 0;
      noise.connect(nf); nf.connect(ng); ng.connect(out);
      o1.connect(lp); o2.connect(g2); g2.connect(lp); o3.connect(g3); g3.connect(lp); lp.connect(out); out.connect(ctx.destination); o1.start(); o2.start(); o3.start(); noise.start();
      audio = { ctx, out, lp, o1, o2, o3, nf, ng, on: false };
    }
    audio.on = !audio.on; if (audio.on) audio.ctx.resume();
    $('sound').textContent = audio.on ? 'Sound on' : 'Sound off'; $('sound').setAttribute('aria-pressed', String(audio.on));
  });

  // ---- frame ----
  let last = 0, ph = 0, shown = 99, inChamber = false;
  function frame(ts) {
    const dt = Math.min(64, ts - last || 16); last = ts;
    const want = readDepth(); depth += (want - depth) * (reduce ? 1 : Math.min(1, dt / 260));
    const tbl = mode === 'light' ? LIGHT : NIGHT, k = row(tbl, depth);
    ph += dt / 1000 * k.n[1] * (reduce ? .2 : 1);
    m[0] += (mouse[0] - m[0]) * .05; m[1] += (mouse[1] - m[1]) * .05;
    if (fallScene) fallScene.render(dt, depth, m, inChamber);
    if (U) {
      gl.uniform2f(U.r, cv.width, cv.height); gl.uniform2fv(U.m, m); gl.uniform1f(U.ph, ph); gl.uniform1f(U.amt, k.n[0] * (fallScene ? .5 : 1)); gl.uniform1f(U.sharp, k.n[2]); gl.uniform1f(U.rise, k.n[3]); gl.uniform1f(U.ptr, k.n[4]);
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
      audio.o3.frequency.setTargetAtTime(f * 2.005, t, .6); audio.nf.frequency.setTargetAtTime(300 + 1800 * k.n[1], t, .8); audio.ng.gain.setTargetAtTime(.5 * (1 - Math.max(0, 1 - Math.abs(depth - 2) / 1.1)) * k.n[0], t, .8);
      audio.lp.frequency.setTargetAtTime(200 + 1400 * k.n[0], t, .6); audio.out.gain.setTargetAtTime(audio.on ? .07 * lerpList(LOUD, depth) : 0, t, .4);
    }
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
    inChamber = true; document.body.classList.add('in-chamber'); chamber.hidden = false; showItem(1 < items.length ? 1 : 0);
  }
  function closeChamber() { inChamber = false; document.body.classList.remove('in-chamber'); chamber.hidden = true; }
  document.querySelectorAll('.deeper').forEach(b => b.addEventListener('click', () => openChamber(+b.dataset.layer)));
  $('chamber-close').addEventListener('click', closeChamber); $('chamber-next').addEventListener('click', () => showItem(at + 1)); $('chamber-prev').addEventListener('click', () => showItem(at - 1));
  addEventListener('keydown', e => { if (chamber.hidden) return; if (e.key === 'Escape') closeChamber(); if (e.key === 'ArrowRight') showItem(at + 1); if (e.key === 'ArrowLeft') showItem(at - 1); });
  addEventListener('scroll', () => { if (inChamber && Math.abs(readDepth() - depth) > .6) closeChamber(); }, { passive: true });

  // ---- the same material, by date ----
  const sheet = $('dates'), openDates = () => { sheet.hidden = false; }, closeDates = () => { sheet.hidden = true; };
  $('open-dates').addEventListener('click', openDates); $('open-dates-2').addEventListener('click', openDates); $('close-dates').addEventListener('click', closeDates);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDates(); });
  document.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => setTimeout(measure, 50)));

  addEventListener('resize', size); size(); depth = readDepth();
  requestAnimationFrame(frame);
})();
