// "Your signs": one birth date, placed in five traditions. Everything is computed here in the browser.
(function () {
  var S = window.Sky, $ = function (id) { return document.getElementById(id); }, form = $('signs-form'), out = $('signs-out'); if (!form || !S) return;
  var W = [['Aries', 'the ram', 'cardinal fire', 'Mars', 'bold, quick to begin and impatient', 'Mesha'], ['Taurus', 'the bull', 'fixed earth', 'Venus', 'steady, fond of comfort and slow to change', 'Vrishabha'], ['Gemini', 'the twins', 'mutable air', 'Mercury', 'curious, talkative and changeable', 'Mithuna'], ['Cancer', 'the crab', 'cardinal water', 'the Moon', 'protective, attached to home and moody', 'Karka'], ['Leo', 'the lion', 'fixed fire', 'the Sun', 'proud, generous and fond of attention', 'Simha'], ['Virgo', 'the maiden', 'mutable earth', 'Mercury', 'careful, practical and critical', 'Kanya'], ['Libra', 'the scales', 'cardinal air', 'Venus', 'fair-minded, sociable and slow to decide', 'Tula'], ['Scorpio', 'the scorpion', 'fixed water', 'Mars', 'intense, private and determined', 'Vrishchika'], ['Sagittarius', 'the archer', 'mutable fire', 'Jupiter', 'frank, restless and hopeful', 'Dhanu'], ['Capricorn', 'the sea-goat', 'cardinal earth', 'Saturn', 'ambitious, disciplined and reserved', 'Makara'], ['Aquarius', 'the water-bearer', 'fixed air', 'Saturn', 'independent, inventive and detached', 'Kumbha'], ['Pisces', 'the fishes', 'mutable water', 'Jupiter', 'dreamy, sympathetic and easily swayed', 'Meena']];
  var NAK = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  var AN = [['Rat', '子', 'quick-witted and resourceful'], ['Ox', '丑', 'patient and dependable'], ['Tiger', '寅', 'brave and impulsive'], ['Rabbit', '卯', 'gentle and cautious'], ['Dragon', '辰', 'confident and ambitious'], ['Snake', '巳', 'shrewd and private'], ['Horse', '午', 'energetic and independent'], ['Goat', '未', 'mild and artistic'], ['Monkey', '申', 'clever and mischievous'], ['Rooster', '酉', 'observant and outspoken'], ['Dog', '戌', 'loyal and honest'], ['Pig', '亥', 'generous and easy-going']];
  var STEM = '甲乙丙丁戊己庚辛壬癸', PH = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  var MAYA = [['Imix', 'the waterlily, the surface of the earth'], ['Ik’', 'wind and breath'], ['Ak’bal', 'night and darkness'], ['K’an', 'the maize seed'], ['Chikchan', 'the snake'], ['Kimi', 'death'], ['Manik’', 'the deer'], ['Lamat', 'the star, Venus'], ['Muluk', 'water'], ['Ok', 'the dog'], ['Chuwen', 'the monkey'], ['Eb', 'the road'], ['Ben', 'the reed'], ['Ix', 'the jaguar'], ['Men', 'the eagle'], ['Kib', 'the vulture'], ['Kaban', 'the earth'], ['Etz’nab', 'flint'], ['Kawak', 'the storm'], ['Ajaw', 'the lord, the sun']];
  var BUR = [['Sunday', 'the garuda, a mythical bird', 'the Sun', 'north-east', 'red'], ['Monday', 'the tiger', 'the Moon', 'east', 'yellow'], ['Tuesday', 'the lion', 'Mars', 'south-east', 'pink'], ['Wednesday', 'the elephant', 'Mercury', 'south', 'green'], ['Thursday', 'the rat', 'Jupiter', 'west', 'orange'], ['Friday', 'the guinea pig', 'Venus', 'north', 'blue'], ['Saturday', 'the naga, a serpent-dragon', 'Saturn', 'south-west', 'purple']];
  var off = $('s-off'), here = Math.round(-new Date().getTimezoneOffset() / 30) / 2;
  for (var h = -12; h <= 14; h += .5) { var o = document.createElement('option'), a = Math.abs(h); o.value = h; o.textContent = h === 0 ? 'The same as Greenwich (UTC)' : (Math.floor(a) + (a % 1 ? ':30' : ':00') + (h > 0 ? ' ahead' : ' behind')); if (h === here) o.selected = true; off.appendChild(o); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function row(head, sub, body) { return '<div><b>' + head + '<small>' + sub + '</small></b><div>' + body + '</div></div>'; }
  function an(w) { return /^[AEIOU]/.test(w) ? 'an ' + w : 'a ' + w; }
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function compute(y, m, d, time, tz) {
    var J0 = S.jd(y, m, d, (time == null ? 0 : time) - tz), J1 = time == null ? J0 + 1 : J0, r = {};
    var sg = function (lon) { return Math.floor(S.n360(lon) / 30); };
    r.sun = [sg(S.sunLon(J0)), sg(S.sunLon(J1))]; r.moon = [sg(S.moonLon(J0)), sg(S.moonLon(J1))];
    var ay = S.ayanamsa(J0), nk = function (lon) { return Math.floor(S.n360(lon - ay) / (360 / 27)); };
    r.ssun = [sg(S.sunLon(J0) - ay), sg(S.sunLon(J1) - ay)]; r.smoon = [sg(S.moonLon(J0) - ay), sg(S.moonLon(J1) - ay)]; r.nak = [nk(S.moonLon(J0)), nk(S.moonLon(J1))];
    // The Chinese year by the lunar new year, and by the start of spring (taken as a day in China, eight hours ahead of Greenwich).
    var c = S.cny(y), before = c && (m < c.m || (m === c.m && d < c.d)), cy = before ? y - 1 : y;
    var lj = S.sunAt(y, 315, 1 + (1)), ld = new Date((lj + 8 / 24 - 2440587.5) * 864e5), lm = ld.getUTCMonth() + 1, ldd = ld.getUTCDate(), beforeL = m < lm || (m === lm && d < ldd);
    r.cy = cy; r.cnyDate = c; r.ly = beforeL ? y - 1 : y; r.lichun = { m: lm, d: ldd };
    var n = Math.round(S.jd(y, m, d, 12)) - 584283; r.tz = [((n + 3) % 13 + 13) % 13 + 1, ((n + 19) % 20 + 20) % 20];
    r.dow = ((Math.round(S.jd(y, m, d, 12)) + 1) % 7 + 7) % 7; r.pm = time == null ? null : time >= 12;
    return r;
  }
  window.svapnaSigns = compute;

  function chinese(yr) { var s = ((yr - 4) % 10 + 10) % 10, b = ((yr - 4) % 12 + 12) % 12; return { name: PH[s >> 1] + ' ' + AN[b][0], han: STEM.charAt(s) + AN[b][1], yin: s % 2 ? 'yin' : 'yang', a: AN[b], ph: PH[s >> 1] }; }

  function render(y, m, d, time, tz) {
    var r = compute(y, m, d, time, tz), h = '', timed = time != null, need = ' <a href="#s-date" class="signs-add">Add the time of birth</a> to settle it.';
    // Western
    var w = W[r.sun[0]], b;
    if (r.sun[0] === r.sun[1]) b = '<p class="sign">Sun in ' + w[0] + ', ' + w[1] + '</p><p>' + w[0] + ' is a sign of ' + w[2] + ', ruled by ' + w[3] + '. Western handbooks describe people born under it as ' + w[4] + '.</p>';
    else b = '<p class="sign">Sun in ' + w[0] + ' or ' + W[r.sun[1]][0] + '</p><p>The sun moved from ' + w[0] + ' into ' + W[r.sun[1]][0] + ' on this date, and the hour of birth decides which.' + need + '</p>';
    b += r.moon[0] === r.moon[1] ? '<p>The moon was in ' + W[r.moon[0]][0] + '. In a Western chart the moon’s sign is read for feeling and habit, and the sun’s for the conscious self.</p>' : '<p>The moon moved from ' + W[r.moon[0]][0] + ' into ' + W[r.moon[1]][0] + ' during this day.' + need + '</p>';
    h += row('Western', 'Zodiac measured from the spring equinox', b);
    // Indian
    var v = W[r.ssun[0]];
    b = r.smoon[0] === r.smoon[1] ? '<p class="sign">Moon in ' + W[r.smoon[0]][5] + ' (' + W[r.smoon[0]][0] + ')</p><p>This is the <em>rashi</em>, the sign an Indian astrologer asks for first.' + (r.nak[0] === r.nak[1] ? ' The moon’s station, the birth <em>nakshatra</em>, was ' + NAK[r.nak[0]] + ', number ' + (r.nak[0] + 1) + ' of twenty-seven.' : ' The moon passed from the nakshatra ' + NAK[r.nak[0]] + ' into ' + NAK[r.nak[1]] + ' during this day.' + (timed ? '' : need)) + '</p>'
      : '<p class="sign">Moon in ' + W[r.smoon[0]][5] + ' or ' + W[r.smoon[1]][5] + '</p><p>The moon’s sign, the <em>rashi</em>, is what an Indian astrologer asks for first. On this day the moon moved from ' + W[r.smoon[0]][5] + ' (' + W[r.smoon[0]][0] + ') into ' + W[r.smoon[1]][5] + ' (' + W[r.smoon[1]][0] + ').' + need + '</p>';
    b += r.ssun[0] === r.ssun[1] ? '<p>The sun was in ' + v[5] + ' (' + v[0] + ')' + (r.sun[0] === r.sun[1] && r.ssun[0] !== r.sun[0] ? ', one sign back from the Western ' + W[r.sun[0]][0] + ', because this zodiac is measured from the stars' : r.ssun[0] === r.sun[0] ? ', the same sign as in the Western zodiac, which is true of dates in the last week or so of each sign' : '') + '. Jyotisha uses the same rulers and much the same characters for the twelve signs as the West.</p>' : '<p>The sun moved from ' + v[5] + ' into ' + W[r.ssun[1]][5] + ' on this date.</p>';
    h += row('Indian', 'Jyotisha: zodiac measured from the stars', b);
    // Chinese
    var c = chinese(r.cy), c2 = chinese(r.ly), cd = r.cnyDate;
    b = '<p class="sign">Year of the ' + c.name + ' <span lang="zh">' + c.han + '</span></p><p>In ' + y + ' the Chinese new year fell on ' + cd.d + ' ' + MON[cd.m - 1] + (r.cy < y ? ', after this date, so the date belongs to the year that began in ' + r.cy : ', so the date belongs to the year that began then') + '. It is ' + an(c.a[0]) + ' year, in the phase of ' + c.ph.toLowerCase() + ', and a ' + c.yin + ' year. Almanacs describe people born in ' + an(c.a[0]) + ' year as ' + c.a[2] + '.</p>';
    if (r.ly !== r.cy) b += '<p>The Four Pillars method starts the year at <em>lichun</em>, the start of spring, which fell on ' + r.lichun.d + ' ' + MON[r.lichun.m - 1] + '. By that reckoning this date belongs to the year of the ' + c2.name + ' <span lang="zh">' + c2.han + '</span>. A fortune-teller would use that one.</p>';
    else b += '<p>A full reading would also take the month, day and hour of birth: the eight characters of the Four Pillars.</p>';
    h += row('Chinese', 'The cycle of sixty years', b);
    // Maya
    var my = MAYA[r.tz[1]];
    h += row('Maya', 'The count of 260 days', '<p class="sign">' + r.tz[0] + ' ' + my[0] + '</p><p>The day sign ' + my[0] + ' stands for ' + my[1] + ', and the number ' + r.tz[0] + ' is its place in the run of thirteen. The same pairing returns every 260 days. A daykeeper reads a person’s nature from the sign and number of the birth day.</p>');
    // Burmese
    var bu = BUR[r.dow], animal = bu[1];
    if (r.dow === 3) animal = r.pm == null ? 'the elephant: with tusks for a birth before noon, without tusks for a birth after noon, when the day belongs to the shadow planet Rahu' : r.pm ? 'the elephant without tusks, since from noon the day belongs to the shadow planet Rahu' : 'the elephant with tusks';
    h += row('Burmese', 'The day of the week', '<p class="sign">' + bu[0] + '-born</p><p>In Burma the birth day’s animal is ' + animal + '. Its planet is ' + (r.dow === 3 && r.pm ? 'Rahu' : bu[2]) + ', and its shrine stands at the ' + (r.dow === 3 && r.pm ? 'north-west' : bu[3]) + ' corner of a pagoda. In Thailand the colour of ' + bu[0] + ' is ' + bu[4] + '.</p>');
    out.innerHTML = '<h2>' + d + ' ' + MON[m - 1] + ' ' + y + '</h2><div class="steps">' + h + '</div><p class="def">Five systems, five different answers for one day. Each follows its own rules exactly. None of them has been shown to describe a person better than chance: <a href="/stars/horoscopes#tests">what tests have found</a>.</p>';
    [].forEach.call(out.querySelectorAll('.signs-add'), function (a) { a.addEventListener('click', function (e) { e.preventDefault(); form.querySelector('details').open = true; $('s-time').focus(); }); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('s-date').value, t = $('s-time').value; if (!v) return;
    var p = v.split('-').map(Number); if (p[0] < 1900 || p[0] > 2100) { out.innerHTML = '<p class="def">This page covers dates from 1900 to 2100.</p>'; return; }
    var time = t ? Number(t.slice(0, 2)) + Number(t.slice(3, 5)) / 60 : null;
    render(p[0], p[1], p[2], time, Number(off.value)); out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
