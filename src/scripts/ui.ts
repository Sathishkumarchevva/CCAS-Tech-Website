// Interaction layer: menu, reveals, split headlines, count-up, spotlight, parallax, scroll progress, filters, scrubbed text.
// All decorative; content is fully readable if this never runs.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

/* ---------- Mobile menu ---------- */
const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const panel = document.querySelector<HTMLElement>('[data-mobile-nav]');
function setMenu(open: boolean) {
  if (!btn || !panel) return;
  btn.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}
btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
});
panel?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
matchMedia('(min-width: 900px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

/* ---------- Word splitting (headlines + scrubbed statement) ---------- */
function wrapWords(el: HTMLElement, make: (word: string, i: number) => HTMLElement) {
  let i = 0;
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          frag.append(/^\s+$/.test(part) ? document.createTextNode(' ') : make(part, i++));
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    }
  };
  walk(el);
  return i;
}
$$('[data-split]').forEach((el) => {
  el.classList.add('split');
  wrapWords(el, (w, i) => {
    const outer = document.createElement('span'); outer.className = 'w';
    const inner = document.createElement('span'); inner.textContent = w;
    inner.style.setProperty('--i', String(i)); outer.append(inner); return outer;
  });
});
const scrubs = $$('[data-scrub]').map((el) => {
  el.classList.add('scrub');
  wrapWords(el, (w) => { const s = document.createElement('span'); s.className = 'sw'; s.textContent = w; return s; });
  return { el, words: [...el.querySelectorAll<HTMLElement>('.sw')], shown: 0 };
});

/* ---------- Reveal on scroll ---------- */
const targets = $$('.reveal, .split, [data-inview]');
if ('IntersectionObserver' in window && targets.length) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      // also reveal anything already scrolled past (anchor jumps, fast scrolling)
      if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
} else targets.forEach((el) => el.classList.add('is-in'));

/* ---------- Count-up numbers ---------- */
const counters = $$('[data-count]');
if (counters.length) {
  const run = (el: HTMLElement) => {
    const m = (el.dataset.count ?? '').match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[1]), suffix = m[2], dec = (m[1].split('.')[1] ?? '').length, t0 = performance.now(), dur = 1600;
    const tick = (now: number) => {
      const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = (end * e).toFixed(dec) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reduce || !('IntersectionObserver' in window)) counters.forEach((el) => (el.textContent = el.dataset.count ?? ''));
  else {
    const cio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { run(en.target as HTMLElement); cio.unobserve(en.target); } }), { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = '0' + ((el.dataset.count ?? '').replace(/^[\d.]+/, '')); cio.observe(el); });
  }
}

/* ---------- Pointer effects: card spotlight + hero glow ---------- */
if (matchMedia('(pointer: fine)').matches && !reduce) {
  document.addEventListener('pointermove', (e) => {
    const t = (e.target as HTMLElement).closest?.('.spot') as HTMLElement | null;
    if (t) { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', `${e.clientX - r.left}px`); t.style.setProperty('--my', `${e.clientY - r.top}px`); }
    const g = (e.target as HTMLElement).closest?.('[data-glow]') as HTMLElement | null;
    if (g) { const r = g.getBoundingClientRect(); g.style.setProperty('--gx', `${e.clientX - r.left}px`); g.style.setProperty('--gy', `${e.clientY - r.top}px`); }
  }, { passive: true });
}

/* ---------- Scroll-driven: progress bar, parallax, scrubbed text ---------- */
const bar = document.querySelector<HTMLElement>('[data-progress]');
const par = $$('[data-parallax]').map((el) => ({ el, k: parseFloat(el.dataset.parallax || '0.08'), zoom: parseFloat(el.dataset.zoom || '1'), on: false }));
if ('IntersectionObserver' in window) {
  const pio = new IntersectionObserver((es) => es.forEach((en) => { const p = par.find((x) => x.el === en.target); if (p) p.on = en.isIntersecting; }), { rootMargin: '20% 0px' });
  par.forEach((p) => pio.observe(p.el));
} else par.forEach((p) => (p.on = true));

let ticking = false;
function onScroll() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar?.style.setProperty('--p', String(max > 0 ? clamp(scrollY / max) : 0));
  if (!reduce) for (const p of par) {
    if (!p.on) continue;
    const r = p.el.getBoundingClientRect();
    p.el.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * -p.k).toFixed(1)}px`);
    if (p.zoom !== 1) p.el.style.setProperty('--ps', String(p.zoom));
  }
  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    const prog = reduce ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    const n = Math.round(prog * s.words.length);
    if (n === s.shown) continue;
    s.words.forEach((w, i) => w.classList.toggle('on', i < n));
    s.shown = n;
  }
}
const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
addEventListener('scroll', req, { passive: true });
addEventListener('resize', req);
onScroll();

/* ---------- Services filter ---------- */
const chips = $$<HTMLButtonElement>('[data-filter]');
const items = $$('[data-group]');
if (chips.length) {
  const apply = (g: string) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === g)));
    items.forEach((it) => {
      const show = g === 'all' || it.dataset.group === g;
      it.hidden = !show;
      if (show) { it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); }
    });
    const c = document.querySelector('[data-count-out]'); if (c) c.textContent = String(items.filter((i) => !i.hidden).length);
  };
  chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.filter ?? 'all')));
  // deep links like /services/#devops-engineer must never land on a filtered-out card
  if (location.hash && document.querySelector(location.hash)) apply('all');
}
