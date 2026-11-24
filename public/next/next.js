// Prototype: Svapna as one continuous space. A question, the world lit by everyone who answered it,
// and their words one at a time. Data is the Globe of Thought's verified passages.
(function () {
  const atlas = window.PILOT_EVIDENCE, land = window.PILOT_LAND;
  const $ = id => document.getElementById(id);
  // Looks: ?v=paper (default), ?v=field, ?v=ink, ?v=night (the first prototype).
  const V = new URLSearchParams(location.search).get('v') || 'paper';
  document.body.dataset.v = V;
  const LOOK = {
    night: { rgb: { low: [91, 140, 255], mid: [240, 199, 94], high: [255, 107, 74], none: [154, 163, 184] }, dots: false, blend: 'lighter', land: '255,255,255', ring: '#fff' },
    paper: { rgb: { low: [36, 76, 255], mid: [255, 170, 0], high: [255, 61, 46], none: [120, 120, 120] }, dots: true, blend: 'multiply', land: '20,20,20', ring: '#111' },
    field: { rgb: { low: [40, 60, 255], mid: [255, 180, 0], high: [255, 45, 85], none: [90, 90, 90] }, dots: true, blend: 'source-over', land: '20,10,40', ring: '#111' },
    ink: { rgb: { low: [120, 160, 255], mid: [255, 220, 90], high: [200, 255, 60], none: [130, 130, 130] }, dots: true, blend: 'lighter', land: '255,255,255', ring: '#fff' },
  }[V] || null;
  const L = LOOK || { rgb: { low: [36, 76, 255], mid: [255, 170, 0], high: [255, 61, 46], none: [120, 120, 120] }, dots: true, blend: 'multiply', land: '20,20,20', ring: '#111' };
  const RGB = L.rgb;
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
  const questions = atlas.questions.filter(q => atlas.cards.some(c => c.readings[q.id]));

  let q, scale, tones, cards, shown, answer = null, filter = 'all', at = 0, mode = 'ask', drifting = true, driftTimer = 0;

  // ---- sky and globe -----------------------------------------------------------------------
  const sky = $('sky'), world = $('world'), wx = world.getContext('2d'), sx = sky.getContext('2d');
  const projection = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(projection, wx), grat = d3.geoGraticule10();
  let W = 0, H = 0, R = 0, cx = 0, cy = 0, rot = [-40, -22, 0], goal = null, spin = true, lit = 0;

  function size() {
    const d = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    for (const c of [sky, world]) { c.width = W * d; c.height = H * d; }
    wx.setTransform(d, 0, 0, d, 0, 0); sx.setTransform(d, 0, 0, d, 0, 0);
    const narrow = W < 820;
    R = narrow ? Math.min(W * .62, H * .34) : Math.min(H * .46, W * .3);
    cx = narrow ? W * .5 : W * .72; cy = narrow ? H * .3 : H * .5;
    projection.translate([cx, cy]).scale(R);
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
    if (L.dots) {
      if (!landDots) makeDots();
      const face0 = projection.invert([cx, cy]), d = Math.max(1.1, R / 210);
      wx.fillStyle = `rgba(${L.land},.5)`;
      for (const pt of landDots) {
        const a = d3.geoDistance(pt, face0); if (a > 1.5) continue;
        const [x, y] = projection(pt), k = Math.cos(a) * .9 + .1;
        wx.globalAlpha = .25 + .75 * k; wx.beginPath(); wx.arc(x, y, d * (.55 + .45 * k), 0, 7); wx.fill();
      }
      wx.globalAlpha = 1;
      wx.beginPath(); path({ type: 'Sphere' }); wx.strokeStyle = `rgba(${L.land},.16)`; wx.lineWidth = 1; wx.stroke();
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
    for (const c of cards) {
      if (d3.geoDistance([c.lng, c.lat], face) > 1.52) continue;
      const tone = tones[c.score], rgb = RGB[tone], [x, y] = projection([c.lng, c.lat]);
      const mine = answer ? c.score === answer : true;
      const inTime = !now || c.sortYear <= now.sortYear;       // the world fills in as time passes
      const k = lit * (inTime ? 1 : .12) * (mine ? 1 : .32);
      const big = R * (mine ? .15 : .09);
      const h = wx.createRadialGradient(x, y, 0, x, y, big);
      h.addColorStop(0, `rgba(${rgb},${(V === 'night' ? .17 : .3) * k})`); h.addColorStop(1, `rgba(${rgb},0)`);
      wx.fillStyle = h; wx.fillRect(x - big, y - big, big * 2, big * 2);
      wx.beginPath(); wx.arc(x, y, (mine ? 2.2 : 1.4) * (V === 'night' ? 1 : 1.9), 0, 7); wx.fillStyle = `rgba(${rgb},${.95 * Math.max(k, .12)})`; wx.fill();
    }
    wx.restore();
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
    } else if (spin && !reduce) rot = [rot[0] + dt * .004, rot[1], 0];
    const want = mode === 'ask' ? .35 : 1;
    lit += (want - lit) * (reduce ? 1 : Math.min(1, dt / 700));
    paint();
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
  const scene = name => { mode = name; for (const id of ['ask', 'echo', 'voice']) $(id).hidden = id !== name; $('dock').hidden = name !== 'voice'; };

  function ask(next) {
    q = next; scale = q.scale; tones = Object.fromEntries(scale.map(s => [s.id, s.tone]));
    cards = atlas.cards.filter(c => c.readings[q.id]).map(c => ({ ...c, ...c.readings[q.id] })).sort((a, b) => a.sortYear - b.sortYear);
    answer = null; filter = 'all'; shown = cards; at = 0; spin = true; goal = null;
    clearTimeout(driftTimer);
    $('ask-count').textContent = `Question ${questions.indexOf(q) + 1} of ${questions.length}`;
    // The last clause of the question is set in italics.
    const words = q.question.split(' '), cut = Math.max(1, words.length - 3);
    $('ask-q').innerHTML = ''; $('ask-q').append(words.slice(0, cut).join(' ') + ' ');
    const em = document.createElement('em'); em.textContent = words.slice(cut).join(' '); $('ask-q').append(em);
    const box = $('ask-answers'); box.textContent = '';
    for (const s of scale.filter(s => s.tone !== 'none')) {
      const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--c', css(s.tone));
      b.append(document.createElement('i'), s.label); b.addEventListener('click', () => echo(s)); box.append(b);
    }
    history.replaceState(null, '', '#' + q.id);
    scene('ask');
  }

  function echo(step) {
    answer = step.id; filter = 'agree';
    const same = cards.filter(c => c.score === answer), first = same[0];
    $('echo-label').textContent = q.question;
    const line = $('echo-line'); line.style.setProperty('--c', css(step.tone)); line.textContent = '';
    const b = document.createElement('b'); b.textContent = `${same.length} of ${cards.length}`;
    line.append(b, ` voices across ${span(cards)} wrote the same.` + (first ? ` The earliest is ${first.name}, ${first.dateShort}.` : ''));
    if (first) face(first);
    scene('echo');
  }
  const span = list => { const y = list.at(-1).sortYear - list[0].sortYear; return y >= 1000 ? (Math.round(y / 100) / 10).toLocaleString('en') + ' thousand years' : y + ' years'; };

  function listen() {
    setFilter(answer ? 'agree' : 'all', true);
    scene('voice'); show(0); startDrift();
  }

  function setFilter(next, quiet) {
    filter = next;
    shown = cards.filter(c => filter === 'all' || (filter === 'agree' ? c.score === answer : c.score !== answer));
    if (!shown.length) { filter = 'all'; shown = cards; }
    const box = $('filter'); box.textContent = '';
    const opts = answer ? [['agree', 'Agree with you'], ['differ', 'See it differently'], ['all', 'Everyone']] : [['all', 'Everyone']];
    for (const [id, label] of opts) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.setAttribute('aria-pressed', String(id === filter));
      b.addEventListener('click', () => { stopDrift(); setFilter(id); }); box.append(b);
    }
    $('t0').textContent = shown[0].dateShort; $('t1').textContent = shown.at(-1).dateShort;
    if (!quiet) show(0);
  }

  function show(i) {
    at = Math.max(0, Math.min(shown.length - 1, i));
    const c = shown[at], step = scale.find(s => s.id === c.score), v = $('voice');
    v.style.setProperty('--c', css(step.tone));
    v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
    $('voice-pos').textContent = `${step.label} · ${at + 1} of ${shown.length}`;
    $('voice-text').textContent = '“' + c.excerpt + '”';
    $('voice-tr').textContent = c.translation || '';
    $('voice-who').textContent = c.name;
    $('voice-where').textContent = `${c.place} · ${c.dateShort}${c.work ? ' · ' + c.work : ''}`;
    $('voice-source').href = c.sourceUrl;
    $('voice-atlas').href = `/globe-of-thought?q=${q.id}#p=${c.id}`;
    $('when').textContent = c.dateShort;
    face(c); drawStrip();
  }

  function startDrift() { drifting = true; $('drift').setAttribute('aria-pressed', 'true'); $('drift').textContent = 'Drifting'; tick(); }
  function stopDrift() { drifting = false; clearTimeout(driftTimer); $('drift').setAttribute('aria-pressed', 'false'); $('drift').textContent = 'Drift'; }
  function tick() {
    clearTimeout(driftTimer);
    if (!drifting || reduce) return;
    driftTimer = setTimeout(() => { if (mode !== 'voice') return; show(at >= shown.length - 1 ? 0 : at + 1); tick(); }, 7500);
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
  let drag = null;
  world.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, rot: rot.slice(), moved: false }; world.setPointerCapture(e.pointerId); });
  world.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (drag.moved) { goal = null; spin = false; stopDrift(); rot = [drag.rot[0] + dx * 60 / R, Math.max(-80, Math.min(80, drag.rot[1] - dy * 60 / R)), 0]; }
  });
  world.addEventListener('pointerup', e => {
    if (drag && !drag.moved && cards) {
      const p = projection.invert([e.clientX, e.clientY]);
      if (p) {
        const pool = mode === 'voice' ? shown : cards;
        let best = -1, d = .12;
        pool.forEach((c, i) => { const k = d3.geoDistance(p, [c.lng, c.lat]); if (k < d) { d = k; best = i; } });
        if (best >= 0) { if (mode !== 'voice') { shown = cards; setFilter('all', true); scene('voice'); } stopDrift(); show(best); }
      }
    }
    drag = null;
  });

  // Menu of questions.
  for (const item of questions) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.textContent = item.question; b.addEventListener('click', () => { $('menu').hidden = true; ask(item); });
    li.append(b); $('menu-list').append(li);
  }
  $('open-menu').addEventListener('click', () => { $('menu').hidden = false; });
  $('close-menu').addEventListener('click', () => { $('menu').hidden = true; });

  addEventListener('resize', size);
  const wanted = questions.find(item => '#' + item.id === location.hash);
  // A different question greets each day.
  ask(wanted || questions[Math.floor(Date.now() / 864e5) % questions.length]);
  size();
  requestAnimationFrame(frame);
})();
