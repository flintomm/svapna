(() => {
'use strict';
const $ = id => document.getElementById(id);
// Everything shown comes from evidence.js (built from data/ by tools/atlas.cjs); nothing about a
// particular thinker lives in this file. Cards arrive sorted by date, one timeline stop per card.
// The atlas holds several questions. One is shown at a time, chosen by ?q= in the address; each has its own
// scale, and only passages that have been read for that question appear under it.
const atlas = window.PILOT_EVIDENCE;
const asked = new URLSearchParams(window.location?.search || '').get('q');
const placedOn = q => atlas.cards.some(card => card.readings[q.id]);
const question = atlas.questions.find(q => q.id === asked && placedOn(q)) || atlas.questions[0];
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
// A host page may restyle the globe by setting window.ATLAS_THEME before this script runs.
const theme = { ocean: ['#2f3d5a', '#1d2a44', '#121e36', '#0a142b'], halo: '#8caaff56', haloBlur: 27, edge: '#92add9', graticule: '#b5c9ff3b',
  land: ['#9eacc8', '#617596', '#263853'], coast: '#b7cbedad', rim: ['#d1dcf8', '#8199ca', '#4b6598', '#314975'], glow: ['b5', '62', '00'], tones: {},
  ...(window.ATLAS_THEME || {}) };
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
// Documented connections: a thinker's links, looked up by the name on the passage.
const linksOf = name => (atlas.links || []).flatMap(link => {
  const out = link.from.includes(name), back = link.to.includes(name);
  if (!out && !back) return [];
  const others = out ? link.to : link.from;
  // The other thinker's passage on this question if there is one, else any passage of theirs.
  const here = cards.find(c => others.includes(c.name));
  const anywhere = here || atlas.cards.find(c => others.includes(c.name));
  return anywhere ? [{ link, out, other: anywhere, here: Boolean(here) }] : [];
});
const questionUrl = (q, passageId) => '?q=' + q.id + (passageId ? '#p=' + passageId : '');
// Questions are offered in their groups, each group under its own small heading.
let shownGroup = '';
for (const q of atlas.questions.filter(placedOn)) {
  if (q.group && q.group !== shownGroup) { shownGroup = q.group; $('questions').append(node('span', 'qgroup', q.group)); }
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
function setMoment(value, still) {
  const i = Number(value);
  if (!Number.isInteger(i) || i < 0 || i >= cards.length || i === moment) return refresh();
  moment = i; active = i;
  if (filter && cards[i].score !== filter) filter = '';
  if (!still) center(cards[i]);
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
  drawEras();
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
  $('hint').textContent = globe ? 'Drag turns the globe · A pin opens its passage' : 'Earliest at left · A dot opens its passage';
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
  const ties = linksOf(card.name);
  if (ties.length) {
    const box = node('div', 'ties');
    box.append(node('p', 'ties-title', 'Documented connections'));
    for (const { link, out, other, here } of ties) {
      const row = node('p', 'tie'), jump = node('a', '', other.name);
      jump.href = here ? '#p=' + other.id : questionUrl(atlas.questions.find(q => q.id === other.question) || question, other.id);
      if (here) jump.addEventListener('click', event => { event.preventDefault(); pick(cards.findIndex(c => c.id === other.id), { center: true }); });
      const lead = out ? [card.short + ' ' + link.verb + ' ', jump] : [jump, ' ' + link.verb + ' ' + card.short];
      row.append(...lead, (link.year ? ' (' + link.year + ')' : '') + '. ', node('span', 'tie-note', link.summary + (link.caveat ? ' ' + link.caveat : '')));
      box.append(row);
    }
    parts.splice(parts.indexOf(elsewhere) >= 0 ? parts.indexOf(elsewhere) + 1 : 6, 0, box);
  }
  // A passage quoted in its original language carries the atlas's own English rendering beneath it.
  if (card.translation) parts.splice(4, 0, node('p', 'translation', 'In English (the atlas’s own translation): “' + card.translation + '”'));
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
// The scale as a colour ramp: position 0 (first step) to 1 (last scored step).
const scored = scale.filter(step => step.tone !== 'none');
const heatStops = (theme.heat || scored.map(step => theme.tones[step.tone] || step.color)).map(hex => [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)));
const heatValue = Object.fromEntries(scored.map((step, i) => [step.id, scored.length > 1 ? i / (scored.length - 1) : .5]));
function ramp(v) {
  const span = v * (heatStops.length - 1), i = Math.min(heatStops.length - 2, Math.floor(span)), f = span - i;
  return heatStops[i].map((c, k) => c + (heatStops[i + 1][k] - c) * f);
}
const HEAT_CELL = 4, heatCanvas = document.createElement('canvas');
function paintHeat(placed, size) {
  const hctx = heatCanvas.getContext && heatCanvas.getContext('2d');
  if (!hctx || !hctx.createImageData) return;
  const cols = Math.ceil(w / HEAT_CELL), rows = Math.ceil(h / HEAT_CELL);
  if (cols < 2 || rows < 2) return;
  const weight = new Float32Array(cols * rows), value = new Float32Array(cols * rows);
  const sigma = size / HEAT_CELL / 2.2, reach = Math.ceil(sigma * 2.6), k = 1 / (2 * sigma * sigma);
  for (const { card, px, py } of placed) {
    const v = heatValue[card.score];
    if (v === undefined) continue;
    const cx = px / HEAT_CELL, cy = py / HEAT_CELL;
    for (let gy = Math.max(0, Math.floor(cy - reach)); gy <= Math.min(rows - 1, Math.ceil(cy + reach)); gy++) {
      for (let gx = Math.max(0, Math.floor(cx - reach)); gx <= Math.min(cols - 1, Math.ceil(cx + reach)); gx++) {
        const d = (gx - cx) * (gx - cx) + (gy - cy) * (gy - cy), wt = Math.exp(-d * k);
        if (wt < .02) continue;
        weight[gy * cols + gx] += wt; value[gy * cols + gx] += wt * v;
      }
    }
  }
  heatCanvas.width = cols; heatCanvas.height = rows;
  const image = hctx.createImageData(cols, rows), strength = theme.heatAlpha ?? .78;
  for (let i = 0; i < weight.length; i++) {
    if (weight[i] < .02) continue;
    const [r, g, b] = ramp(value[i] / weight[i]);
    image.data[i * 4] = r; image.data[i * 4 + 1] = g; image.data[i * 4 + 2] = b;
    image.data[i * 4 + 3] = 255 * strength * Math.min(1, weight[i]);
  }
  hctx.putImageData(image, 0, 0);
  ctx.save(); ctx.beginPath(); path(land); ctx.clip();
  ctx.imageSmoothingEnabled = true; ctx.drawImage(heatCanvas, 0, 0, w, h);
  ctx.restore();
}
{ const key = $('heatkey');
  if (key && scored.length > 1) {
    key.children[0].textContent = scored[0].label; key.children[2].textContent = scored[scored.length - 1].label;
    key.children[1].style.background = 'linear-gradient(90deg, ' + heatStops.map(c => 'rgb(' + c.join(',') + ')').join(', ') + ')';
  } }
// Era chart: for each stretch of history, how the scored passages divide along the scale.
const ERAS = [[-Infinity, 'Before 500 BCE'], [-500, '500–1 BCE'], [0, '1–500'], [500, '500–1000'], [1000, '1000–1500'], [1500, '1500–1800'], [1800, '1800–1900'], [1900, 'Since 1900']];
const eraOf = year => { let k = 0; ERAS.forEach(([from], i) => { if (year >= from) k = i; }); return k; };
const toneColor = step => step.tone === 'none' ? '#9a9a9a' : 'rgb(' + ramp(heatValue[step.id]).map(Math.round).join(',') + ')';
function drawEras() {
  const box = $('eras');
  if (!box) return;
  const rows = ERAS.map(([, label]) => ({ label, counts: Object.fromEntries(scale.map(s => [s.id, 0])), n: 0, live: 0 }));
  cards.forEach((card, i) => { const row = rows[eraOf(card.sortYear)]; row.counts[card.score]++; row.n++; if (i <= moment) row.live++; });
  box.replaceChildren(...rows.filter(row => row.n).map(row => {
    const line = node('div', 'era' + (row.live ? '' : ' later')), bar = node('span', 'era-bar');
    for (const step of scale) {
      if (!row.counts[step.id]) continue;
      const part = node('i', ''); part.style.flex = row.counts[step.id] + ' 0 0'; part.style.background = toneColor(step);
      part.title = step.label + ': ' + row.counts[step.id]; bar.append(part);
    }
    line.append(node('span', 'era-name', row.label), bar, node('span', 'era-n', String(row.n)));
    return line;
  }));
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
  [0, .58, .87, 1].forEach((stop, i) => ocean.addColorStop(stop, theme.ocean[i]));
  ctx.save();
  ctx.shadowColor = theme.halo; ctx.shadowBlur = theme.haloBlur;
  drawShape(sphere, ocean, theme.edge, 1.05);
  ctx.restore();
  drawShape(graticule, null, theme.graticule, .6);
  const landFill = ctx.createLinearGradient(x - r * .45, y - r, x + r * .45, y + r * .85);
  [0, .48, 1].forEach((stop, i) => landFill.addColorStop(stop, theme.land[i]));
  drawShape(land, landFill, theme.coast, .72);

  // Where each shown passage lands on screen.
  const placed = [];
  for (const [i, card] of cards.entries()) {
    const el = pins.get(card.id), point = [card.lng, card.lat], [px, py] = projection(point);
    el.hidden = !shown(i) || !isNear(point) || px < 0 || py < 0 || px > w || py > h;
    if (!el.hidden) placed.push({ el, i, card, px, py });
  }
  // Heat layer: around the passages, colour runs along the scale's gradient by the weighted mean of nearby positions,
  // and fades with distance. It is clipped to land and shows local evidence, not populations.
  const size = Math.max(22, Math.min(w, h) * .1 * Math.sqrt(zoom));
  paintHeat(placed, size);
  // Arcs from the selected passage to the thinkers it is documented as citing, answering or writing to.
  const from = cards[active];
  for (const { other } of linksOf(from.name)) {
    ctx.beginPath(); path({ type: 'LineString', coordinates: [[from.lng, from.lat], [other.lng, other.lat]] });
    ctx.strokeStyle = theme.link || '#ffffffcc'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
    const [ox, oy] = projection([other.lng, other.lat]);
    if (isNear([other.lng, other.lat])) { ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI * 2); ctx.fillStyle = theme.link || '#ffffffcc'; ctx.fill(); }
  }
  const rim = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  [0, .4, .75, 1].forEach((stop, i) => rim.addColorStop(stop, theme.rim[i]));
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
// Play through time: passages appear in date order while the globe holds still.
let playing = 0;
function stopPlay() { if (playing) clearInterval(playing); playing = 0; const b = $('play'); if (b) { b.textContent = '▶'; b.setAttribute('aria-pressed', 'false'); } }
if ($('play')) $('play').addEventListener('click', () => {
  if (playing) return stopPlay();
  if (moment >= cards.length - 1) setMoment(0, true);
  $('play').textContent = '❚❚'; $('play').setAttribute('aria-pressed', 'true');
  const pace = Math.max(120, Math.min(700, 30000 / cards.length));
  playing = setInterval(() => { if (moment >= cards.length - 1) return stopPlay(); setMoment(moment + 1, true); }, pace);
});
$('prev').addEventListener('click', () => { stopPlay(); setMoment(moment - 1); });
$('next').addEventListener('click', () => { stopPlay(); setMoment(moment + 1); });
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
