// Design&Code · Cinematic cards
const $ = (s) =>
  document.querySelector(s);
const hero = $(".hero");
const bg = $(".bg");
const list = $(".cards");
const info = $(".info");
const calm = matchMedia(
  "(prefers-reduced-motion:reduce)");
const rtl = document.dir === "rtl";
const EASE =
  "cubic-bezier(.7,0,.2,1)";

// The trips (English, then Arabic)
const DATA = [
  // file, EN name/land/text, AR,
  // then the photo credit
  ["dolomites", "Dolomites", "Italy",
    "Jagged peaks in fresh snow.",
    "الدولوميت", "إيطاليا",
    "قمم حادة تحت ثلج جديد.",
    "Wolfgang Moroder · " +
      "CC BY-SA 3.0"],
  ["kyoto", "Kyoto", "Japan",
    "Lantern-lit lanes at dawn.",
    "كيوتو", "اليابان",
    "أزقّة بالفوانيس عند الفجر.",
    "Basile Morin · CC BY-SA 4.0"],
  ["vestrahorn", "Vestrahorn",
    "Iceland",
    "Black sand mirrors the peaks.",
    "فيسترهورن", "آيسلندا",
    "رمال سوداء تعكس الجبال.",
    "Daniel Oberhaus · CC BY 4.0"],
  ["wadi-rum", "Wadi Rum", "Jordan",
    "Red sand and silent cliffs.",
    "وادي رم", "الأردن",
    "رمال حمراء ومنحدرات صامتة.",
    "E.3 · CC0"],
];
const trips = DATA.map((d) => ({
  img: `assets/images/${d[0]}.jpg`,
  name: d[rtl ? 4 : 1],
  land: d[rtl ? 5 : 2],
  text: d[rtl ? 6 : 3],
  credit: d[7],
}));

// One card per trip, built with the
// DOM (text is never parsed as HTML)
const make = (tag) =>
  document.createElement(tag);
const cards = trips.map((t, i) => {
  const li = make("li");
  const card = make("button");
  const img = new Image();
  const label = make("span");
  img.src = t.img;
  img.alt = "";
  label.textContent = t.name;
  card.className = "card";
  card.dataset.i = i;
  card.ariaLabel =
    `${t.name}, ${t.land}`;
  card.append(img, label);
  li.append(card);
  list?.append(li);
  return card;
});
if (bg) bg.src = trips[0].img;
// Words and progress for trip i
function paint(i) {
  const t = trips[i];
  $(".place").textContent =
    `0${i + 1} · ${t.land}`;
  $(".name").textContent = t.name;
  $(".text").textContent = t.text;
  document.body.style.setProperty(
    "--step", i);
  // the photo's author and licence
  const by = rtl ? "صورة" : "Photo";
  $(".credit").textContent =
    `${by}: ${t.credit}`;
}
// Labels for screen readers
if (info) {
  info.ariaLive = "polite";
  info.ariaAtomic = "true";
}
for (const [s, en, ar] of [
  [".prev", "Previous", "السابق"],
  [".next", "Next", "التالي"]]) {
  const b = $(s);
  if (b) b.ariaLabel = rtl ? ar : en;
}
// Wait for one photo, never forever;
// a failed one keeps the gradient
const loaded = (img) =>
  img.complete ||
  Promise.race([img.decode()
    .catch(() => {}), new Promise(
    (ok) => setTimeout(ok, 1500))]);
// One animation; less motion = 0 ms
const play = (el, to, ms, o) =>
  el.animate(to, {
    duration: calm.matches ? 0 : ms,
    easing: EASE,
    fill: "forwards", ...o });

// Arrow keys and swipes press the
// same buttons as the mouse
const press = (step) =>
  $(step > 0 ? ".next" : ".prev")
    ?.click();
addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey ||
    e.metaKey) return;
  const step = { ArrowRight: 1,
    ArrowLeft: -1 }[e.key];
  if (step) {
    press(rtl ? -step : step);
  }
});
let x0 = null;
hero?.addEventListener("pointerdown",
  (e) => { x0 = e.clientX; });
hero?.addEventListener(
  "pointercancel",
  () => { x0 = null; });
hero?.addEventListener("pointerup",
  (e) => {
    const dx =
      e.clientX - (x0 ?? e.clientX);
    x0 = null;
    if (Math.abs(dx) > 50) {
      press(rtl ? dx : -dx);
    }
  });

// 1. State: one trip, the rest wait
let current = 0;
const wrap = (i) => (i + 4) % 4;
function render() {
  paint(current);
  cards.forEach((c, i) => {
    c.parentNode.hidden =
      i === current;
  });
  for (let k = 1; k < 4; k++) {
    const i = wrap(current + k);
    list.append(cards[i].parentNode);
  }
}
render();

// 2. FLIP: card rectangle → hero
function grow(card) {
  const r =
    card.getBoundingClientRect();
  const fly = make("div");
  fly.className = "flyer";
  fly.append(
    card.firstChild.cloneNode());
  hero.append(fly);
  return play(fly, [{
    left: `${r.x}px`,
    top: `${r.y}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  }, { left: 0, top: 0,
    width: "100%", height: "100%",
    borderRadius: 0 }], 1000);
}
function slide(was) {
  cards.forEach((c, k) => {
    const now =
      c.getBoundingClientRect();
    if (!now.width) return;
    const dx = was[k].x - now.x;
    play(c, was[k].width
      ? { translate: [`${dx}px`, 0] }
      : { opacity: [0, 1] }, 900);
  });
}

// 3. Go: grow, swap the words, land
let busy = false;
async function go(i) {
  i = wrap(i);
  if (busy || i === current) return;
  busy = true;
  await loaded(cards[i].firstChild);
  const was = cards.map((c) =>
    c.getBoundingClientRect());
  const keys = list.contains(
    document.activeElement);
  const flight = grow(cards[i]);
  const fly = flight.effect.target;
  cards[i].style.visibility =
    "hidden";
  await play(info,
    { opacity: 0 }, 250).finished;
  current = i;
  render();
  slide(was);
  if (keys) $(".next").focus();
  play(info, { opacity: [0, 1],
    translate: ["0 22px", "0 0"] },
    700);
  await flight.finished
    .catch(() => {});
  bg.src = fly.firstChild.src;
  await loaded(bg);
  // one painted frame, then clean up
  await new Promise(
    requestAnimationFrame);
  cards[i].style.visibility = "";
  fly.remove();
  busy = false;
}
$(".next").onclick = () =>
  go(current + 1);
$(".prev").onclick = () =>
  go(current - 1);
list.onclick = (e) => {
  const c =
    e.target.closest(".card");
  if (c) go(Number(c.dataset.i));
};
