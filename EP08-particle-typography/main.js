// Reduced motion: no scattering.
const calm = matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Canvas sized for sharp pixels.
const canvas =
  document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = devicePixelRatio || 1;
const W = innerWidth;
const H = innerHeight;
canvas.width = W * dpr;
canvas.height = H * dpr;
ctx.scale(dpr, dpr);

// Gradient: purple, cyan, yellow.
const STOPS = [
  [155, 92, 255],
  [0, 217, 255],
  [255, 196, 0],
];
function mix(x) {
  const tw = ctx.measureText(
    "DESIGN&CODE").width;
  let t = (x - (W - tw) / 2) / tw;
  t = Math.min(Math.max(t, 0), 1);
  const i = Math.min(1, t * 2 | 0);
  const f = t * 2 - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const c = a.map((v, j) =>
    Math.round(v + (b[j] - v) * f));
  return `rgb(${c})`;
}

ctx.fillStyle = "#fff";
ctx.font = "800 88px system-ui";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("DESIGN&CODE",
  W / 2, H / 2);

const cw = canvas.width;
const ch = canvas.height;
const { data } =
  ctx.getImageData(0, 0, cw, ch);
const particles = [];
const s = Math.round(4 * dpr);

for (let y = 0; y < ch; y += s) {
  for (let x = 0; x < cw; x += s) {
    const i = (y * cw + x) * 4;
    if (data[i + 3] < 128) continue;
    const hx = x / dpr;
    const hy = y / dpr;
    particles.push({
      x: hx, y: hy, hx, hy,
      vx: 0, vy: 0,
      c: mix(hx),
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d < 110 && !calm) {
      const f = (110 - d) / 110 * 4;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
    }
    p.vx += (p.hx - p.x) * 0.06;
    p.vy += (p.hy - p.y) * 0.06;
    p.vx *= 0.86;
    p.vy *= 0.86;
    p.x += p.vx;
    p.y += p.vy;
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x, p.y, 3.2, 3.2);
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

const mouse = { x: -1e4, y: -1e4 };

onpointermove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

document.documentElement
  .onpointerleave = () => {
    mouse.x = mouse.y = -1e4;
  };
