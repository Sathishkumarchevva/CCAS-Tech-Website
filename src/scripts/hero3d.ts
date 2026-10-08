// Hero artwork: the twin-arc mark surrounded by an orbiting "talent network".
// Ported from the approved prototype; three.js is bundled locally and loaded lazily.

import {
  AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, DoubleSide, ExtrudeGeometry, Group,
  LineBasicMaterial, LineSegments, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera,
  PMREMGenerator, PointLight, Points, PointsMaterial, RingGeometry, Scene, Shape, SphereGeometry, SRGBColorSpace,
  TorusGeometry, Vector3, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const host = document.querySelector<HTMLElement>('[data-hero3d]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

async function start(host: HTMLElement) {
  const canvas = host.querySelector<HTMLCanvasElement>('canvas')!;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch { return; } // no WebGL → static fallback image stays visible
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new AmbientLight(0xffffff, 0.35));
  const key = new DirectionalLight(0xffffff, 1.6); key.position.set(2, 3, 4); scene.add(key);
  const rim = new PointLight(0xff7a1a, 8, 8); rim.position.set(1.6, 0.2, 1.2); scene.add(rim);

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);

  const porcelain = new MeshStandardMaterial({ color: 0xf5f6f8, roughness: 0.32, metalness: 0.05 });
  const sunset = new MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.28, metalness: 0.1, emissive: 0xff5a00, emissiveIntensity: 0.18 });

  function arc(rOuter: number, rInner: number, gapDeg: number, depth: number) {
    const g = MathUtils.degToRad(gapDeg) / 2;
    const s = new Shape();
    s.absarc(0, 0, rOuter, g, Math.PI * 2 - g, false);
    s.absarc(0, 0, rInner, Math.PI * 2 - g, g, true);
    s.closePath();
    const geo = new ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 6, curveSegments: 96 });
    geo.translate(0, 0, -depth / 2);
    return new Mesh(geo, porcelain);
  }

  const model = new Group();
  scene.add(model);
  const mark = new Group();
  const outerArc = arc(0.5, 0.36, 78, 0.12);
  const innerArc = arc(0.27, 0.17, 96, 0.1);
  const dot = new Mesh(new SphereGeometry(0.065, 48, 32), sunset);
  dot.position.set(0.4, 0, 0);
  mark.add(outerArc, innerArc, dot);
  model.add(mark);

  const orbitMat = new MeshStandardMaterial({ color: 0x3a5a94, roughness: 0.6, metalness: 0.1 });
  const defs = [
    { r: 0.72, tilt: [1.25, 0, 0.35], speed: 0.35, nodes: 4 },
    { r: 0.86, tilt: [1.05, 0, -0.6], speed: -0.25, nodes: 5 },
    { r: 1.0, tilt: [1.45, 0, 0.05], speed: 0.18, nodes: 6 },
  ];
  const orbits = defs.map((d, i) => {
    const g = new Group();
    g.rotation.set(d.tilt[0], d.tilt[1], d.tilt[2]);
    g.add(new Mesh(new TorusGeometry(d.r, 0.0035, 8, 192), orbitMat));
    const nodes: Mesh[] = [];
    for (let k = 0; k < d.nodes; k++) {
      const accent = (k + i) % 3 === 0;
      const n = new Mesh(new SphereGeometry(accent ? 0.038 : 0.028, 32, 20), accent ? sunset : porcelain);
      n.userData.a = (k / d.nodes) * Math.PI * 2;
      g.add(n); nodes.push(n);
    }
    model.add(g);
    return { g, d, nodes };
  });

  // FX: connecting beams, travelling packets, distant stars, pulse halo
  const allNodes = orbits.flatMap((o) => o.nodes);
  const center = new Vector3();
  const beamPos = new Float32Array(allNodes.length * 6);
  const beamGeo = new BufferGeometry();
  beamGeo.setAttribute('position', new BufferAttribute(beamPos, 3));
  const beamMat = new LineBasicMaterial({ color: 0x6f93d6, transparent: true, opacity: 0 });
  model.add(new LineSegments(beamGeo, beamMat));
  const packetMat = new MeshBasicMaterial({ color: 0xff9a4d });
  const packets = Array.from({ length: 7 }, (_, i) => {
    const m = new Mesh(new SphereGeometry(0.014, 16, 12), packetMat);
    m.userData = { node: i % allNodes.length, p: -i * 0.35, speed: 0.45 + Math.random() * 0.3 };
    scene.add(m); return m;
  });
  const halo = new Mesh(new RingGeometry(0.52, 0.535, 128), new MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0, side: DoubleSide, blending: AdditiveBlending, depthWrite: false }));
  scene.add(halo);

  function fit() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, w < 600 ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const extent = 1.18; // orbit radius + node + breathing room
    const d = extent / Math.tan(MathUtils.degToRad(camera.fov / 2)) / Math.min(1, camera.aspect);
    camera.position.set(0, 0, d); camera.lookAt(0, 0, 0);
  }
  fit();
  new ResizeObserver(fit).observe(host);

  let px = 0, py = 0, tx = 0, ty = 0;
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      tx = MathUtils.clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1.2, 1.2);
      ty = MathUtils.clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1.2, 1.2);
    }, { passive: true });
  }

  const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4);
  const wp = new Vector3();
  let pulse = 0, lastPulse = -9, visible = true, raf = 0;
  const t0 = performance.now();
  let revealed = false;

  function render(now: number) {
    // Reduced motion: hold the final composed frame (t = 6s) instead of animating.
    const t = reduce ? 6 : (now - t0) / 1000;
    const a = ease(t / 1.6), b = ease((t - 0.25) / 1.6), c = ease((t - 1.1) / 0.6), o = ease((t - 0.6) / 1.8);
    outerArc.rotation.z = (1 - a) * -Math.PI * 1.5;
    innerArc.rotation.z = (1 - b) * Math.PI * 1.5;
    outerArc.scale.setScalar(0.4 + 0.6 * a);
    innerArc.scale.setScalar(0.4 + 0.6 * b);
    dot.scale.setScalar(Math.max(c * (1 + Math.sin(t * 2.8) * 0.08 + pulse * 0.2), 0.001));
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    mark.rotation.y = 0.67 + Math.sin(t * 0.5) * 0.2 + px * 0.5;
    mark.rotation.x = py * 0.3;
    mark.position.y = Math.sin(t * 1.4) * 0.025;
    orbits.forEach(({ g, d, nodes }) => {
      g.scale.setScalar(0.2 + 0.8 * o);
      nodes.forEach((n) => {
        const ang = n.userData.a + t * d.speed;
        n.position.set(Math.cos(ang) * d.r, Math.sin(ang) * d.r, 0);
      });
    });
    model.updateMatrixWorld(true);
    allNodes.forEach((n, i) => { n.getWorldPosition(wp); beamPos.set([wp.x, wp.y, wp.z, 0, 0, 0], i * 6); });
    // beams live in model space (identity transform), so world positions are correct
    beamGeo.attributes.position.needsUpdate = true;
    beamMat.opacity = o * (0.14 + Math.sin(t * 1.7) * 0.06);
    if (t > 2.2 && !reduce) {
      packets.forEach((m) => {
        const u = m.userData;
        u.p += 0.016 * u.speed;
        if (u.p >= 1) { u.p = 0; u.node = Math.floor(Math.random() * allNodes.length); if (t - lastPulse > 1.4) { pulse = 1; lastPulse = t; } }
        allNodes[u.node].getWorldPosition(wp);
        m.visible = u.p >= 0;
        m.position.lerpVectors(wp, center, u.p < 0 ? 0 : u.p * u.p);
      });
    } else packets.forEach((m) => (m.visible = false));
    pulse *= 0.95;
    halo.quaternion.copy(camera.quaternion);
    halo.scale.setScalar(1 + (1 - pulse) * 0.7);
    (halo.material as MeshBasicMaterial).opacity = pulse * 0.25;

    renderer.render(scene, camera);
    if (!revealed) { revealed = true; host.classList.add('is-ready'); }
  }

  function loop(now: number) {
    raf = 0;
    if (!visible || document.hidden) return;
    render(now);
    raf = requestAnimationFrame(loop);
  }
  const wake = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(host);
  document.addEventListener('visibilitychange', wake);
  if (reduce) render(performance.now()); else wake();
}

if (host) {
  const go = () => start(host);
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 200);
}
