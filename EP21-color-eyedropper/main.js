// Starter: elements and helpers.
const canvas =
  document.querySelector("canvas");
const $ = (s) =>
  document.querySelector(s);
let current = "";

// Original generative artwork.
function paint(ctx) {
  const sky = ctx
    .createLinearGradient(
      0, 0, 0, 400);
  sky.addColorStop(0, "#1b1446");
  sky.addColorStop(1, "#f25f5c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 460, 400);
  const blobs = [
    [120, 130, 120, "#ff4f7b"],
    [320, 120, 130, "#ffc145"],
    [210, 290, 140, "#2ec4b6"],
    [390, 320, 100, "#7b61ff"],
  ];
  for (const [x, y, r, c] of blobs) {
    const g = ctx
      .createRadialGradient(
        x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(0.6, c + "cc");
    g.addColorStop(1, c + "00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 460, 400);
  }
}

function show(hex, rgb) {
  current = hex;
  $(".swatch").style.background =
    hex;
  $(".loupe").style.background = hex;
  $(".hex").textContent = hex;
  $(".rgb").textContent = rgb;
}

function moveLoupe(x, y) {
  const loupe = $(".loupe");
  loupe.style.opacity = 1;
  loupe.style.translate =
    `${x}px ${y}px`;
}

function flash(text) {
  const hint = $(".hint");
  hint.textContent = text;
  hint.classList.add("done");
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => {
    hint.textContent =
      "Click to copy";
    hint.classList.remove("done");
  }, 1600);
}

// A 2D context we can read from
const ctx = canvas.getContext("2d",
  { willReadFrequently: true });
paint(ctx);

// Read one pixel, as hex
function pick(x, y) {
  const [r, g, b] = ctx
    .getImageData(x, y, 1, 1).data;
  const hex = "#" + [r, g, b]
    .map((v) => v.toString(16)
      .padStart(2, "0")).join("");
  show(hex, `rgb(${r}, ${g}, ${b})`);
}

// Pointer position to pixels
canvas.onpointermove = (e) => {
  const box =
    canvas.getBoundingClientRect();
  const x = (e.clientX - box.left)
    * (canvas.width / box.width);
  const y = (e.clientY - box.top)
    * (canvas.height / box.height);
  moveLoupe(e.clientX, e.clientY);
  pick(Math.floor(x), Math.floor(y));
};

// Click: copy the hex value
canvas.onclick = async () => {
  try {
    await navigator.clipboard
      .writeText(current);
    flash(`Copied ${current}`);
  } catch {
    flash("Copy blocked");
  }
};
