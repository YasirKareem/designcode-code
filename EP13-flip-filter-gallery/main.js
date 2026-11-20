// Starter: elements and settings.
const items =
  document.querySelectorAll("li");
const buttons = document
  .querySelectorAll("button");
const calm = matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function applyFilter(cat) {
  for (const item of items) {
    item.hidden = cat !== "all" &&
      !item.classList.contains(cat);
  }
}

function filterTo(cat) {
  const first = new Map();
  for (const el of items) {
    first.set(el,
      el.getBoundingClientRect());
  }
  applyFilter(cat);
  for (const el of items) {
    if (el.hidden) continue;
    const a = first.get(el);
    const b =
      el.getBoundingClientRect();
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    const move = `${dx}px ${dy}px`;
    el.animate(a.width
      ? [{ translate: move }, {}]
      : [{ opacity: 0, scale: 0.8 },
        {}],
      { duration: calm ? 0 : 600,
        easing: "ease-out" });
  }
}

for (const btn of buttons) {
  btn.onclick = () => {
    for (const b of buttons) {
      b.ariaPressed = b === btn;
    }
    filterTo(btn.value);
  };
}
