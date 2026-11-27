// The arithmetic behind "Your signs": where the sun and moon stood on a given day, and the day's place in four calendars.
// Positions follow the short series in Jean Meeus, Astronomical Algorithms (1998): the sun to about 0.01 degrees and
// the moon to about 0.1. That is ample for naming a sign, and each result says when the day falls too near a boundary.
(function (root) {
  var R = Math.PI / 180, sin = function (d) { return Math.sin(d * R); }, n360 = function (x) { return ((x % 360) + 360) % 360; };
  // Julian day from a calendar date (Gregorian) and hours of universal time.
  function jd(y, m, d, h) { if (m <= 2) { y -= 1; m += 12; } var a = Math.floor(y / 100), b = 2 - a + Math.floor(a / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5 + (h || 0) / 24; }
  function sunLon(J) { var T = (J - 2451545) / 36525, L = 280.46646 + 36000.76983 * T + .0003032 * T * T, M = 357.52911 + 35999.05029 * T - .0001537 * T * T;
    var C = (1.914602 - .004817 * T - .000014 * T * T) * sin(M) + (.019993 - .000101 * T) * sin(2 * M) + .000289 * sin(3 * M);
    return n360(L + C - .00569 - .00478 * sin(125.04 - 1934.136 * T)); }
  var MT = [[0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],[0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],[2,1,0,0,-6766],[1,0,-1,0,-5163]];
  function moonLon(J) { var T = (J - 2451545) / 36525, L = 218.3164477 + 481267.88123421 * T, D = 297.8501921 + 445267.1114034 * T, M = 357.5291092 + 35999.0502909 * T, Mp = 134.9633964 + 477198.8675055 * T, F = 93.272095 + 483202.0175233 * T, s = 0;
    for (var i = 0; i < MT.length; i++) { var t = MT[i]; s += t[4] * sin(t[0] * D + t[1] * M + t[2] * Mp + t[3] * F); }
    return n360(L + s / 1e6); }
  // The Lahiri ayanamsa, the offset the Indian national calendar uses between the two zodiacs.
  function ayanamsa(J) { return 23.853 + (J - 2451545) / 365.25 * 50.29 / 3600; }
  // The first day of each Chinese year, 1900 to 2100, as days after 20 January, one base-36 digit a year.
  var CNY = 'buj9rf5od2lath6pe3mcvj8rg4od3lash6pf4mbuj7qg5od2l9sh7pe4nbtj8qg5od1kash7qe3mbti8rg5odvk9sh7qf3lbui8rg4nc2k9ti6pe3lbuj8rg5nc2l9sh6oe3mbuj8qf4nc2lash6pd3mcuj8qf4nd1k9sg6pe3mbui7qg4nd2k9sh6pe4lati7qg5nc1k';
  function cny(y) { var k = parseInt(CNY.charAt(y - 1900), 36); return isNaN(k) ? null : { m: k < 12 ? 1 : 2, d: k < 12 ? k + 20 : k - 11 }; }
  // The moment the sun reaches a given longitude in a given year, searched day by day then by bisection.
  function sunAt(y, lon, m0) { var a = jd(y, m0, 1, 0), b = a + 40, f = function (J) { var x = n360(sunLon(J) - lon); return x > 180 ? x - 360 : x; };
    for (var i = 0; i < 40; i++) { var c = (a + b) / 2; if (f(c) < 0) a = c; else b = c; } return a; }
  root.Sky = { jd: jd, sunLon: sunLon, moonLon: moonLon, ayanamsa: ayanamsa, cny: cny, sunAt: sunAt, n360: n360 };
})(typeof window !== 'undefined' ? window : module.exports);
