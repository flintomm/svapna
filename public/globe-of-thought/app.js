(() => {
'use strict';
const $ = id => document.getElementById(id);
// Everything shown comes from evidence.js (built from data/ by tools/atlas.cjs); nothing about a
// particular thinker lives in this file. Cards arrive sorted by date, one timeline stop per card.
// The atlas holds several questions. One is shown at a time, chosen by ?q= in the address; each has its own
// scale, and only passages that have been read for that question appear under it.
const atlas = window.PILOT_EVIDENCE;
const asked = new URLSearchParams(window.location?.search || '').get('q');
const question = atlas.questions.find(q => q.id === asked) || atlas.questions[0];
const scale = question.scale;
const cards = atlas.cards.filter(card => card.readings[question.id]).map(card => ({ ...card, ...card.readings[question.id] }));
const scores = Object.fromEntries(scale.map(s => [s.id, s]));
// Spectrum lanes run from "necessary" at the top to "not necessary", with unscored set apart at the bottom.
const lanes = [...scale.filter(s => s.id !== 'unscored').reverse(), ...scale.filter(s => s.id === 'unscored')];
const stage = $('panel-globe'), canvas = stage.querySelector('canvas'), ctx = canvas.getContext('2d'), slider = $('when');
const media = query => window.matchMedia(query).matches;
const mobile = () => media('(max-width: 800px)');
const still = () => media('(prefers-reduced-motion: reduce)');
const pins = new Map(), dots = new Map(), rows = new Map(), ticks = [], filterButtons = new Map(), clusters = [];
const land = window.PILOT_LAND;
const sphere = { type: 'Sphere' };
const graticule = d3.geoGraticule10();
const projection = d3.geoOrthographic().clipAngle(90).precision(.65);
const path = d3.geoPath(projection, ctx);
const TILT = .83, MIN_ZOOM = 1, MAX_ZOOM = 8, CLUSTER_PX = 24;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

const node = (tag, className = '', value = '') => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value) el.textContent = value;
  return el;
};
const button = (className, value = '') => { const el = node('button', className, value); el.type = 'button'; return el; };
const safeLink = (text, url, classes = '') => {
  const a = node('a', classes, text), href = new URL(url);
  if (href.protocol !== 'https:') throw new Error('Expected HTTPS source');
  a.href = href.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
};

let moment = cards.length - 1, active = 0, filter = '', view = 'globe';
let yaw = 0, pitch = 0, zoom = 1, frame = 0, w = 0, h = 0, lastPin = null, glideId = 0;
const shown = i => i <= moment && (!filter || cards[i].score === filter);

