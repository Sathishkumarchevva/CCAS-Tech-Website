// Twinkling starfield + occasional shooting star. Runs only while visible; static when reduced motion is on.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d');
  if (!ctx) return;
  let W = 0, H = 0, stars: { x: number; y: number; z: number; r: number; tw: number; sp: number; warm: boolean }[] = [];
  let shoots: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
  let nextShoot = 2, visible = true, raf = 0, last = performance.now();

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = c.getBoundingClientRect();
    W = r.width; H = r.height;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(260, Math.round((W * H) / 3200));
    stars = Array.from({ length: n }, () => {
      const z = Math.random();
      return { x: Math.random() * W, y: Math.random() * H, z, r: 0.3 + z * 1.1, tw: Math.random() * 6.28, sp: 0.6 + Math.random() * 2, warm: Math.random() < 0.06 };
    });
    draw(performance.now());
  }

  function draw(now: number) {
    const t = now / 1000;
    ctx!.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx!.globalAlpha = (0.25 + s.z * 0.55) * (reduce ? 1 : 0.6 + 0.4 * Math.sin(t * s.sp + s.tw));
      ctx!.fillStyle = s.warm ? '#ffb27a' : '#dfe7f7';
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.r, 0, 6.283); ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  function frame(now: number) {
    raf = 0;
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    draw(now);
    nextShoot -= dt;
    if (nextShoot <= 0) {
      nextShoot = 3 + Math.random() * 5;
      const a = 0.35 + Math.random() * 0.35;
      shoots.push({ x: Math.random() * W * 0.8, y: Math.random() * H * 0.5, vx: Math.cos(a) * 900, vy: Math.sin(a) * 900, life: 0 });
    }
    shoots = shoots.filter((s) => s.life < 0.9);
    for (const s of shoots) {
      s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
      const k = 1 - s.life / 0.9, len = 0.12;
      const g = ctx!.createLinearGradient(s.x, s.y, s.x - s.vx * len, s.y - s.vy * len);
      g.addColorStop(0, `rgba(255,190,140,${k})`); g.addColorStop(1, 'rgba(255,190,140,0)');
      ctx!.strokeStyle = g; ctx!.lineWidth = 1.4;
      ctx!.beginPath(); ctx!.moveTo(s.x, s.y); ctx!.lineTo(s.x - s.vx * len, s.y - s.vy * len); ctx!.stroke();
    }
    raf = requestAnimationFrame(frame);
  }

  resize();
  new ResizeObserver(() => resize()).observe(c);
  if (reduce) return;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }).observe(c);
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-stars]').forEach(init);
