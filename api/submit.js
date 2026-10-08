// Vercel serverless function: receives the website forms and forwards them to a Power Automate flow,
// which adds a row to an Excel table. See docs/form-to-excel-power-automate.md.
//
// Why a function instead of calling Power Automate from the browser: the flow's URL contains a secret
// signature. Kept here (POWER_AUTOMATE_URL, server-side only) it never reaches visitors.

const MAX_FIELD = 3000;
const TYPE_LABELS = { hiring: 'Hiring talent', seeking: 'Consultant (looking for a role)' };
const hits = new Map(); // best-effort per-instance rate limit: ip -> timestamps

function clean(v) {
  let s = v === undefined || v === null ? '' : String(v);
  s = s.trim().slice(0, MAX_FIELD);
  // A value starting with = + - @ would run as a formula when the workbook is opened in Excel.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function tooMany(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 8;
  const recent = (hits.get(ip) || []).filter((t) => now - t < win);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

function localTime(date) {
  const tz = process.env.FORM_TIMEZONE || 'America/New_York';
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .format(date).replace(',', '');
  } catch { return date.toISOString(); }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method' }); }

  // Browsers on other websites must not be able to post here.
  const origin = req.headers.origin;
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch { /* malformed */ }
    if (host !== req.headers.host) return res.status(403).json({ ok: false, error: 'origin' });
  }

  let data = req.body;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch { data = null; } }
  if (!data || typeof data !== 'object') return res.status(400).json({ ok: false, error: 'invalid' });

  // Bots fill the hidden "website" field. Pretend success, forward nothing.
  if (data.website) return res.status(200).json({ ok: true });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return res.status(429).json({ ok: false, error: 'rate' });

  const name = clean(data.name), email = clean(data.email);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid' });

  const url = process.env.POWER_AUTOMATE_URL;
  if (!url) return res.status(503).json({ ok: false, error: 'not_configured' });

  const now = new Date();
  const payload = {
    submittedAtUtc: now.toISOString(),
    submittedAtLocal: localTime(now),
    type: TYPE_LABELS[data.audience] || 'Other',
    name,
    email,
    company: clean(data.company),
    profileUrl: clean(data.profile_url),
    role: clean(data.role),
    message: clean(data.message),
    page: clean(data.page),
  };

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal });
    if (!r.ok) { console.error('Power Automate responded', r.status); return res.status(502).json({ ok: false, error: 'upstream' }); }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Power Automate request failed:', err && err.name);
    return res.status(502).json({ ok: false, error: 'upstream' });
  } finally {
    clearTimeout(timer);
  }
}