// ---- one-time construction from the data ------------------------------------
for (const s of scale) {
  document.documentElement.style.setProperty('--' + s.tone, s.color);
  const item = node('li');
  item.append(node('strong', '', s.label + (s.term ? ' (' + s.term + '): ' : ': ')), s.definition);
  $('rubric').append(item);
}
for (const s of [{ id: '', label: 'All', tone: 'all' }, ...scale]) {
  const count = s.id ? cards.filter(card => card.score === s.id).length : cards.length;
  if (s.id && !count) continue; // a position nobody holds on this question gets no filter
  const chip = button('chip ' + s.tone);
  chip.append(node('span', 'chip-label', s.label), node('span', 'count', String(count)));
  chip.addEventListener('click', () => { filter = filter === s.id ? '' : s.id; refresh(); });
  $('filters').append(chip); filterButtons.set(s.id, chip);
}
for (const lane of lanes) { const row = node('div', 'lane ' + lane.tone); row.append(node('span', '', lane.label)); $('lanes').append(row); }
for (const [i, card] of cards.entries()) {
  const score = scores[card.score];
  const label = card.name + ', ' + score.label + ', ' + card.dateFull;

  const pin = button('pin ' + score.tone);
  pin.setAttribute('aria-label', label); pin.setAttribute('data-name', card.short);
  pin.addEventListener('click', () => { lastPin = pin; pick(i, { jump: true }); });
  $('pins').append(pin); pins.set(card.id, pin);

  const dot = button('dot ' + score.tone + (i > cards.length * .7 ? ' flip' : ''));
  dot.setAttribute('aria-label', label); dot.setAttribute('data-name', card.short + ' · ' + card.dateShort);
  dot.style.left = ((i + .5) / cards.length * 100) + '%';
  dot.style.top = ((lanes.indexOf(score) + .5) / lanes.length * 100) + '%';
  dot.addEventListener('click', () => pick(i, { center: true, jump: true }));
  $('dots').append(dot); dots.set(card.id, dot);

  const row = button('row');
  row.append(node('span', 'row-date', card.dateShort), node('span', 'row-name', card.name), node('span', 'row-facet', card.facet),
    node('span', 'row-place', card.place), node('span', 'tone ' + score.tone, score.label));
  row.addEventListener('click', () => pick(i, { center: true, jump: true }));
  $('choices').append(row); rows.set(card.id, row);

  const tick = node('span', score.tone);
  $('ticks').append(tick); ticks.push(tick);
}
// Give every passage room on the spectrum; with many passages the plot scrolls sideways inside its panel.
$('plot').style.minWidth = (104 + cards.length * 20) + 'px';
const stride = Math.ceil(cards.length / 5);
for (const [i, card] of cards.entries()) {
  if (i % stride && i !== cards.length - 1) continue;
  if (i !== cards.length - 1 && cards.length - 1 - i < stride / 2) continue;
  const mark = node('span', '', card.dateShort);
  mark.style.left = ((i + .5) / cards.length * 100) + '%';
  $('axis').append(mark);
}
$('ends').append(node('span', '', cards[0].dateShort), node('span', '', cards.at(-1).dateShort));
const drafts = cards.filter(card => card.review === 'draft').length;
$('stats').textContent = cards.length + (cards.length < atlas.cards.length ? ' of ' + atlas.cards.length : '') + ' passages placed · '
  + cards[0].dateShort + ' to ' + cards.at(-1).dateShort + (drafts ? ' · ' + drafts + ' draft readings awaiting review' : '');
$('question').textContent = question.question;
// Switching question reloads the page on the same passage where that passage is placed on the new question.
const questionUrl = (q, passageId) => '?q=' + q.id + (passageId ? '#p=' + passageId : '');
for (const q of atlas.questions) {
  const tab = button('qtab', q.short);
  tab.setAttribute('aria-pressed', String(q === question));
  tab.title = q.question;
  tab.addEventListener('click', () => {
    const here = atlas.cards.find(card => card.id === cards[active].id);
    window.location.assign(questionUrl(q, here.readings[q.id] ? here.id : ''));
  });
  $('questions').append(tab);
}

