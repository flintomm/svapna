// Prototype: Svapna as one continuous space. A question, the world lit by everyone who answered it,
// and their words one at a time. Data is the Globe of Thought's verified passages.
(function () {
  const atlas = window.PILOT_EVIDENCE, land = window.PILOT_LAND;
  const $ = id => document.getElementById(id);
  // Looks: ?v=paper (default), ?v=field, ?v=ink, ?v=night (the first prototype).
  // Night mode is the cinematic 3D world; light mode is the aurora with the world drawn in points.
  // The visitor's own choice wins, then the device's setting. ?v= still picks any look outright.
  let pref = null; try { pref = localStorage.getItem('svapna_mode'); } catch (e) { /* private mode */ }
  const MODE = pref === 'light' || pref === 'night' ? pref : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'night');
  const V0 = new URLSearchParams(location.search).get('v') || (MODE === 'light' ? 'aurora' : 'cine'), DAY = V0 === 'day', V = DAY ? 'aurora' : V0;
  { const b = document.getElementById('mode');
    if (b) {
      const light = V !== 'cine' && V !== 'night' && V !== 'ink';
      b.textContent = light ? 'Night' : 'Light'; b.setAttribute('aria-label', light ? 'Switch to night mode' : 'Switch to light mode');
      b.addEventListener('click', () => {
        try { localStorage.setItem('svapna_mode', light ? 'night' : 'light'); } catch (e) { /* private mode */ }
        const u = new URL(location.href); u.searchParams.delete('v'); location.replace(u.toString()); if (!u.search && u.href === location.href) location.reload();
      });
    } }
  { const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = V === 'cine' ? '#03040a' : '#ffffff'; }
  if (DAY) document.body.dataset.three = '1';
  document.body.dataset.v = V;
  const LOOK = {
    night: { rgb: { low: [91, 140, 255], mid: [240, 199, 94], high: [255, 107, 74], none: [154, 163, 184] }, dots: false, blend: 'lighter', land: '255,255,255', ring: '#fff' },
    cine: { rgb: { low: [70, 120, 255], mid: [255, 190, 40], high: [0, 220, 170], none: [150, 150, 165] }, dots: true, blend: 'lighter', land: '255,255,255', ring: '#fff', through: true },
    aurora: { rgb: { low: [46, 91, 255], mid: [255, 176, 0], high: [255, 43, 112], none: [110, 110, 120] }, dots: true, blend: 'source-over', land: '10,10,24', ring: '#000', through: true },
    paper: { rgb: { low: [36, 76, 255], mid: [255, 170, 0], high: [255, 61, 46], none: [120, 120, 120] }, dots: true, blend: 'multiply', land: '20,20,20', ring: '#111' },
    field: { rgb: { low: [40, 60, 255], mid: [255, 180, 0], high: [255, 45, 85], none: [90, 90, 90] }, dots: true, blend: 'source-over', land: '20,10,40', ring: '#111' },
    ink: { rgb: { low: [120, 160, 255], mid: [255, 220, 90], high: [200, 255, 60], none: [130, 130, 130] }, dots: true, blend: 'lighter', land: '255,255,255', ring: '#fff' },
  }[V] || null;
  const L = LOOK || { rgb: { low: [36, 76, 255], mid: [255, 170, 0], high: [255, 61, 46], none: [120, 120, 120] }, dots: true, blend: 'multiply', land: '20,20,20', ring: '#111' };
  // Palettes for the aurora look: ?c=tide (default), dusk, glacier, ember, rose (the first one).
  const PALETTES = {
    tide: { low: [38, 84, 255], mid: [255, 178, 0], high: [0, 184, 148] },
    dusk: { low: [124, 92, 255], mid: [255, 170, 120], high: [0, 178, 200] },
    glacier: { low: [20, 60, 240], mid: [0, 200, 230], high: [170, 230, 0] },
    ember: { low: [64, 64, 210], mid: [255, 196, 64], high: [255, 112, 32] },
    rose: { low: [46, 91, 255], mid: [255, 176, 0], high: [255, 43, 112] },
  };
  // Each visit gets the next palette in turn. It holds for the whole visit and changes on the next one;
  // ?c=name picks one outright.
  const ROTATION = ['tide', 'dusk', 'glacier', 'ember'];
  const C = new URLSearchParams(location.search).get('c') || (function () {
    try {
      let now = sessionStorage.getItem('svapna_palette');
      if (!now) {
        const n = (parseInt(localStorage.getItem('svapna_palette_turn') || '-1', 10) + 1) % ROTATION.length;
        localStorage.setItem('svapna_palette_turn', String(n)); now = ROTATION[n]; sessionStorage.setItem('svapna_palette', now);
      }
      return now;
    } catch (e) { return ROTATION[Math.floor(Date.now() / 864e5) % ROTATION.length]; }
  })();
  const CINE = V === 'cine' || DAY;
  const RGB = (V === 'aurora' || CINE) && PALETTES[C] ? { ...PALETTES[C], none: [110, 110, 120] } : L.rgb;
  for (const k of ['low', 'mid', 'high']) document.body.style.setProperty('--' + k, `rgb(${RGB[k]})`);
  // Land as a field of dots: a grid of points kept where they fall on land.
  let landDots = null;
  function makeDots() {
    landDots = [];
    for (let lat = -58; lat <= 82; lat += 2.4) {
      const step = 2.4 / Math.max(.25, Math.cos(lat * Math.PI / 180));
      for (let lng = -180; lng < 180; lng += step) if (d3.geoContains(land, [lng, lat])) landDots.push([lng, lat]);
    }
  }
  const css = tone => `rgb(${RGB[tone]})`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The experience speaks plainly and warmly: its own wording for each question and answer, and an order
  // that opens gently and reaches the heavier questions later. The atlas's own wording is unchanged.
  const WARM = {
    happiness: ['Where does happiness come from?', ['The life around me', 'A bit of both', 'Within me']],
    'solitude-or-company': ['Are we better alone or together?', ['Alone', 'Both have a place', 'Together']],
    relationships: ['How much do the people around us make us who we are?', ['Not much', 'They help', 'Completely']],
    'inward-or-others': ['Do we find ourselves by looking inward, or through others?', ['Inward', 'Both', 'Through others']],
    'given-or-made': ['Are we born who we are, or do we become it?', ['Born', 'Both', 'We become it']],
    meaning: ['Is the meaning of a life found or made?', ['There is none', 'We make it', 'It is given']],
    'self-or-others-first': ['Whose good comes first: mine or other people’s?', ['Mine', 'They are bound together', 'Other people’s']],
    desire: ['What should we do with what we want?', ['Let it go', 'Train it', 'Follow it']],
    'free-will': ['Are we free to choose?', ['No', 'Within limits', 'Yes']],
    truth: ['Can the deepest truth be known?', ['No', 'In part', 'Yes']],
    'lasting-self': ['Is there a lasting “me”?', ['No', 'A changing one', 'Yes']],
    'ultimate-reality': ['Is there a God, or something ultimate?', ['No', 'Beyond words', 'Yes']],
    suffering: ['Does suffering have a purpose?', ['None', 'It can be used', 'It has meaning']],
    death: ['What happens when we die?', ['It ends', 'We cannot know', 'Something continues']],
  };
  const ORDER = Object.keys(WARM), GENTLE = 6;
  const questions = atlas.questions.filter(q => atlas.cards.some(c => c.readings[q.id]))
    .sort((a, b) => (ORDER.indexOf(a.id) + 99) % 99 - (ORDER.indexOf(b.id) + 99) % 99);
  const ask_ = q => (WARM[q.id] ? WARM[q.id][0] : q.question);
  const say = (q, step) => { const i = q.scale.filter(x => x.tone !== 'none').indexOf(step); return WARM[q.id] && i >= 0 ? WARM[q.id][1][i] : step.label; };

  let first = true;
  let q, scale, tones, cards, shown, answer = null, filter = 'all', at = 0, mode = 'ask', drifting = true, driftTimer = 0;
  // The globe on its own: turned freely, with time run across it. t counts passages in order of date.
  const G = { t: 0, w: 0, year: 0, play: false, hide: new Set(), zoom: 1, vel: 0, shownAt: -1 };

  // ---- colour field (aurora look): a slow fluid of the three answer colours, drawn by a shader ----
  const field = (function () {
    const c = $('gl'); if (!c || (V !== 'aurora' && !CINE)) return null;
    const g = c.getContext('webgl', { antialias: false, alpha: false }); if (!g) return null;
    const vs = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    const fs = `precision highp float;uniform vec2 r;uniform float t,nar,dk;uniform vec3 c0,c1,c2,w;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(11.3,7.1);a*=.5;}return v;}
void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y;p+=m*.06;
 vec2 q=p+.55*vec2(fbm(p*1.1+t*.035),fbm(p*1.1-t*.03+9.));
 vec2 s=q+.35*vec2(fbm(q*1.7+t*.05+3.),fbm(q*1.7-t*.04+21.));
 float a=smoothstep(.42,.78,fbm(s*1.15+vec2(0.,t*.02)))*w.x;
 float b=smoothstep(.44,.8,fbm(s*1.15+vec2(31.,-t*.025)))*w.y;
 float d=smoothstep(.46,.82,fbm(s*1.15+vec2(-17.,t*.03)+5.))*w.z;
 vec3 base=mix(vec3(1.),vec3(.012,.014,.03),dk);float amt=mix(1.,.42,dk);
 vec3 col=base;col=mix(col,c2,d*.9*amt);col=mix(col,c1,b*.82*amt);col=mix(col,c0,a*.86*amt);
 float keep=mix(smoothstep(-.95,.25,p.x),smoothstep(-.1,.55,p.y),nar);
 col=mix(base,col,.16+.84*keep);
 col*=mix(1.,1.-.55*smoothstep(.35,1.05,length(p*vec2(.8,1.))),dk);
 col+=(h(gl_FragCoord.xy+t)-.5)*.035;
 gl_FragColor=vec4(col,1.);}`;
    const sh = (type, src) => { const o = g.createShader(type); g.shaderSource(o, src); g.compileShader(o); return o; };
    const pr = g.createProgram(); g.attachShader(pr, sh(g.VERTEX_SHADER, vs)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs)); g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
    g.useProgram(pr);
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(pr, 'a'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['r', 't', 'nar', 'dk', 'c0', 'c1', 'c2', 'w', 'm'].map(n => [n, g.getUniformLocation(pr, n)]));
    const w = [.85, .85, .85], m = [0, 0];
    return {
      size() { c.width = Math.round(innerWidth * .5); c.height = Math.round(innerHeight * .5); g.viewport(0, 0, c.width, c.height); },
      draw(t, want, mouse) {
        for (let i = 0; i < 3; i++) w[i] += (want[i] - w[i]) * .03;
        m[0] += (mouse[0] - m[0]) * .04; m[1] += (mouse[1] - m[1]) * .04;
        g.uniform2f(U.r, c.width, c.height); g.uniform1f(U.t, t); g.uniform1f(U.nar, innerWidth < 820 ? 1 : 0); g.uniform1f(U.dk, CINE && !DAY ? 1 : 0);
        g.uniform3fv(U.c0, RGB.low.map(v => v / 255)); g.uniform3fv(U.c1, RGB.mid.map(v => v / 255)); g.uniform3fv(U.c2, RGB.high.map(v => v / 255));
        g.uniform3fv(U.w, w); g.uniform2fv(U.m, m);
        g.drawArrays(g.TRIANGLES, 0, 3);
      },
    };
  })();
  const mouse = [0, 0];
  addEventListener('pointermove', e => { mouse[0] = e.clientX / innerWidth - .5; mouse[1] = .5 - e.clientY / innerHeight; });
  // The field leans toward the colour of the answer given, or of the voice being heard.
  function fieldWant() {
    const tone = mode === 'voice' && shown && shown[at] ? tones[shown[at].score] : answer ? tones[answer] : null;
    return ['low', 'mid', 'high'].map(k => (tone ? (k === tone ? 1.25 : .28) : .85));
  }

  // ---- the world in three dimensions (cine look): solid continents, light rising where people answered ----
  const w3 = (function () {
    const cv = $('w3'); if (!CINE || !cv || !window.THREE) return null;
    const T = window.THREE; let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .1, 100);
    const tilt = new T.Group(), turn = new T.Group(); tilt.add(turn); scene.add(tilt);
    const P = (lat, lng, r) => { const a = lat * Math.PI / 180, b = lng * Math.PI / 180; return new T.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)).multiplyScalar(r || 1); };
    // The map is painted once: deep water, clear land, a hairline coast.
    const tw = 4096, th = 2048, tc = document.createElement('canvas'); tc.width = tw; tc.height = th;
    const tx2 = tc.getContext('2d'), eq = d3.geoEquirectangular().translate([tw / 2, th / 2]).scale(tw / (2 * Math.PI)), pth = d3.geoPath(eq, tx2);
    tx2.fillStyle = DAY ? '#eef2fb' : '#060b1a'; tx2.fillRect(0, 0, tw, th);
    tx2.beginPath(); pth(d3.geoGraticule10()); tx2.strokeStyle = DAY ? 'rgba(10,20,60,.07)' : 'rgba(255,255,255,.05)'; tx2.lineWidth = 1.5; tx2.stroke();
    tx2.beginPath(); pth(land); tx2.fillStyle = DAY ? '#1d2440' : '#2b3554'; tx2.fill(); tx2.strokeStyle = DAY ? '#0b1026' : '#8fa0cf'; tx2.lineWidth = 2; tx2.stroke();
    const tex = new T.CanvasTexture(tc); tex.anisotropy = 8;
    const globe = new T.Mesh(new T.SphereGeometry(1, 96, 64), new T.MeshStandardMaterial({ map: tex, roughness: .9, metalness: 0, emissive: new T.Color(DAY ? '#ffffff' : '#0b1430'), emissiveIntensity: DAY ? .16 : .35, emissiveMap: DAY ? tex : null }));
    turn.add(globe);
    // Heat: every answer up to the chosen moment, laid on the surface as soft colour that pools where voices gather.
    const hc = document.createElement('canvas'); hc.width = 1024; hc.height = 512; const hx = hc.getContext('2d'), htex = new T.CanvasTexture(hc);
    const heat = new T.Mesh(new T.SphereGeometry(1.003, 96, 64), new T.MeshBasicMaterial({ map: htex, transparent: true, depthWrite: false, blending: DAY ? T.NormalBlending : T.AdditiveBlending })); heat.visible = false; turn.add(heat);
    let heatKey = '';
    function drawHeat(g, toneOf) {
      hx.clearRect(0, 0, 1024, 512); hx.globalCompositeOperation = DAY ? 'source-over' : 'lighter';
      const upto = Math.floor(g.t);
      items.forEach((it, i) => {
        if (i > upto || g.hide.has(it.c.score)) return;
        const rgb = RGB[toneOf[it.c.score]], fresh = Math.max(0, 1 - (upto - i) / 36), a = (DAY ? .2 : .14) + fresh * .3, r = 20 + fresh * 10;
        const x = (it.c.lng + 180) / 360 * 1024, y = (90 - it.c.lat) / 180 * 512, wide = 1 / Math.max(.25, Math.cos(it.c.lat * Math.PI / 180));
        for (const dx of [0, -1024, 1024]) {
          if (x + dx < -r * wide || x + dx > 1024 + r * wide) continue;
          hx.save(); hx.translate(x + dx, y); hx.scale(wide, 1);
          const gr = hx.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
          hx.fillStyle = gr; hx.fillRect(-r, -r, 2 * r, 2 * r); hx.restore();
        }
      });
      htex.needsUpdate = true;
    }
    // Air around the world, tinted by the answer in play.
    const air = new T.Mesh(new T.SphereGeometry(1.16, 64, 48), new T.ShaderMaterial({
      uniforms: { c: { value: new T.Color('#6aa0ff') } }, transparent: true, side: T.BackSide, blending: DAY ? T.NormalBlending : T.AdditiveBlending, depthWrite: false,
      vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 c;varying vec3 n;void main(){float k=pow(.72-dot(n,vec3(0.,0.,1.)),3.2);gl_FragColor=' + (DAY ? 'vec4(c,clamp(k*.9,0.,1.))' : 'vec4(c,1.)*k*.75') + ';}' }));
    scene.add(air);
    scene.add(new T.AmbientLight(0xffffff, DAY ? 1.05 : .5));
    const sun = new T.DirectionalLight(0xffffff, .95); sun.position.set(-2.4, 1.6, 2.2); scene.add(sun);
    // Lights for the passages: a point on the ground and a beam rising from it.
    const beams = new T.Group(); turn.add(beams);
    const beamGeo = new T.CylinderGeometry(.0012, .0048, 1, 8, 1, true); beamGeo.translate(0, .5, 0);
    const dotGeo = new T.SphereGeometry(.011, 10, 8), up = new T.Vector3(0, 1, 0);
    let items = [];
    function setCards(list, toneOf) {
      while (beams.children.length) beams.remove(beams.children[0]);
      heatKey = '';
      items = list.map(c => {
        const col = new T.Color(`rgb(${RGB[toneOf[c.score]]})`), at0 = P(c.lat, c.lng, 1.002);
        const dot = new T.Mesh(dotGeo, new T.MeshBasicMaterial({ color: col, transparent: true }));
        const beam = new T.Mesh(beamGeo, new T.MeshBasicMaterial({ color: col, transparent: true, opacity: .5, blending: DAY ? T.NormalBlending : T.AdditiveBlending, depthWrite: false }));
        dot.position.copy(at0); beam.position.copy(at0); beam.quaternion.setFromUnitVectors(up, at0.clone().normalize()); beam.scale.y = .001;
        beams.add(dot, beam); return { c, dot, beam, h: 0 };
      });
    }
    // The marker on the voice being heard, and the path flown to reach it.
    const ring = new T.Mesh(new T.RingGeometry(.028, .034, 48), new T.MeshBasicMaterial({ color: DAY ? 0x05060c : 0xffffff, transparent: true, side: T.DoubleSide, depthWrite: false })); turn.add(ring); ring.visible = false;
    const arcGeo = new T.BufferGeometry(); arcGeo.setAttribute('position', new T.BufferAttribute(new Float32Array(64 * 3), 3));
    const arc = new T.Line(arcGeo, new T.LineBasicMaterial({ color: 0xffffff, transparent: true })); turn.add(arc); arc.visible = false;
    function flight(a, b, col) {
      const va = P(a.lat, a.lng), vb = P(b.lat, b.lng), ang = va.angleTo(vb), pos = arcGeo.attributes.position;
      for (let i = 0; i < 64; i++) { const k = i / 63, v = va.clone().lerp(vb, k).normalize().multiplyScalar(1.004 + Math.sin(Math.PI * k) * Math.min(.34, ang * .16)); pos.setXYZ(i, v.x, v.y, v.z); }
      pos.needsUpdate = true; arc.material.color.set(col); arc.visible = true; arc.userData.t = performance.now();
    }
    const shot = { d: 5.4, x: 1.32, y: 0 }, ray = new T.Raycaster(), zAxis = new T.Vector3(0, 0, 1), xAxis = new T.Vector3(1, 0, 0), qx = new T.Quaternion();
    return {
      setCards, flight,
      size() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); },
      // Tap: the place on the world under the pointer, as [lng, lat].
      invert(x, y) {
        ray.setFromCamera(new T.Vector2(x / innerWidth * 2 - 1, 1 - y / innerHeight * 2), cam);
        const hit = ray.intersectObject(globe)[0]; if (!hit) return null;
        const v = turn.worldToLocal(hit.point.clone()).normalize();
        return [Math.atan2(-v.z, v.x) * 180 / Math.PI, Math.asin(v.y) * 180 / Math.PI];
      },
      render(dt, st) {
        // Framing: a wide shot for the question, a slow push in once the world answers, close for a single voice.
        const narrow = innerWidth < 820, t16 = Math.tan(16 * Math.PI / 180), fit = Math.max(1 / (.66 * t16), 1 / (.9 * t16 * cam.aspect)), want = st.g ? { d: fit / st.g.zoom, x: 0, y: .22 * fit * t16 } : st.mode === 'ask' ? { d: narrow ? 5.6 : 4.9, x: narrow ? 0 : 1.32, y: narrow ? .62 : 0 }
          : st.mode === 'echo' ? { d: narrow ? 4.9 : 3.9, x: narrow ? 0 : 1.12, y: narrow ? .6 : 0 } : { d: narrow ? 4.1 : 3.0, x: narrow ? 0 : .7, y: narrow ? .62 : -.04 };
        const e = reduce ? 1 : 1 - Math.pow(.02, dt / 1000);
        for (const k of ['d', 'x', 'y']) shot[k] += (want[k] - shot[k]) * e;
        cam.position.set(st.mouse[0] * .18, st.mouse[1] * .12, shot.d); cam.lookAt(0, 0, 0);
        tilt.position.set(shot.x, shot.y, 0); air.position.copy(tilt.position);
        // The chosen place is turned to face the camera itself, not straight ahead, since the world sits off-centre.
        turn.rotation.y = (st.rot[0] - 90) * Math.PI / 180;
        const toCam = cam.position.clone().sub(tilt.position).normalize();
        tilt.quaternion.setFromUnitVectors(zAxis, toCam).multiply(qx.setFromAxisAngle(xAxis, -st.rot[1] * Math.PI / 180));
        const now = st.now, tone = now ? st.tones[now.score] : st.answer ? st.tones[st.answer] : null;
        air.material.uniforms.c.value.lerp(new T.Color(tone ? `rgb(${RGB[tone]})` : '#7fa6ff'), .04);
        const gl = st.g;
        items.forEach((it, i) => {
          const hid = gl && gl.hide.has(it.c.score), fresh = gl ? Math.max(0, 1 - (gl.t - i) / 24) : 0;
          const mine = gl ? true : st.answer ? it.c.score === st.answer : true, inTime = gl ? i <= gl.t : !now || it.c.sortYear <= now.sortYear, cur = it.c === now;
          const h = hid ? 0 : st.lit * (inTime ? 1 : 0) * (gl ? .035 + .3 * fresh : cur ? .5 : mine ? .16 : .045);
          it.h += (h - it.h) * Math.min(1, dt / (gl ? 220 : 500)); it.beam.scale.y = Math.max(.001, it.h); it.beam.scale.x = it.beam.scale.z = cur ? 2.6 : 1;
          it.beam.material.opacity = cur ? .95 : mine ? .55 : .3; it.dot.material.opacity = hid ? 0 : inTime ? (mine ? 1 : .55) : gl ? .05 : .16; it.dot.scale.setScalar(cur ? 1.9 : mine ? 1 : .7);
        });
        heat.visible = Boolean(gl);
        if (gl) { const key = Math.floor(gl.t) + '|' + [...gl.hide].join(); if (key !== heatKey) { heatKey = key; drawHeat(gl, st.tones); } }
        ring.visible = Boolean(now);
        if (now) { const p0 = P(now.lat, now.lng, 1.004); ring.position.copy(p0); ring.lookAt(p0.clone().multiplyScalar(2)); const s0 = 1 + .35 * Math.sin(performance.now() / 380); ring.scale.setScalar(s0); ring.material.opacity = .9; }
        if (arc.visible) { const k = (performance.now() - arc.userData.t) / 1500; arcGeo.setDrawRange(0, Math.max(2, Math.min(64, Math.round(k * 64)))); arc.material.opacity = Math.max(0, Math.min(1, 3.2 - k * .8)); if (arc.material.opacity <= 0) arc.visible = false; }
        renderer.render(scene, cam);
      },
    };
  })();

  // ---- sky and globe -----------------------------------------------------------------------
  const sky = $('sky'), world = $('world'), wx = world.getContext('2d'), sx = sky.getContext('2d');
  const projection = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(projection, wx), grat = d3.geoGraticule10();
  let trail = null;
  let W = 0, H = 0, R = 0, cx = 0, cy = 0, bR = 0, bcx = 0, bcy = 0, rot = [-40, -22, 0], goal = null, spin = true, lit = 0;

  function size() {
    const d = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    for (const c of [sky, world]) { c.width = W * d; c.height = H * d; }
    wx.setTransform(d, 0, 0, d, 0, 0); sx.setTransform(d, 0, 0, d, 0, 0);
    const narrow = W < 820;
    bR = narrow ? Math.min(W * .62, H * .34) : Math.min(H * .46, W * .3);
    bcx = narrow ? W * .5 : W * .72; bcy = narrow ? H * .3 : H * .5;
    if (mode !== 'globe') { R = bR; cx = bcx; cy = bcy; }
    projection.translate([cx, cy]).scale(R);
    if (field) field.size();
    if (w3) w3.size();
    sx.clearRect(0, 0, W, H);
    if (V === 'night') {
      const g = sx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .9);
      g.addColorStop(0, '#121b3d'); g.addColorStop(.55, '#070b1a'); g.addColorStop(1, '#04060d');
      sx.fillStyle = g; sx.fillRect(0, 0, W, H);
      let seed = 11; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
      for (let i = 0; i < W * H / 4200; i++) { sx.globalAlpha = .15 + rnd() * .55; sx.fillStyle = '#fff'; const s = rnd() < .08 ? 1.6 : .8; sx.fillRect(rnd() * W, rnd() * H, s, s); }
      sx.globalAlpha = 1;
    }
    drawStrip();
  }

  function paint() {
    projection.rotate(rot);
    wx.clearRect(0, 0, W, H);
    if (w3) return;
    if (L.dots) {
      if (!landDots) makeDots();
      const face0 = projection.invert([cx, cy]), d = Math.max(1.1, R / 210);
      wx.fillStyle = `rgba(${L.land},.5)`;
      for (const pt of landDots) {
        const a = d3.geoDistance(pt, face0); if (a > 1.5) continue;
        const [x, y] = projection(pt), k = Math.cos(a) * .9 + .1;
        wx.globalAlpha = .25 + .75 * k; wx.beginPath(); wx.arc(x, y, d * (.55 + .45 * k), 0, 7); wx.fill();
      }
      if (L.through) {
        // The far side shows through, mirrored and faint, so the world reads as a sphere of points.
        const back = d3.geoOrthographic().translate([cx, cy]).scale(R).rotate([rot[0] + 180, -rot[1], 0]).clipAngle(90), anti = back.invert([cx, cy]);
        wx.fillStyle = `rgba(${L.land},.5)`;
        for (const pt of landDots) {
          const a = d3.geoDistance(pt, anti); if (a > 1.45) continue;
          const [bx, y] = back(pt), x = 2 * cx - bx;
          wx.globalAlpha = .13 * Math.cos(a); wx.beginPath(); wx.arc(x, y, d * .5, 0, 7); wx.fill();
        }
      }
      wx.globalAlpha = 1;
      if (!L.through || mode === 'globe') { wx.beginPath(); path({ type: 'Sphere' }); wx.strokeStyle = `rgba(${L.land},.16)`; wx.lineWidth = 1; wx.stroke(); }
    } else {
      const g = wx.createRadialGradient(cx - R * .35, cy - R * .4, 0, cx, cy, R);
      g.addColorStop(0, '#1c2854'); g.addColorStop(.7, '#0a1024'); g.addColorStop(1, '#060a18');
      wx.save(); wx.shadowColor = 'rgba(91,140,255,.35)'; wx.shadowBlur = 80;
      wx.beginPath(); path({ type: 'Sphere' }); wx.fillStyle = g; wx.fill(); wx.restore();
      wx.beginPath(); path(grat); wx.strokeStyle = 'rgba(255,255,255,.06)'; wx.lineWidth = .6; wx.stroke();
      wx.beginPath(); path(land); wx.fillStyle = 'rgba(255,255,255,.05)'; wx.fill(); wx.strokeStyle = 'rgba(255,255,255,.22)'; wx.lineWidth = .7; wx.stroke();
    }
    if (!cards) return;
    const face = projection.invert([cx, cy]);
    wx.save(); wx.beginPath(); path({ type: 'Sphere' }); wx.clip(); wx.globalCompositeOperation = L.blend;
    const now = mode === 'voice' ? shown[at] : null;
    const gl = mode === 'globe';
    for (let ci = 0; ci < cards.length; ci++) {
      const c = cards[ci];
      if (gl && (ci > G.t || G.hide.has(c.score))) continue;
      if (d3.geoDistance([c.lng, c.lat], face) > 1.52) continue;
      const tone = tones[c.score], rgb = RGB[tone], [x, y] = projection([c.lng, c.lat]);
      const mine = gl ? true : answer ? c.score === answer : true, fresh = gl ? Math.max(0, 1 - (G.t - ci) / 36) : 0;
      const inTime = gl || !now || c.sortYear <= now.sortYear;       // the world fills in as time passes
      const k = lit * (inTime ? 1 : .12) * (mine ? 1 : .32) * (gl ? .8 + fresh * .7 : 1);
      const big = R * (gl ? .2 + fresh * .1 : mine ? .15 : .09);
      const h = wx.createRadialGradient(x, y, 0, x, y, big);
      h.addColorStop(0, `rgba(${rgb},${(V === 'night' ? .17 : .3) * k})`); h.addColorStop(1, `rgba(${rgb},0)`);
      wx.fillStyle = h; wx.fillRect(x - big, y - big, big * 2, big * 2);
      wx.beginPath(); wx.arc(x, y, (mine ? 2.2 : 1.4) * (V === 'night' ? 1 : 1.9), 0, 7); wx.fillStyle = `rgba(${rgb},${.95 * Math.max(k, .12)})`; wx.fill();
    }
    wx.restore();
    if (now && trail && trail.from !== now) {
      const k = Math.min(1, (performance.now() - trail.t) / 1600), go = d3.geoInterpolate([trail.from.lng, trail.from.lat], [now.lng, now.lat]);
      const pts = []; for (let i = 0; i <= 40; i++) pts.push(go(k * i / 40));
      wx.beginPath(); path({ type: 'LineString', coordinates: pts });
      wx.strokeStyle = css(tones[now.score]); wx.lineWidth = 1.6; wx.globalAlpha = .9 * (1 - Math.max(0, (performance.now() - trail.t - 2600) / 1400)); if (wx.globalAlpha > 0) wx.stroke(); wx.globalAlpha = 1;
    }
    if (now && d3.geoDistance([now.lng, now.lat], face) < 1.52) {
      const [x, y] = projection([now.lng, now.lat]), pulse = 9 + 4 * Math.sin(performance.now() / 420);
      wx.beginPath(); wx.arc(x, y, pulse, 0, 7); wx.strokeStyle = css(tones[now.score]); wx.lineWidth = 1.2; wx.stroke();
      wx.beginPath(); wx.arc(x, y, 3.4, 0, 7); wx.fillStyle = L.ring; wx.fill();
    }
  }

  let last = 0;
  function frame(ts) {
    const dt = Math.min(64, ts - last || 16); last = ts;
    if (goal) {
      const k = reduce ? 1 : 1 - Math.pow(.0025, dt / 1000);
      let dl = ((goal[0] - rot[0] + 540) % 360) - 180;
      rot = [rot[0] + dl * k, rot[1] + (goal[1] - rot[1]) * k, 0];
      if (Math.abs(dl) < .05 && Math.abs(goal[1] - rot[1]) < .05) goal = null;
    } else if (mode === 'globe' && G.vel) { rot = [rot[0] + G.vel * dt, rot[1], 0]; G.vel *= Math.pow(.94, dt / 16); if (Math.abs(G.vel) < .0004) G.vel = 0; }
    else if (spin && !reduce) rot = [rot[0] + dt * .004, rot[1], 0];
    if (mode === 'globe') {
      if (G.play) {
        // Play runs on the calendar, on a scale that shortens the distant past: each halving of the time before now takes as long as the last.
        G.w += dt / 52000; G.year = yearAt(G.w); let i = Math.floor(G.t); while (i < cards.length - 1 && cards[i + 1].sortYear <= G.year) i++; G.t = i;
        if (G.w >= 1) { G.t = cards.length - 1; setPlay(false); syncGlobe(true); }
      }
      syncGlobe();
    }
    {
      // The world moves to the middle and grows when it is the whole subject.
      const gl = mode === 'globe', narrow = W < 820, e = reduce ? 1 : 1 - Math.pow(.01, dt / 1000);
      const wR = gl ? Math.min(W * .45, (H - (narrow ? 300 : 260)) * .5) * G.zoom : bR, wx0 = gl ? W / 2 : bcx, wy0 = gl ? (narrow ? 70 : 40) + (H - (narrow ? 300 : 260)) / 2 : bcy;
      R += (wR - R) * e; cx += (wx0 - cx) * e; cy += (wy0 - cy) * e; projection.translate([cx, cy]).scale(R);
    }
    if (field) field.draw(ts / 1000, fieldWant(), mouse);
    const want = mode === 'ask' ? .35 : 1;
    lit += (want - lit) * (reduce ? 1 : Math.min(1, dt / 700));
    paint();
    if (w3) w3.render(dt, { mode, rot, mouse, lit, answer, tones: tones || {}, now: mode === 'voice' && shown ? shown[at] : null, g: mode === 'globe' ? G : null });
    requestAnimationFrame(frame);
  }
  const face = c => { goal = [-c.lng, Math.max(-55, Math.min(55, -c.lat * .8)), 0]; spin = false; };

  // ---- time strip ---------------------------------------------------------------------------
  const strip = $('strip'), tx = strip.getContext('2d');
  function stripX(i, w) { return shown.length < 2 ? w / 2 : 6 + (w - 12) * i / (shown.length - 1); }
  function drawStrip() {
    if (!shown || $('dock').hidden) return;
    const r = strip.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    strip.width = r.width * d; strip.height = r.height * d; tx.setTransform(d, 0, 0, d, 0, 0);
    shown.forEach((c, i) => {
      const x = stripX(i, r.width), rgb = RGB[tones[c.score]], cur = i === at, past = i <= at;
      const g = tx.createLinearGradient(0, 0, 0, r.height);
      g.addColorStop(0, `rgba(${rgb},${past ? .95 : .3})`); g.addColorStop(1, `rgba(${rgb},${past ? .15 : .05})`);
      tx.fillStyle = cur ? L.ring : g; tx.fillRect(x - (cur ? 1.5 : 1), cur ? 0 : 12, cur ? 3 : 2, r.height - (cur ? 0 : 12));
    });
  }
  strip.addEventListener('click', e => {
    const r = strip.getBoundingClientRect(), f = (e.clientX - r.left - 6) / (r.width - 12);
    stopDrift(); show(Math.round(f * (shown.length - 1)));
  });

  // ---- scenes -------------------------------------------------------------------------------
  // Text arrives a word at a time.
  // A browser set to another language is probably translating the page; text split word by word translates badly, so it is left whole.
  const WHOLE = !/^en\b/i.test(navigator.language || 'en');
  function words(el, text, ms) {
    el.textContent = '';
    if (WHOLE) { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = text; el.append(sp); return; }
    text.split(' ').forEach((w, i) => { const sp = document.createElement('span'); sp.className = 'w'; sp.style.animationDelay = i * ms + 'ms'; sp.textContent = w + ' '; el.append(sp); });
  }
  function countUp(el, to) {
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(); (function step(t) { const k = Math.max(0, Math.min(1, (t - t0) / 900)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  const scene = name => { mode = name; for (const id of ['ask', 'echo', 'voice']) $(id).hidden = id !== name; $('dock').hidden = name !== 'voice'; $('gdock').hidden = name !== 'globe'; document.body.dataset.scene = name; };

  // ---- the globe on its own -----------------------------------------------------------------
  const NEAR = 40, span0 = () => cards.at(-1).sortYear + NEAR - cards[0].sortYear;
  const yearAt = w => cards.at(-1).sortYear + NEAR - Math.exp(Math.log(span0()) + (Math.log(NEAR) - Math.log(span0())) * Math.min(1, w));
  const clockAt = y => (Math.log(cards.at(-1).sortYear + NEAR - y) - Math.log(span0())) / (Math.log(NEAR) - Math.log(span0()));
  const yearName = y => { const r = Math.round(y); return r <= 0 ? `${1 - r} BCE` : String(r); };
  const regionOf = c => { const a = c.lat, o = c.lng; return o < -30 ? (a > 13 ? 'North America' : 'Latin America') : o < 60 && a > 35 ? (o > 25 && a < 42 ? 'West Asia and North Africa' : 'Europe') : o < 60 ? (a > 12 || o > 32 ? 'West Asia and North Africa' : 'Sub-Saharan Africa') : o < 100 ? 'South and Central Asia' : a > -10 ? 'East and South-East Asia' : 'Oceania'; };
  function setPlay(on) { G.play = on; $('g-play').textContent = on ? 'Pause' : 'Play'; $('g-play').setAttribute('aria-pressed', String(on)); }
  function syncGlobe(force) {
    const i = Math.floor(G.t); if (G.play) $('g-year').textContent = yearName(G.year);
    if (!force && i === G.shownAt) return; G.shownAt = i;
    const c = cards[i]; if (!G.play) $('g-year').textContent = c.dateShort; if (document.activeElement !== $('g-time') || G.play) $('g-time').value = i;
    const seen = cards.slice(0, i + 1);
    $('g-count').textContent = `${seen.filter(x => !G.hide.has(x.score)).length} of ${cards.length} voices`;
    for (const b of $('g-legend').children) b.lastChild.textContent = ' ' + seen.filter(x => x.score === b.dataset.id).length;
    $('g-time').setAttribute('aria-valuetext', c.dateShort);
    // The heat map in words, for anyone not looking at it: said only when time is standing still.
    if (!G.play) {
      const live = seen.filter(x => !G.hide.has(x.score)), by = {}; for (const x of live) { const r = regionOf(x); by[r] = (by[r] || 0) + 1; }
      const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, k]) => `${r} ${k}`).join(', ');
      $('g-sr').textContent = `Up to ${c.dateShort}: ${live.length} of ${cards.length} voices. ` + [...$('g-legend').children].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent.trim()).join(', ') + (top ? `. Most are in ${top}.` : '');
    }
  }
  function openGlobe() {
    stopDrift(); G.hide.clear(); G.zoom = 1; G.vel = 0; G.t = cards.length - 1; spin = true; goal = null; setPlay(false);
    $('g-q').textContent = ask_(q); $('g-time').max = cards.length - 1;
    // The track gives every voice the same room; the year marks show how unevenly time falls along it.
    { const marks = $('g-marks'); marks.textContent = ''; let lastAt = -1;
      for (const y of [-2000, -1000, -500, 1, 500, 1000, 1500, 1800, 1900, 1950, 2000]) {
        const i = cards.findIndex(c => c.sortYear >= y); if (i <= 0) continue; const at = i / (cards.length - 1) * 100;
        const tick = document.createElement('i'); tick.style.left = at + '%'; marks.append(tick);
        if (at - lastAt < 7 || at > 97) continue; lastAt = at;
        const label = document.createElement('span'); label.style.left = at + '%'; label.textContent = y < 1 ? `${-y} BCE` : String(y); marks.append(label);
      } }
    const box = $('g-legend'); box.textContent = '';
    for (const s of scale.filter(s => cards.some(c => c.score === s.id))) {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.id = s.id; b.style.setProperty('--c', css(s.tone)); b.setAttribute('aria-pressed', 'true');
      b.append(document.createElement('i'), s.tone === 'none' ? 'Unplaced' : say(q, s), document.createElement('b'));
      b.addEventListener('click', () => { const off = !G.hide.has(s.id); if (off) G.hide.add(s.id); else G.hide.delete(s.id); b.setAttribute('aria-pressed', String(!off)); syncGlobe(true); });
      box.append(b);
    }
    scene('globe'); syncGlobe(true);
  }
  $('g-play').addEventListener('click', () => { if (!G.play) { if (G.t >= cards.length - 1) G.t = 0; G.w = clockAt(cards[Math.floor(G.t)].sortYear); G.year = cards[Math.floor(G.t)].sortYear; } spin = true; setPlay(!G.play); syncGlobe(true); });
  $('g-time').addEventListener('input', e => { setPlay(false); G.t = Number(e.target.value); syncGlobe(true); });
  $('g-back').addEventListener('click', () => { setPlay(false); ask(q); });
  $('g-next').addEventListener('click', () => { setPlay(false); ask(questions[(questions.indexOf(q) + 1) % questions.length]); openGlobe(); });
  $('ask-globe').addEventListener('click', openGlobe);
  $('to-globe').addEventListener('click', openGlobe);
  $('menu-globe').addEventListener('click', e => { e.preventDefault(); $('menu').hidden = true; openGlobe(); });

  function ask(next) {
    q = next; scale = q.scale; tones = Object.fromEntries(scale.map(s => [s.id, s.tone]));
    cards = atlas.cards.filter(c => c.readings[q.id]).map(c => ({ ...c, ...c.readings[q.id] })).sort((a, b) => a.sortYear - b.sortYear);
    answer = null; filter = 'all'; shown = cards; at = 0; spin = true; goal = null;
    if (w3) w3.setCards(cards, tones);
    clearTimeout(driftTimer);
    if (!(first && $('ask-q').dataset.pre === q.id)) $('ask-count').textContent = first ? 'Welcome. Start with a question.' : `Question ${questions.indexOf(q) + 1} of ${questions.length}`;
    first = false;
    // The last clause of the question is set in italics.
    const parts = ask_(q).split(' '), cut = Math.max(1, parts.length - 3);
    // The page writes the opening question itself before this script arrives; it is left as it is.
    const pre = $('ask-q').dataset.pre === q.id; delete $('ask-q').dataset.pre;
    if (!pre) {
      $('ask-q').textContent = ''; const lead = document.createElement('span'), em = document.createElement('em');
      words(lead, parts.slice(0, cut).join(' '), 70); words(em, parts.slice(cut).join(' '), 70);
      em.querySelectorAll('.w').forEach((n, i) => { n.style.animationDelay = (cut + i) * 70 + 'ms'; });
      $('ask-q').append(lead, em);
    }
    const box = $('ask-answers'); box.textContent = '';
    for (const s of scale.filter(s => s.tone !== 'none')) {
      const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--c', css(s.tone));
      b.append(document.createElement('i'), say(q, s)); b.addEventListener('click', () => echo(s)); box.append(b);
    }
    history.replaceState(null, '', '#' + q.id);
    scene('ask');
    // An answer tapped before the world had loaded is honoured now.
    const early = window.__svapnaAnswer; window.__svapnaAnswer = null;
    if (early && early[0] === q.id) { const st = scale.find(x => x.id === early[1]); if (st) echo(st); }
  }

  function echo(step) {
    answer = step.id; filter = 'agree';
    try { const mine = JSON.parse(localStorage.getItem('svapna_answers') || '{}') || {}; mine[q.id] = step.id; localStorage.setItem('svapna_answers', JSON.stringify(mine)); const n = Object.keys(mine).length, y = document.getElementById('you-link'); if (y) y.textContent = 'You · ' + n; } catch (e) { /* private mode */ }
    const same = cards.filter(c => c.score === answer), first = same[0];
    $('echo-label').textContent = ask_(q);
    const line = $('echo-line'); line.style.setProperty('--c', css(step.tone)); line.textContent = '';
    const b = document.createElement('b'), n = document.createElement('span'), rest = document.createElement('span');
    b.append(n, ` of ${cards.length}`); countUp(n, same.length);
    words(rest, ` voices across ${span(cards)} wrote the same.` + (first ? ` The earliest is ${first.name}, ${first.dateShort}.` : ''), 45);
    line.append(b, rest);
    if (first) face(first);
    { let n = 0; try { n = Object.keys(JSON.parse(localStorage.getItem('svapna_answers') || '{}') || {}).length; } catch (e) { /* private mode */ }
      $('echo-you').textContent = n < 3 ? `Who thinks like you? ${3 - n} more to find out →` : n < 7 ? `Who thinks like you? ${7 - n} more make it truer →` : 'Who thinks like you? →'; }
    scene('echo');
  }
  const span = list => { const y = list.at(-1).sortYear - list[0].sortYear; return y >= 1000 ? (Math.round(y / 100) / 10).toLocaleString('en') + ' thousand years' : y + ' years'; };

  function listen() {
    setFilter(answer ? 'agree' : 'all', true);
    scene('voice'); show(0); stopDrift();
  }

  function setFilter(next, quiet) {
    filter = next;
    shown = cards.filter(c => filter === 'all' || (filter === 'agree' ? c.score === answer : c.score !== answer));
    if (!shown.length) { filter = 'all'; shown = cards; }
    const box = $('filter'); box.textContent = '';
    const tight = innerWidth < 560, opts = answer ? [['agree', tight ? 'Agree' : 'Agree with you'], ['differ', tight ? 'Differ' : 'See it differently'], ['all', 'Everyone']] : [['all', 'Everyone']];
    for (const [id, label] of opts) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.setAttribute('aria-pressed', String(id === filter));
      b.addEventListener('click', () => { stopDrift(); setFilter(id); }); box.append(b);
    }
    $('t0').textContent = shown[0].dateShort; $('t1').textContent = shown.at(-1).dateShort;
    if (!quiet) show(0);
  }

  function show(i) {
    const before = mode === 'voice' && shown[at] ? shown[at] : null;
    at = Math.max(0, Math.min(shown.length - 1, i));
    if (before && before !== shown[at]) trail = { from: before, t: performance.now() + 500 };
    if (w3 && before && before !== shown[at]) w3.flight(before, shown[at], `rgb(${RGB[tones[shown[at].score]]})`);
    const c = shown[at], step = scale.find(s => s.id === c.score), v = $('voice');
    v.style.setProperty('--c', css(step.tone));
    v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
    $('voice-pos').textContent = `${say(q, step)} · ${at + 1} of ${shown.length}`;
    words($('voice-text'), '“' + c.excerpt + '”', 26);
    $('voice-tr').textContent = c.translation || '';
    $('voice-who').textContent = c.name;
    $('voice-where').textContent = `${c.place} · ${c.dateShort}${c.work ? ' · ' + c.work : ''}`;
    { const m = /^https:\/\/gutenberg\.pglaf\.org\/(?:\d\/)*(\d+)\/\1[-.]/.exec(c.sourceUrl); $('voice-source').href = m ? 'https://www.gutenberg.org/ebooks/' + m[1] : c.sourceUrl; }
    $('voice-text').translate = !c.translation;
    if (SAY) { speechSynthesis.cancel(); if (listening) speak(c); }
    $('voice-atlas').href = '/thinkers/' + c.name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '#' + c.id;
    $('when').textContent = c.dateShort;
    face(c); drawStrip();
  }

  // Listen: the device's own voice reads each voice aloud, and carries on to the next while drifting.
  const SAY = 'speechSynthesis' in window; let listening = false;
  function speak(c) { const u = new SpeechSynthesisUtterance((c.translation || c.excerpt) + ' ' + c.name + '.'); u.lang = 'en'; u.rate = .92; u.onend = () => { if (listening && drifting && mode === 'voice') { clearTimeout(driftTimer); driftTimer = setTimeout(() => show(at >= shown.length - 1 ? 0 : at + 1), 900); } }; clearTimeout(driftTimer); speechSynthesis.speak(u); }
  if (SAY) { $('voice-say').hidden = false; $('voice-say').addEventListener('click', () => { listening = !listening; $('voice-say').textContent = listening ? 'Stop listening' : 'Listen'; speechSynthesis.cancel(); if (listening) speak(shown[at]); else tick(); }); }
  let holding = false;
  { const v = $('voice'); v.addEventListener('pointerenter', () => { holding = true; }); v.addEventListener('pointerleave', () => { holding = false; }); v.addEventListener('pointerdown', () => { if (drifting) stopDrift(); }); v.addEventListener('focusin', () => { if (drifting) stopDrift(); }); }
  function startDrift() { drifting = true; $('drift').setAttribute('aria-pressed', 'true'); $('drift').textContent = 'Playing · pause'; tick(); }
  function stopDrift() { drifting = false; clearTimeout(driftTimer); $('drift').setAttribute('aria-pressed', 'false'); $('drift').textContent = 'Play through'; }
  function tick() {
    clearTimeout(driftTimer);
    if (!drifting || reduce) return;
    if (SAY && listening) return;   // while listening, the voice sets the pace
    // Time to read: longer passages stay longer, and nothing moves while the reader is touching or pointing at the words.
    const c = shown[at], n = ((c.translation ? c.translation + ' ' : '') + c.excerpt).split(/\s+/).length;
    driftTimer = setTimeout(() => { if (mode !== 'voice') return; if (holding) { tick(); return; } show(at >= shown.length - 1 ? 0 : at + 1); tick(); }, Math.min(40000, 9000 + n * 520));
  }

  // ---- controls -----------------------------------------------------------------------------
  $('ask-skip').addEventListener('click', listen);
  $('echo-go').addEventListener('click', listen);
  $('prev').addEventListener('click', () => { stopDrift(); show(at - 1); });
  $('next').addEventListener('click', () => { stopDrift(); show(at + 1); });
  $('drift').addEventListener('click', () => (drifting ? stopDrift() : startDrift()));
  $('again').addEventListener('click', () => ask(questions[(questions.indexOf(q) + 1) % questions.length]));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') $('menu').hidden = true;
    if (mode !== 'voice') return;
    if (e.key === 'ArrowRight') { stopDrift(); show(at + 1); }
    if (e.key === 'ArrowLeft') { stopDrift(); show(at - 1); }
  });
  // Drag turns the world; a tap on a light opens the nearest voice.
  let drag = null, pinch = null; const touches = new Map(), zoomTo = z => { G.zoom = Math.max(.6, Math.min(2.8, z)); };
  const spread = () => { const [a, b] = [...touches.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  world.addEventListener('wheel', e => { if (mode !== 'globe') return; e.preventDefault(); zoomTo(G.zoom * Math.exp(-e.deltaY * .0014)); }, { passive: false });
  world.addEventListener('pointerdown', e => {
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2 && mode === 'globe') { pinch = { d: spread(), z: G.zoom }; drag = null; return; }
    G.vel = 0; drag = { x: e.clientX, y: e.clientY, rot: rot.slice(), moved: false, lx: e.clientX, lt: performance.now(), v: 0 }; world.setPointerCapture(e.pointerId);
  });
  world.addEventListener('pointercancel', e => { touches.delete(e.pointerId); pinch = null; drag = null; });
  world.addEventListener('pointermove', e => {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && touches.size === 2) { zoomTo(pinch.z * spread() / pinch.d); return; }
    if (!drag) return;
    { const t = performance.now(); if (t > drag.lt) { drag.v = (e.clientX - drag.lx) * 60 / R / (t - drag.lt); drag.lx = e.clientX; drag.lt = t; } }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (drag.moved) { goal = null; spin = false; stopDrift(); rot = [drag.rot[0] + dx * 60 / R, Math.max(-80, Math.min(80, drag.rot[1] - dy * 60 / R)), 0]; }
  });
  world.addEventListener('pointerup', e => {
    touches.delete(e.pointerId); if (pinch) { pinch = null; drag = null; return; }
    if (drag && drag.moved && mode === 'globe' && performance.now() - drag.lt < 90) G.vel = Math.max(-.5, Math.min(.5, drag.v));
    if (drag && !drag.moved && cards) {
      const p = w3 ? w3.invert(e.clientX, e.clientY) : projection.invert([e.clientX, e.clientY]);
      if (p) {
        const pool = mode === 'voice' ? shown : cards;
        let best = -1, d = .12;
        pool.forEach((c, i) => { if (mode === 'globe' && (i > G.t || G.hide.has(c.score))) return; const k = d3.geoDistance(p, [c.lng, c.lat]); if (k < d) { d = k; best = i; } });
        if (best >= 0) { if (mode !== 'voice') { shown = cards; setFilter('all', true); scene('voice'); } stopDrift(); show(best); }
      }
    }
    drag = null;
  });

  // Menu of questions.
  for (const item of questions) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.textContent = ask_(item); b.addEventListener('click', () => { $('menu').hidden = true; ask(item); });
    li.append(b); $('menu-list').append(li);
  }
  $('open-menu').addEventListener('click', () => { $('menu').hidden = false; });
  $('close-menu').addEventListener('click', () => { $('menu').hidden = true; });
  { const tb = $('menu-type'), root = document.documentElement, paintType = () => { tb.textContent = root.dataset.type === 'plain' ? 'Original type' : 'Plainer type'; }; tb.addEventListener('click', () => { if (root.dataset.type === 'plain') delete root.dataset.type; else root.dataset.type = 'plain'; try { localStorage.setItem('svapna_type', root.dataset.type || ''); } catch (e) { /* private mode */ } paintType(); }); paintType(); }

  try { const n = Object.keys(JSON.parse(localStorage.getItem('svapna_answers') || '{}') || {}).length, y = document.getElementById('you-link'); if (y && n) y.textContent = 'You · ' + n; } catch (e) { /* private mode */ }
  addEventListener('resize', size);
  const wanted = questions.find(item => '#' + item.id === location.hash);
  // A first visit opens on the gentlest question; later visits rotate through the gentle ones, a new one each day.
  let seen = false; try { seen = localStorage.getItem('svapna_next_seen') === '1'; localStorage.setItem('svapna_next_seen', '1'); } catch (e) { /* private mode */ }
  // The page has already written its opening question; the world opens on the same one.
  ask(wanted || questions.find(item => item.id === $('ask-q').dataset.pre) || (seen ? questions[Math.floor(Date.now() / 864e5) % GENTLE] : questions[0]));
  size();
  requestAnimationFrame(frame);
})();
