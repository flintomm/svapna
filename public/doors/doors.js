// The home page: two doors, both alive. On one side the world, lit where people answered; on the other the body of
// light from Dreaming, moving through three of its forms. One canvas draws both, each inside its own door.
(function () {
  const $ = id => document.getElementById(id), root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Light or night: the visitor's own choice, else the device's.
  const modeBtn = $('mode'), themeMeta = document.querySelector('meta[name=theme-color]');
  const paintMode = () => { const light = root.dataset.mode === 'light'; modeBtn.textContent = light ? 'Night' : 'Light'; if (themeMeta) themeMeta.content = light ? '#ffffff' : '#03040a'; };
  modeBtn.addEventListener('click', () => { root.dataset.mode = root.dataset.mode === 'light' ? 'night' : 'light'; try { localStorage.setItem('svapna_mode', root.dataset.mode); } catch { /* private mode */ } paintMode(); if (scene) scene.restyle(); });
  paintMode();

  // Each door says where a returning visitor left off.
  try {
    const mine = Object.keys(JSON.parse(localStorage.getItem('svapna_answers') || '{}') || {}).length, total = +$('door-q').dataset.total;
    if (mine) $('door-q-go').textContent = mine >= total ? 'You’ve answered all ' + total + ' · See the world →' : 'You’ve answered ' + mine + ' of ' + total + ' · Continue →';
    const at = localStorage.getItem('svapna_night_at'), names = JSON.parse($('door-d').dataset.depths);
    if (at && names[at]) { $('door-d-go').textContent = 'Go back down to ' + names[at] + ' →'; $('door-d').href = '/dream/#' + at; }
  } catch { /* private mode */ }

  const cv = $('doors-gl'), T = window.THREE, doorQ = $('door-q'), doorD = $('door-d'), stage = cv.parentElement;
  let scene = null;
  if (T && cv) scene = (function () {
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch { return null; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.setScissorTest(true); renderer.autoClear = false;
    const night = () => root.dataset.mode !== 'light';
    const dotTex = (function () { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const step = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

    // ---- the world ----
    const sA = new T.Scene(), camA = new T.PerspectiveCamera(32, 1, .1, 50), tiltG = new T.Group(), turn = new T.Group(); tiltG.add(turn); sA.add(tiltG); tiltG.rotation.set(.34, 0, .08);
    const P = (lat, lng, r) => { const a = lat * Math.PI / 180, b = lng * Math.PI / 180; return new T.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)).multiplyScalar(r || 1); };
    const mapC = document.createElement('canvas'); mapC.width = 1536; mapC.height = 768; const mapX = mapC.getContext('2d', { willReadFrequently: true }), mapTex = new T.CanvasTexture(mapC); mapTex.anisotropy = 4;
    const globe = new T.Mesh(new T.SphereGeometry(1, 72, 48), new T.MeshBasicMaterial({ map: mapTex })); turn.add(globe);
    let mask = null; const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = 1536; c.height = 768; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 1536, 768); mask = x.getImageData(0, 0, 1536, 768).data; paintMap(); }; img.src = '/doors/land.png';
    function paintMap() {
      const n = night(), sea = n ? [8, 14, 36] : [238, 242, 251], land = n ? [62, 78, 124] : [29, 36, 64], out = mapX.createImageData(1536, 768), d = out.data;
      for (let i = 0; i < d.length; i += 4) { const k = mask ? mask[i] / 255 : 0; d[i] = sea[0] + (land[0] - sea[0]) * k; d[i + 1] = sea[1] + (land[1] - sea[1]) * k; d[i + 2] = sea[2] + (land[2] - sea[2]) * k; d[i + 3] = 255; }
      mapX.putImageData(out, 0, 0); mapTex.needsUpdate = true;
    }
    paintMap();
    const air = new T.Mesh(new T.SphereGeometry(1.17, 48, 32), new T.ShaderMaterial({ uniforms: { c: { value: new T.Color('#6aa0ff') }, k: { value: 1 } }, transparent: true, side: T.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 c;uniform float k;varying vec3 n;void main(){float a=pow(.72-dot(n,vec3(0.,0.,1.)),3.2);gl_FragColor=vec4(c,clamp(a*k,0.,1.));}' })); sA.add(air);
    // Every passage in the atlas is one light, in the colour of where it sits on its question's scale.
    const L = JSON.parse($('lights').textContent), lp = new Float32Array(L.length * 3), lc = new Float32Array(L.length * 3);
    const TONES = { night: [[70, 120, 255], [255, 190, 40], [0, 220, 170], [150, 150, 165]], light: [[38, 84, 255], [224, 154, 0], [0, 163, 131], [120, 120, 130]] };
    L.forEach((x, i) => { const v = P(x[0], x[1], 1.008); lp.set([v.x, v.y, v.z], i * 3); });
    const lg = new T.BufferGeometry(); lg.setAttribute('position', new T.BufferAttribute(lp, 3)); lg.setAttribute('color', new T.BufferAttribute(lc, 3));
    const lights = new T.Points(lg, new T.PointsMaterial({ size: .05, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true })); turn.add(lights);

    // ---- the night: the body of light, in three of its forms ----
    const sB = new T.Scene(), camB = new T.PerspectiveCamera(40, 1, .1, 200);
    const petalTex = (function () { const c = document.createElement('canvas'); c.width = 96; c.height = 256; const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 256, 0, 0); g.addColorStop(0, 'rgba(255,255,255,.15)'); g.addColorStop(.35, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,.55)');
      x.fillStyle = g; x.beginPath(); x.moveTo(48, 254); x.bezierCurveTo(-18, 170, 2, 60, 48, 2); x.bezierCurveTo(94, 60, 114, 170, 48, 254); x.fill(); return new T.CanvasTexture(c); })();
    const geo = new T.PlaneGeometry(.62, 1.9); geo.translate(0, .95, 0);
    const RINGS = 11, ringN = k => 10 + k * 8; let M = 0; for (let k = 0; k < RINGS; k++) M += ringN(k);
    const body = new T.InstancedMesh(geo, new T.MeshBasicMaterial({ map: petalTex, transparent: true, side: T.DoubleSide, depthWrite: false }), M); body.frustumCulled = false; sB.add(body);
    body.instanceColor = new T.InstancedBufferAttribute(new Float32Array(M * 3), 3);
    const C = h => new T.Color(h), dream = ['#ff4fd8', '#31d8ff', '#ffd24a', '#a070ff', '#3df0c0'].map(C);
    const PAL = { night: { globe: C('#ffe2bd'), a: C('#4fc8ff'), b: C('#d8f6ff') }, light: { globe: C('#20264a'), a: C('#0a84d8'), b: C('#0b2a6a') } };
    const sh = []; for (let k = 0, i = 0; k < RINGS; k++) for (let j = 0; j < ringN(k); j++, i++) { const gy = 1 - 2 * (i + .5) / M, gr = Math.sqrt(1 - gy * gy), ga = i * 2.399963;
      sh.push({ dx: Math.cos(ga) * gr, dy: gy, dz: Math.sin(ga) * gr, r: 1.5 + rnd() * 7, a: rnd() * 6.283, h: (rnd() - .5) * 15, sp: (.25 + rnd() * .9) * (rnd() < .5 ? -1 : 1), wob: rnd() * 6.283, c: dream[i % 5], s: .7 + rnd() * .9,
        k, th: j / ringN(k) * 6.283 + k * .31, rad: .55 + k * .92, ax: new T.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize() }); }
    const up = new T.Vector3(0, 1, 0), v = new T.Vector3(), eu = new T.Euler(), mk = () => ({ p: new T.Vector3(), q: new T.Quaternion(), s: 1, c: new T.Color() }), A = mk(), B = mk(), o = new T.Object3D();
    let pal = PAL.night, isNight = true;
    function pose(kind, p, t, w) {
      if (kind === 0) { const a = t * .12, c = Math.cos(a), s = Math.sin(a), x = p.dx * c - p.dz * s, z = p.dx * s + p.dz * c; w.p.set(x * 5.6, p.dy * 5.6, z * 5.6); w.q.setFromUnitVectors(up, v.set(x, p.dy, z)); w.s = .42 * p.s; w.c.copy(pal.globe); }
      else if (kind === 1) { const a = p.a + t * p.sp; w.p.set(Math.cos(a) * p.r, p.h + Math.sin(t * .6 + p.wob) * 1.2, Math.sin(a) * p.r * .7); w.q.setFromAxisAngle(p.ax, a * 1.7 + p.wob); w.s = p.s; w.c.copy(p.c); if (!isNight) w.c.multiplyScalar(.85); }
      else { const th = p.th + (p.k % 2 ? -1 : 1) * t * .03, rr = p.rad * .72 * (1 + .03 * Math.sin(t * .8)); eu.set(.32 + p.k * .035, 0, th - Math.PI / 2, 'ZXY'); w.q.setFromEuler(eu); w.p.set(Math.cos(th) * rr, Math.sin(th) * rr, -p.k * .12); w.s = p.s * (.88 + p.k * .03); w.c.copy(p.k % 2 ? pal.a : pal.b); if (isNight) w.c.multiplyScalar(.8); }
    }

    function restyle() {
      isNight = night(); pal = isNight ? PAL.night : PAL.light; paintMap();
      const tn = isNight ? TONES.night : TONES.light; L.forEach((x, i) => { const c = tn[x[2]] || tn[3]; lc.set([c[0] / 255, c[1] / 255, c[2] / 255], i * 3); }); lg.attributes.color.needsUpdate = true;
      lights.material.blending = isNight ? T.AdditiveBlending : T.NormalBlending; lights.material.size = isNight ? .085 : .04;
      air.material.blending = isNight ? T.AdditiveBlending : T.NormalBlending; air.material.uniforms.c.value.set(isNight ? '#6aa0ff' : '#9bb8ff'); air.material.uniforms.k.value = isNight ? .55 : .5;
      body.material.blending = isNight ? T.AdditiveBlending : T.NormalBlending; body.material.opacity = isNight ? .78 : .86;
    }
    restyle();

    const mouse = [0, 0], m = [0, 0], warm = [0, 0];       // warm: how much each door is being pointed at
    addEventListener('pointermove', e => { mouse[0] = e.clientX / innerWidth - .5; mouse[1] = .5 - e.clientY / innerHeight; });
    let hot = -1; [doorQ, doorD].forEach((d, i) => { d.addEventListener('pointerenter', () => { hot = i; }); d.addEventListener('pointerleave', () => { if (hot === i) hot = -1; }); d.addEventListener('focus', () => { hot = i; }); d.addEventListener('blur', () => { if (hot === i) hot = -1; }); });
    const size = () => { renderer.setSize(stage.clientWidth, stage.clientHeight, false); };
    addEventListener('resize', size); size();
    let onScreen = true; if ('IntersectionObserver' in window) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }).observe(stage);
    const t16 = Math.tan(16 * Math.PI / 180), t20 = Math.tan(20 * Math.PI / 180);
    function view(el, cam, fn) {
      const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), x = r.left - s.left, y = s.bottom - r.bottom, w = r.width, h = r.height; if (w < 2 || h < 2) return;
      renderer.setViewport(x, y, w, h); renderer.setScissor(x, y, w, h); cam.aspect = w / h; fn(w, h); cam.updateProjectionMatrix();
    }
    let last = 0, tt = 0, born = 0;
    function frame(ts) {
      requestAnimationFrame(frame); const dt = Math.min(64, ts - last || 16); last = ts; if (!onScreen || document.hidden) return;
      const t = (tt += dt / 1000 * (reduce ? .15 : 1)); born = Math.min(1, born + dt / 1400);
      m[0] += (mouse[0] - m[0]) * Math.min(1, dt / 300); m[1] += (mouse[1] - m[1]) * Math.min(1, dt / 300);
      for (let i = 0; i < 2; i++) warm[i] += ((hot === i ? 1 : 0) - warm[i]) * Math.min(1, dt / 400);
      renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
      // The world: turning slowly, sitting in the upper part of its door, a little nearer when pointed at.
      view(doorQ, camA, (w, h) => { const a = w / h, fr = h < 520 ? .4 : .47, off = h < 520 ? .42 : a > 1 ? .27 : .34, d = Math.max(1 / (fr * t16), 1 / (.8 * t16 * a)) * (1 - warm[0] * .08); camA.position.set(m[0] * .25, m[1] * .15, d); camA.lookAt(0, 0, 0); tiltG.position.set(0, d * t16 * off, 0); air.position.copy(tiltG.position); });
      turn.rotation.y = t * .05 - 3.5;           // opens on Asia and turns west, across the most crowded part of the map lights.material.opacity = born;
      renderer.render(sA, camA);
      // The night: a globe of small lights, then the storm, then the lotus, and round again.
      const cyc = (t % 27) / 9, seg = Math.floor(cyc), e = step(.68, 1, cyc - seg), ka = seg, kb = (seg + 1) % 3;
      for (let i = 0; i < M; i++) { const p = sh[i]; pose(ka, p, t, A); if (e > .001) { pose(kb, p, t, B); A.p.lerp(B.p, e); A.q.slerp(B.q, e); A.s += (B.s - A.s) * e; A.c.lerp(B.c, e); }
        o.position.copy(A.p); o.quaternion.copy(A.q); o.scale.set(A.s, A.s, 1); o.updateMatrix(); body.setMatrixAt(i, o.matrix); body.setColorAt(i, A.c); }
      body.instanceMatrix.needsUpdate = true; body.instanceColor.needsUpdate = true; body.material.opacity = born * (isNight ? .78 : .86);
      view(doorD, camB, (w, h) => { const a = w / h, fr = h < 520 ? .4 : .47, off = h < 520 ? .42 : a > 1 ? .27 : .34, d = Math.max(9.5 / (fr * t20), 9.5 / (.8 * t20 * a)) * (1 - warm[1] * .08); camB.position.set(m[0] * 2, -d * t20 * off + m[1] * 1.4, d); camB.lookAt(0, -d * t20 * off, 0); });
      renderer.render(sB, camB);
    }
    requestAnimationFrame(frame);
    cv.addEventListener('webglcontextlost', e => e.preventDefault()); cv.addEventListener('webglcontextrestored', () => location.reload());
    return { restyle };
  })();
})();