// ---- state ------------------------------------------------------------------
// At zoom 1 the selected place sits a little above centre; zooming in closes that offset so it stays in view.
const aim = (card, z = zoom) => [-card.lng, -card.lat * (1 - (1 - TILT) / z)];
function glide(toYaw, toPitch, toZoom = zoom, instant = false) {
  const id = ++glideId;
  if (instant || still()) { yaw = toYaw; pitch = toPitch; return setZoom(toZoom); }
  const from = { yaw, pitch, zoom }, turnBy = (((toYaw - yaw) % 360) + 540) % 360 - 180, start = performance.now();
  const step = now => {
    if (id !== glideId) return;
    const t = Math.min(1, (now - start) / 480), ease = 1 - Math.pow(1 - t, 3);
    yaw = from.yaw + turnBy * ease; pitch = from.pitch + (toPitch - from.pitch) * ease;
    setZoom(from.zoom + (toZoom - from.zoom) * ease);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function center(card, instant = false) { glide(...aim(card), zoom, instant); }
function pick(i, { center: shouldCenter = false, jump = false } = {}) {
  if (i > moment) moment = i;
  if (filter && cards[i].score !== filter) filter = '';
  active = i;
  if (shouldCenter) center(cards[active]);
  refresh();
  if (jump && mobile()) {
    $('reader-title')?.focus({ preventScroll: true });
    document.querySelector('.read').scrollIntoView({ block: 'start', behavior: 'auto' });
  }
}
function setMoment(value) {
  const i = Number(value);
  if (!Number.isInteger(i) || i < 0 || i >= cards.length || i === moment) return refresh();
  moment = i; active = i;
  if (filter && cards[i].score !== filter) filter = '';
  center(cards[i]);
  refresh();
}
// Earlier/later in the reader walks the passages currently shown, in date order.
function neighbour(direction) {
  for (let i = active + direction; i >= 0 && i < cards.length; i += direction) if (!filter || cards[i].score === filter) return i;
  return -1;
}
function setZoom(value) {
  zoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
  $('zoom-out').disabled = zoom <= MIN_ZOOM; $('zoom-in').disabled = zoom >= MAX_ZOOM;
  queueDraw();
}
function setView(next) {
  view = next === 'spectrum' ? 'spectrum' : 'globe';
  refresh();
  if (view === 'globe') resize();
}
// The address carries the selection, so a link reopens the same passage, date and view.
function readAddress() {
  const params = new URLSearchParams(window.location?.hash.slice(1) || '');
  const find = key => cards.findIndex(card => card.id === params.get(key));
  const p = find('p'), through = find('through');
  view = params.get('view') === 'spectrum' ? 'spectrum' : 'globe';
  if (p < 0) return false;
  active = p; moment = through < 0 ? cards.length - 1 : Math.max(p, through); filter = '';
  center(cards[active], true);
  return true;
}
function writeAddress() {
  if (!window.history?.replaceState) return;
  const hash = '#p=' + cards[active].id + (moment < cards.length - 1 ? '&through=' + cards[moment].id : '') + (view === 'spectrum' ? '&view=spectrum' : '');
  if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
}
function refresh() {
  slider.value = moment;
  slider.setAttribute('aria-valuetext', cards[moment].dateFull);
  $('shown-year').textContent = cards[moment].dateFull;
  $('prev').disabled = moment === 0; $('next').disabled = moment === cards.length - 1;
  $('earlier').disabled = neighbour(-1) < 0; $('later').disabled = neighbour(1) < 0;
  ticks.forEach((el, i) => { el.className = scores[cards[i].score].tone + (i <= moment ? ' past' : '') + (i === moment ? ' now' : ''); });
  for (const [id, chip] of filterButtons) chip.setAttribute('aria-pressed', String(filter === id));
  let visible = 0;
  for (const [i, card] of cards.entries()) {
    const score = scores[card.score], later = i > moment, selected = String(i === active);
    if (shown(i)) visible++;
    pins.get(card.id).setAttribute('aria-pressed', selected);
    const dot = dots.get(card.id);
    dot.setAttribute('aria-pressed', selected);
    dot.hidden = Boolean(filter) && card.score !== filter;
    dot.classList.toggle('later', later);
    const row = rows.get(card.id);
    row.setAttribute('aria-pressed', selected);
    row.hidden = Boolean(filter) && card.score !== filter;
    row.classList.toggle('later', later);
    row.setAttribute('aria-label', card.name + ', ' + card.dateFull + ', ' + (later ? 'later evidence' : score.label));
    const tag = row.lastElementChild;
    tag.textContent = later ? 'Later evidence' : score.label;
    tag.className = later ? 'future' : 'tone ' + score.tone;
  }
  const globe = view === 'globe';
  $('tab-globe').setAttribute('aria-selected', String(globe)); $('tab-spectrum').setAttribute('aria-selected', String(!globe));
  stage.hidden = !globe; $('panel-spectrum').hidden = globe;
  $('hint').textContent = globe ? 'Drag to turn · Tap a pin' : 'Earliest at left · Tap a dot';
  $('map-status').textContent = visible + ' of ' + cards.length + ' passages shown';
  $('reader-index').textContent = (active + 1) + ' / ' + cards.length;
  if (!globe) {
    // Keep the selected dot in view when the spectrum is wider than its panel.
    const panel = $('panel-spectrum'), x = dots.get(cards[active].id).offsetLeft + 104;
    if (x < panel.scrollLeft + 130 || x > panel.scrollLeft + panel.clientWidth - 60) panel.scrollLeft = x - panel.clientWidth / 2;
  }
  renderPassage(cards[active]); writeAddress(); queueDraw();
}

// ---- passage reader ---------------------------------------------------------
const checkNotes = {
  matched: date => 'Quote matched word for word at the linked source (automated check, ' + date + ').',
  unreachable: () => 'Quote not machine-checked: the source site turns away automated requests.',
  'not-found': () => 'Automated check could not find this exact wording at the linked source.',
  unchecked: () => 'Quote not yet machine-checked against the linked source.'
};
function renderPassage(card) {
  const score = scores[card.score];
  const heading = node('h2', '', card.name); heading.id = 'reader-title'; heading.tabIndex = -1;
  const mark = node('p', 'position ' + score.tone, score.label + ' · ' + card.facet);
  const info = node('p', 'meta', card.work + ' · ' + card.period);
  const quote = node('blockquote', 'excerpt ' + score.tone, '“' + card.excerpt + '”');
  const why = node('p', 'rationale'); why.append(node('strong', '', 'Why this reading: '), card.why);
  const limit = node('p', 'limit'); limit.append(node('strong', '', 'What it doesn’t show: '), card.limit);
  const link = safeLink('Open source passage (new tab)', card.sourceUrl, 'source');
  const sourceMeta = node('p', 'meta source-meta', card.sourceLabel + ' · ' + card.locator);
  const status = card.check?.status in checkNotes ? card.check.status : 'unchecked';
  const check = node('p', 'check ' + status, checkNotes[status](card.check?.date));
  const where = node('details', 'location');
  where.append(node('summary', '', card.place), node('p', 'pin-note', card.anchorType + ': ' + card.placeNote), safeLink('Source for map location (new tab)', card.placeSource, 'source'));
  const share = button('share', 'Copy link to this passage');
  share.addEventListener('click', () => {
    const done = ok => { share.textContent = ok ? 'Link copied' : 'Copy the address from your browser'; };
    try { window.navigator.clipboard.writeText(window.location.href).then(() => done(true), () => done(false)); } catch { done(false); }
  });
  const back = button('back', 'Back to ' + view);
  back.addEventListener('click', () => {
    const selectedPin = pins.get(cards[active].id);
    const target = view === 'spectrum' ? dots.get(cards[active].id) : lastPin === selectedPin && !lastPin.hidden ? lastPin : $('refocus');
    target.focus({ preventScroll: true }); document.querySelector('.explore').scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  // Where the same passage is placed on the other questions.
  const elsewhere = node('p', 'elsewhere');
  for (const q of atlas.questions) {
    const reading = q !== question && card.readings[q.id];
    if (!reading) continue;
    const jump = node('a', '', q.short + ' ' + q.scale.find(s => s.id === reading.score).label);
    jump.href = questionUrl(q, card.id);
    elsewhere.append(elsewhere.children.length ? ' · ' : 'Same passage on other questions: ', jump);
  }
  const parts = [mark, heading, info, quote, why, limit, link, sourceMeta, check, where, share, back];
  if (elsewhere.children.length) parts.splice(6, 0, elsewhere);
  // A passage quoted in its original language carries the atlas's own English rendering beneath it.
  if (card.translation) parts.splice(4, 0, node('p', 'translation', 'In English (our translation): “' + card.translation + '”'));
  if (card.review === 'draft') parts.splice(3, 0, node('p', 'draft', 'Draft reading · not yet reviewed by an editor'));
  $('passage').replaceChildren(...parts);
}

// ---- globe ------------------------------------------------------------------
const menu = node('div', 'menu');
menu.hidden = true; menu.setAttribute('role', 'group'); menu.setAttribute('aria-label', 'Passages at this place');
stage.append(menu);
function queueDraw() {
  menu.hidden = true;
  if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); });
}
function resize() {
  const r = stage.getBoundingClientRect();
  if (!r.width) return;
  w = r.width; h = r.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); queueDraw();
}
function drawShape(geo, fill, stroke, width = 1) {
  ctx.beginPath(); path(geo);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function paint() {
  if (view !== 'globe') return;
  const r = Math.min(w * .467, h * .474) * zoom, x = w * .5, y = h * .499;
  if (r < 1) return;
  ctx.clearRect(0, 0, w, h);
  projection.translate([x, y]).scale(r).rotate([yaw, pitch, 0]);
  const face = projection.invert([x, y]);
  const isNear = point => d3.geoDistance(point, face) < Math.PI * .486;
  const ocean = ctx.createRadialGradient(x - r * .31, y - r * .4, 0, x, y, r);
  ocean.addColorStop(0, '#2f3d5a'); ocean.addColorStop(.58, '#1d2a44'); ocean.addColorStop(.87, '#121e36'); ocean.addColorStop(1, '#0a142b');
  ctx.save();
  ctx.shadowColor = '#8caaff56'; ctx.shadowBlur = 27;
  drawShape(sphere, ocean, '#92add9', 1.05);
  ctx.restore();
  drawShape(graticule, null, '#b5c9ff3b', .6);
  const landFill = ctx.createLinearGradient(x - r * .45, y - r, x + r * .45, y + r * .85);
  landFill.addColorStop(0, '#9eacc8'); landFill.addColorStop(.48, '#617596'); landFill.addColorStop(1, '#263853');
  drawShape(land, landFill, '#b7cbedad', .72);

  // Where each shown passage lands on screen.
  const placed = [];
  for (const [i, card] of cards.entries()) {
    const el = pins.get(card.id), point = [card.lng, card.lat], [px, py] = projection(point);
    el.hidden = !shown(i) || !isNear(point) || px < 0 || py < 0 || px > w || py > h;
    if (!el.hidden) placed.push({ el, i, card, px, py });
  }
  // Capped kernels are clipped against the land polygon. They show local evidence, not populations.
  ctx.save(); ctx.beginPath(); path(land); ctx.clip();
  const size = Math.max(17, Math.min(w, h) * .085 * Math.sqrt(zoom));
  for (const { card, px, py } of placed) {
    if (card.score === 'unscored') continue;
    const color = scores[card.score].color, g = ctx.createRadialGradient(px, py, 0, px, py, size);
    g.addColorStop(0, color + 'b5'); g.addColorStop(.42, color + '62'); g.addColorStop(1, color + '00');
    ctx.fillStyle = g; ctx.fillRect(px - size, py - size, size * 2, size * 2);
  }
  ctx.restore();
  const rim = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  rim.addColorStop(0, '#d1dcf8'); rim.addColorStop(.4, '#8199ca'); rim.addColorStop(.75, '#4b6598'); rim.addColorStop(1, '#314975');
  drawShape(sphere, null, rim, .9);

  // Pins that would sit on top of each other merge into one numbered pin; the selected pin always stands alone.
  const groups = [];
  for (const item of placed) {
    const home = item.i === active ? null : groups.find(g => !g.solo && Math.hypot(g.x - item.px, g.y - item.py) < CLUSTER_PX);
    if (home) { home.items.push(item); const n = home.items.length; home.x += (item.px - home.x) / n; home.y += (item.py - home.y) / n; }
    else groups.push({ items: [item], x: item.px, y: item.py, solo: item.i === active });
  }
  let used = 0;
  for (const group of groups) {
    if (group.items.length === 1) {
      const { el, px, py } = group.items[0];
      el.style.left = px + 'px'; el.style.top = py + 'px';
      el.classList.toggle('flip', px > w * .72);
      continue;
    }
    for (const { el } of group.items) el.hidden = true;
    const el = clusters[used] || (clusters[used] = makeCluster());
    used++;
    el.hidden = false; el.textContent = String(group.items.length);
    el.style.left = group.x + 'px'; el.style.top = group.y + 'px';
    el.setAttribute('aria-label', group.items.length + ' passages close together: ' + group.items.map(item => item.card.short).join(', ') + '. Zoom in');
    el.spot = projection.invert([group.x, group.y]);
    el.reach = Math.max(...group.items.map(item => Math.hypot(item.px - group.x, item.py - group.y)));
    el.members = group.items.map(item => item.i);
  }
  for (const el of clusters.slice(used)) el.hidden = true;
}
function makeCluster() {
  const el = button('cluster');
  // Zoom in while that would pull the pins apart; places too close to separate (the same city) get a list instead.
  el.addEventListener('click', () => {
    const factor = Math.min(MAX_ZOOM / zoom, 2.4);
    if (factor > 1.05 && el.reach * factor * 2 > CLUSTER_PX * 1.4) return glide(-el.spot[0], -el.spot[1], zoom * factor);
    menu.replaceChildren(...el.members.map(i => {
      const item = button('menu-item ' + scores[cards[i].score].tone, cards[i].short + ' · ' + cards[i].dateShort);
      item.addEventListener('click', () => { lastPin = pins.get(cards[i].id); pick(i, { jump: true }); });
      return item;
    }));
    menu.style.left = clamp(parseFloat(el.style.left), 90, Math.max(90, w - 90)) + 'px';
    menu.style.top = el.style.top;
    menu.hidden = false;
    menu.firstElementChild?.focus();
  });
  $('pins').append(el);
  return el;
}

// ---- controls ---------------------------------------------------------------
slider.min = 0; slider.max = cards.length - 1; slider.step = 1;
slider.addEventListener('input', () => setMoment(Number(slider.value)));
$('prev').addEventListener('click', () => setMoment(moment - 1));
$('next').addEventListener('click', () => setMoment(moment + 1));
$('earlier').addEventListener('click', () => { const i = neighbour(-1); if (i >= 0) pick(i, { center: true }); });
$('later').addEventListener('click', () => { const i = neighbour(1); if (i >= 0) pick(i, { center: true }); });
$('refocus').addEventListener('click', () => center(cards[active]));
$('zoom-in').addEventListener('click', () => setZoom(zoom * 1.5));
$('zoom-out').addEventListener('click', () => setZoom(zoom / 1.5));
$('tab-globe').addEventListener('click', () => setView('globe'));
$('tab-spectrum').addEventListener('click', () => setView('spectrum'));

const turn = (dYaw, dPitch) => { glideId++; yaw = (yaw + dYaw) % 360; pitch = clamp(pitch + dPitch, -80, 80); queueDraw(); };
const keys = {
  ArrowLeft: () => turn(10 / zoom, 0), ArrowRight: () => turn(-10 / zoom, 0),
  ArrowUp: () => turn(0, -10 / zoom), ArrowDown: () => turn(0, 10 / zoom),
  '+': () => setZoom(zoom * 1.5), '=': () => setZoom(zoom * 1.5), '-': () => setZoom(zoom / 1.5), '0': () => setZoom(1)
};
stage.addEventListener('keydown', e => {
  if (e.key === 'Escape') menu.hidden = true;
  if (e.ctrlKey || e.metaKey || e.altKey || !keys[e.key]) return;
  e.preventDefault(); keys[e.key]();
});
// Plain scrolling stays with the page; pinch on a trackpad (reported as ctrl+wheel) zooms the globe.
canvas.addEventListener('wheel', e => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault(); setZoom(zoom * Math.exp(-e.deltaY * .01));
}, { passive: false });

