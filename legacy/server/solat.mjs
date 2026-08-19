/* Astronomical prayer-time calc, ported verbatim from the frontend bundle
   (chunk DGNfXQVC.js) so server "official" times match the client fallback. */
const RAD = Math.PI / 180;

function solarParams(date) {
  const t = Math.floor(date.getTime() / 864e5) + 2440588 - 0.5 - 2451545;
  const n = ((357.529 + 0.98560028 * t) % 360 + 360) % 360;
  const r = ((280.459 + 0.98564736 * t) % 360 + 360) % 360;
  const i = ((r + 1.915 * Math.sin(n * RAD) + 0.02 * Math.sin(2 * n * RAD)) % 360 + 360) % 360;
  const a = 23.439 - 36e-8 * t;
  let o = Math.atan2(Math.cos(a * RAD) * Math.sin(i * RAD), Math.cos(i * RAD)) / RAD / 15;
  o = (o + 24) % 24;
  const s = Math.asin(Math.sin(a * RAD) * Math.sin(i * RAD)) / RAD;
  let l = r / 15 - o;
  if (l > 12) l -= 24;
  if (l < -12) l += 24;
  return { decl: s, eqt: l };
}
function hourAngle(e, t, n) {
  const r = (-Math.sin(e * RAD) - Math.sin(t * RAD) * Math.sin(n * RAD)) / (Math.cos(t * RAD) * Math.cos(n * RAD));
  return r > 1 || r < -1 ? NaN : Math.acos(r) / RAD / 15;
}
export function prayerTimes(lat, lng, date, tz = 8) {
  const { decl, eqt } = solarParams(date);
  const noon = 12 - lng / 15 - eqt + tz;
  const asr = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * RAD))) / RAD;
  const subuh = noon - hourAngle(20, decl, lat);
  return {
    Imsak: subuh - 10 / 60, Subuh: subuh, Syuruk: noon - hourAngle(0.833, decl, lat),
    Zohor: noon + 2 / 60, Asar: noon + hourAngle(-asr, decl, lat),
    Maghrib: noon + hourAngle(0.833, decl, lat), Isyak: noon + hourAngle(18, decl, lat),
  };
}
export const fmt = h => {
  if (!isFinite(h)) return '—';
  h = (h % 24 + 24) % 24;
  let H = Math.floor(h), M = Math.round((h - H) * 60);
  if (M === 60) { H++; M = 0; }
  return `${String(H % 24).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
};

// city name -> official JAKIM zone (from the frontend bundle)
export const NAME_ZONE = {
  'Kuala Kangsar': 'PRK02', Ipoh: 'PRK02', 'Kuala Lumpur': 'WLY01', Putrajaya: 'WLY01',
  'Shah Alam': 'SGR01', 'George Town': 'PNG01', 'Alor Setar': 'KDH01', Kangar: 'PLS01',
  'Kota Bharu': 'KTN01', 'Kuala Terengganu': 'TRG01', Kuantan: 'PHG02', Seremban: 'NGS03',
  Melaka: 'MLK01', 'Johor Bahru': 'JHR02', Kuching: 'SWK08', Sibu: 'SWK04', Miri: 'SWK02',
  'Kota Kinabalu': 'SBH07', Sandakan: 'SBH01', Tawau: 'SBH04', Labuan: 'WLY02',
};

export function hijriOf(date) {
  try {
    const p = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',
      { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(date);
    const g = t => p.find(x => x.type === t)?.value;
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',
      { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
    const gn = t => +parts.find(x => x.type === t)?.value;
    return { day: gn('day'), month: gn('month'), year: gn('year'), monthName: g('month'), text: `${g('day')} ${g('month')} ${g('year')} H` };
  } catch { return null; }
}
