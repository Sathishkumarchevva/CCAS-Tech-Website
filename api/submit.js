// Vercel serverless function: receives the website forms and delivers each enquiry to HR two ways:
//   1. an email to HR_EMAIL (default hr@ccas-tech.com) through Resend   -> RESEND_API_KEY
//   2. a new row in an Excel table through a Power Automate flow         -> POWER_AUTOMATE_URL
// Either one is enough; both can be on. See docs/form-submissions-setup.md.
//
// Why a function and not the browser: both the API key and the flow URL are secrets. Kept here, server-side,
// they never reach visitors.

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

  const paUrl = process.env.POWER_AUTOMATE_URL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!paUrl && !resendKey) return res.status(503).json({ ok: false, error: 'not_configured' });

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

  // Two independent destinations: an Excel row (Power Automate) and an email to HR (Resend).
  // The visitor sees success if at least one of them accepted the enquiry.
  const jobs = [];
  if (paUrl) jobs.push(['excel', () => postJson(paUrl, payload)]);
  if (resendKey) jobs.push(['email', () => sendHrEmail(resendKey, payload)]);
  const results = await Promise.allSettled(jobs.map(([, run]) => run()));
  let ok = false;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') ok = true;
    else console.error(`${jobs[i][0]} delivery failed:`, r.reason && r.reason.message);
  });
  if (!ok) return res.status(502).json({ ok: false, error: 'upstream' });
  return res.status(200).json({ ok: true });
}

async function postJson(url, body, headers = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  } finally {
    clearTimeout(timer);
  }
}

// Plain-text email (no HTML, so nothing a visitor types can be interpreted as markup).
function sendHrEmail(key, p) {
  const oneLine = (v) => String(v).replace(/[\r\n]+/g, ' ').slice(0, 120);
  const rows = [
    ['Type', p.type], ['Name', p.name], ['Email', p.email], ['Company', p.company], ['LinkedIn / portfolio', p.profileUrl],
    ['Role / skill', p.role], ['Page', p.page], ['Received', p.submittedAtLocal + ' (' + (process.env.FORM_TIMEZONE || 'America/New_York') + ')'],
  ].filter(([, v]) => v);
  const text = rows.map(([k, v]) => k + ': ' + v).join('\n') + '\n\nMessage:\n' + (p.message || '(none)') + '\n\n-- Sent by the CCAS Tech website. Reply to this email to answer the sender.';
  return postJson(process.env.RESEND_API_URL || 'https://api.resend.com/emails', {
    from: process.env.RESEND_FROM || 'CCAS Tech Website <onboarding@resend.dev>',
    to: [process.env.HR_EMAIL || 'hr@ccas-tech.com'],
    reply_to: p.email,
    subject: 'New website enquiry: ' + oneLine(p.type) + ' - ' + oneLine(p.name),
    text,
  }, { Authorization: 'Bearer ' + key });
}