const touches = new Map();
let drag = null, pinch = null;
const spread = () => { const [a, b] = [...touches.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
canvas.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  canvas.setPointerCapture(e.pointerId);
  if (touches.size === 2) { pinch = { spread: spread(), zoom }; drag = null; }
  else if (touches.size === 1) drag = { x: e.clientX, y: e.clientY, yaw, pitch, id: e.pointerId, locked: false };
});
canvas.addEventListener('pointermove', e => {
  if (!touches.has(e.pointerId)) return;
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && touches.size === 2) return setZoom(pinch.zoom * spread() / pinch.spread);
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (!drag.locked && Math.hypot(dx, dy) < 5) return;
  if (!drag.locked) { drag.locked = true; glideId++; stage.classList.add('dragging'); }
  const k = 132 / Math.min(w, h) / zoom;
  yaw = (drag.yaw + dx * k) % 360; pitch = clamp(drag.pitch - dy * k, -80, 80); queueDraw();
});
for (const evt of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(evt, e => {
  touches.delete(e.pointerId); drag = null; pinch = null; stage.classList.remove('dragging');
});

if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(stage);
else window.addEventListener('resize', resize);
window.addEventListener?.('hashchange', () => { if (readAddress()) refresh(); });
if (!readAddress()) center(cards[active], true);
setZoom(1); refresh(); resize();
})();
