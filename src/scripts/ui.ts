// Mobile menu, scroll reveal.

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

// Reveal on scroll
const items = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && items.length) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      // also reveal anything we've already scrolled past (anchor jumps, fast scrolling)
      if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-in'));
}
