const START_HASH = location.hash.slice(1);
const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const ARRANGE = LOCAL && new URLSearchParams(location.search).has("arrange");
const countOf = (n) =>
  n.children ? n.children.length + (n.children.length === 1 ? " collection" : " collections") : n.photos.length + " photos";
// groups say how many collections they hold; albums are just their title
const kickerOf = (n) => (n.children ? countOf(n) : "");

// ── the room: one area per top-level media folder, then contact ─────
const AREAS = [
  ...MEDIA.map((node) => ({ id: node.id, label: node.title, node })),
  // contact has no clouds: its form is a flat layer (#contact) that follows the rotation
  { id: "contact", type: "contact", label: "Contact", room: [] },
];
const CONTACT = AREAS.findIndex((a) => a.type === "contact");
const contact = document.getElementById("contact");

// fallback collage layouts, used for clouds clouds.config.js doesn't
// place: centre x/y in %, width in % of the panel, z = px towards the
// viewer (parallax while turning). the smaller clouds overlap the hero's
// soft edge so they melt into it
const LAYOUTS = {
  1: [{ x: 58, y: 48, w: 56 }],
  2: [
    { x: 54, y: 52, w: 50 },
    { x: 72, y: 36, w: 28, z: 60 },
  ],
  3: [
    { x: 57, y: 52, w: 48 },
    { x: 74, y: 35, w: 26, z: 60 },
    { x: 40, y: 64, w: 24, z: 40 },
  ],
  4: [
    { x: 56, y: 50, w: 44 },
    { x: 73, y: 34, w: 24, z: 60 },
    { x: 40, y: 64, w: 22, z: 40 },
    { x: 72, y: 66, w: 21, z: 80 },
  ],
};

// pick the mask from the photo's shape once it has loaded
function fitMask(img, onShape) {
  const apply = () => {
    const portrait = img.naturalHeight > img.naturalWidth * 1.05;
    // set on the container so the colour photo and its grey copy share it
    img.parentNode.style.setProperty("--mask", `url(/assets/masks/${portrait ? "tall" : "land"}.png)`);
    onShape && onShape(portrait);
  };
  img.complete && img.naturalWidth ? apply() : img.addEventListener("load", apply, { once: true });
}

const N = AREAS.length;
const STEP = 360 / N;
const stage = document.getElementById("stage");
const ring = document.getElementById("ring");
let W, R;

const panels = AREAS.map((a, i) => {
  const el = document.createElement("section");
  el.className = "area";
  if (a.type === "contact") {
    // empty wall: the form is the flat #contact layer
  } else {
    el.innerHTML = `
      <div class="caption" style="left:8%;top:18%">
        ${a.node.children ? `<div class="k">${kickerOf(a.node)}</div>` : ""}
        <h2>${a.label}</h2>
        <span class="open">Open<i></i></span>
      </div>`;
  }
  // the clouds live on a fixed-shape canvas that scales with the window as one
  // piece, so an arrangement looks the same at any window size
  el.insertAdjacentHTML("afterbegin", `<div class="frame"></div>`);
  a.shots = [];
  ring.appendChild(el);
  return el;
});

// ── clouds: desktop and mobile each have their own set ─────────────
const MOBILE_BELOW = 700; // px of window width; upright windows (tablets) use mobile too
// shape of that canvas (width / height); clouds.config.js x, y and size are % of it
const FRAME = { desktop: 16 / 9, mobile: 9 / 16 };
// window width the depth values were made for; depth scales from there, so
// the parallax looks the same at any size
const DEPTH_AT = { desktop: 1400, mobile: 390 };
let frame = { w: 0, h: 0 }; // its current size in px
let mode = null; // "desktop" | "mobile"

// fill in positions clouds.config.js leaves out
const withLayout = (room) =>
  room.map((c, k) => {
    const auto = LAYOUTS[Math.min(room.length, 4)][k] || { x: 30 + ((k * 23) % 50), y: 35 + ((k * 17) % 35), w: 18, z: 30 };
    return { ...c, x: c.x ?? auto.x, y: c.y ?? auto.y, w: c.w ?? auto.w, z: c.z ?? auto.z ?? 0 };
  });

function roomFor(a) {
  const node = a.node || a;
  if (mode === "desktop") return withLayout(node.room);
  if (node.roomMobile) return withLayout(node.roomMobile);
  // no mobile set yet: derive one from desktop, pulled to the centre and bigger
  return withLayout(node.room).map((c) => ({ ...c, x: 50 + (c.x - 50) * 0.45, y: 50 + (c.y - 50) * 0.8 + 6, w: Math.min(c.w * 1.7, 96) }));
}

function buildShots(i) {
  const a = AREAS[i];
  a.shots.forEach((s) => s.el.remove());
  a.shots = roomFor(a).map((c, k) => {
    const d = document.createElement("div");
    d.className = "shot" + (k === 0 ? " hero" : "");
    d.innerHTML = `<img src="${c.src}" alt="" draggable="false" /><img class="mono" src="${c.src}" alt="" draggable="false" />`;
    const s = { ...c, el: d, portrait: false };
    fitMask(d.firstChild, (p) => {
      s.portrait = p;
      placeShot(s);
    });
    panels[i].querySelector(".frame").appendChild(d);
    placeShot(s);
    return s;
  });
}

function placeShot(s) {
  // portrait photos are drawn narrower than landscape ones of the same size
  s.el.style.left = s.x + "%";
  s.el.style.top = s.y + "%";
  s.el.style.width = s.w * (s.portrait ? 0.55 : 1) + "%";
  s.el.style.transform = `translate(-50%, -50%) translateZ(${((s.z || 0) * W) / DEPTH_AT[mode]}px)`;
}

function layout() {
  W = innerWidth;
  // radius so exactly one panel fills the screen width
  R = W / 2 / Math.tan(((STEP / 2) * Math.PI) / 180);
  stage.style.perspective = R + "px";
  panels.forEach((p, i) => {
    p.style.width = W + "px";
    p.style.marginLeft = -W / 2 + "px";
    // negative so that "next" sits to the right
    p.style.transform = `rotateY(${-i * STEP}deg) translateZ(${-R}px)`;
  });
  const H = stage.clientHeight;
  const m = W < MOBILE_BELOW || W / H < 0.8 ? "mobile" : "desktop";
  // as big as fits on screen, centred
  const fw = Math.min(W, H * FRAME[m]);
  frame = { w: fw, h: fw / FRAME[m] };
  panels.forEach((p) => {
    const f = p.querySelector(".frame").style;
    f.width = frame.w + "px";
    f.height = frame.h + "px";
    f.left = (W - frame.w) / 2 + "px";
    f.top = (H - frame.h) / 2 + "px";
  });
  if (m !== mode) {
    mode = m;
    AREAS.forEach((_, i) => buildShots(i));
  } else AREAS.forEach((a) => a.shots.forEach(placeShot)); // depth follows the width
}

// ── camera: angle eases towards target, plus a little look-around ─
const dots = document.getElementById("dots");
AREAS.forEach((a, i) => {
  const b = document.createElement("button");
  b.title = a.label;
  b.onclick = () => go(i);
  dots.appendChild(b);
});

let angle = 0,
  target = 0,
  look = { x: 0, y: 0 },
  lookT = { x: 0, y: 0 },
  dolly = 0,
  dollyT = 0,
  pendingEnter = null,
  current = -1,
  moved = false,
  drag = null,
  vel = 0;

// where we are: [] = the room, [area] = inside an area, [area, child] = album inside a group
let path = [];
const busy = () => path.length > 0 || transitioning;
let transitioning = false;

const mod = (n, m) => ((n % m) + m) % m;
const nearest = (a) => Math.round(a / STEP);

function go(i) {
  if (busy()) return;
  let d = mod(i - nearest(angle), N);
  if (d > N / 2) d -= N;
  target = (nearest(angle) + d) * STEP;
}
const turn = (d) => !busy() && (target = (nearest(target) + d) * STEP);

function setHash() {
  const ids = [AREAS[current].id, ...path.slice(1).map((n) => n.id)];
  history.replaceState(null, "", "#" + ids.join("/") + (path.length === 1 ? "/open" : ""));
}

function updateActive() {
  const idx = mod(nearest(angle), N);
  if (idx === current) return;
  current = idx;
  panels.forEach((p, i) => p.classList.toggle("active", i === idx));
  document.getElementById("prev-name").textContent = AREAS[mod(idx - 1, N)].label;
  document.getElementById("next-name").textContent = AREAS[mod(idx + 1, N)].label;
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === idx));
  if (!busy()) setHash();
  // facing an area for a moment: start loading what's behind it
  setTimeout(() => current === idx && AREAS[idx].node && ready(firstImages(AREAS[idx].node)), 300);
}

(function tick() {
  if (!drag) {
    angle += (target - angle) * 0.075;
    if (Math.abs(target - angle) < 0.01) angle = target;
  }
  look.x += (lookT.x - look.x) * 0.05;
  look.y += (lookT.y - look.y) * 0.05;
  dolly += (dollyT - dolly) * 0.06;
  if (pendingEnter !== null && Math.abs(target - angle) < STEP * 0.15) {
    const i = pendingEnter;
    pendingEnter = null;
    if (mod(nearest(angle), N) === i) enter(i);
  }
  ring.style.transform = `translateZ(${R + dolly}px) rotateX(${look.y}deg) rotateY(${angle + look.x}deg)`;
  placeContact();
  updateActive();
  requestAnimationFrame(tick);
})();

// which photo (or title) of area i is at this screen point? uses the
// projected box of each photo, shrunk to an ellipse ≈ the visible mask
const inside = (el, x, y, pad = 0) => {
  const r = el.getBoundingClientRect();
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
};
function hitShot(i, x, y) {
  const panel = panels[i];
  for (const img of panel.querySelectorAll(".shot img:not(.mono)")) {
    const r = img.getBoundingClientRect();
    const dx = (x - (r.left + r.width / 2)) / (r.width * 0.42);
    const dy = (y - (r.top + r.height / 2)) / (r.height * 0.42);
    if (dx * dx + dy * dy <= 1) return img.parentNode;
  }
  // the whole title block counts, padded: it drifts a little with the mouse look-around
  for (const t of panel.querySelectorAll(".caption")) if (inside(t, x, y, 16)) return t;
  return null;
}

let hovered = null;
function setHover(el) {
  if (el === hovered) return;
  hovered?.classList.remove("hover");
  hovered = el;
  hovered?.classList.add("hover");
  stage.classList.toggle("can-enter", !!el);
}

stage.addEventListener("click", (e) => {
  if (moved || busy()) return;
  // mid-turn, both the leaving and the arriving area count
  const dest = mod(nearest(target), N);
  const hit = [current, dest].find((i) => hitShot(i, e.clientX, e.clientY));
  if (hit !== undefined) enter(hit);
});

// drag / swipe: one screen width of drag = one area
const DEAD_ZONE = 10; // px a press may wobble (trackpads) and still count as a click
stage.addEventListener("pointerdown", (e) => {
  if (busy()) return;
  drag = { x: e.clientX, sx: e.clientX, t: performance.now() };
  moved = false;
  vel = 0;
  stage.classList.add("dragging");
});
addEventListener("pointermove", (e) => {
  // no look-around while arranging, so positions stay exact
  if (!busy() && !ARRANGE && matchMedia("(pointer: fine)").matches) {
    lookT.x = (e.clientX / innerWidth - 0.5) * 4;
    lookT.y = (e.clientY / innerHeight - 0.5) * 3;
  }
  if (!drag) {
    setHover(busy() ? null : hitShot(current, e.clientX, e.clientY));
    return;
  }
  if (!moved && Math.abs(e.clientX - drag.sx) < DEAD_ZONE) return;
  moved = true;
  setHover(null);
  const now = performance.now();
  const da = (-(e.clientX - drag.x) / W) * STEP;
  angle += da;
  vel = da / Math.max(1, now - drag.t);
  drag.x = e.clientX;
  drag.t = now;
});
addEventListener("pointerup", () => {
  if (!drag) return;
  drag = null;
  stage.classList.remove("dragging");
  // a flick carries into the next area; a plain click mustn't cancel a turn
  if (moved) target = nearest(angle + vel * 220) * STEP;
});

// trackpad / wheel: accumulate then snap
let wheelTimer;
stage.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (busy()) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    target += (d / W) * STEP * 1.2;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => (target = nearest(target) * STEP), 140);
  },
  { passive: false }
);

// arrange mode (?arrange) is a local-only tool in tools/arrange.js; it's
// never deployed (.vercelignore), so only load it on this machine
if (ARRANGE) {
  const tool = document.createElement("script");
  tool.src = "/tools/arrange.js";
  document.body.appendChild(tool);
}

// ── contact ───────────────────────────────────────────────────────
// slide sideways and fade with the room, as if it were on the wall
function placeContact() {
  const off = ((((angle + look.x - CONTACT * STEP) % 360) + 540) % 360) - 180; // degrees away from facing it
  const f = off / STEP; // in panels: 0 = facing, ±1 = a neighbour
  const live = Math.abs(f) < 0.2 && !busy();
  // fully solid while facing it (the mouse look-around shifts f a little)
  contact.style.opacity = Math.min(1, Math.max(0, 1.12 - Math.abs(f) * 1.8));
  contact.style.transform = `translate(calc(-50% - ${f * W * 0.9}px), var(--ty, -50%))`;
  contact.classList.toggle("live", live);
}

document.getElementById("prev").onclick = () => turn(-1);
document.getElementById("next").onclick = () => turn(1);
addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea")) return; // typing in the contact field
  if (zoom.classList.contains("open")) return e.key === "Escape" && zoom.classList.remove("open");
  if (e.key === "ArrowLeft") turn(-1);
  if (e.key === "ArrowRight") turn(1);
  if (e.key === "Enter" && !busy()) enter(current);
  if (e.key === "Escape") back();
});

// ── moving between layers ─────────────────────────────────────────
// every step: zoom through the cloud → white veil → swap → veil lifts
const sub = document.getElementById("sub");
const cloudsEl = document.getElementById("clouds");
const sheet = document.getElementById("sheet");
const veil = document.getElementById("veil");
const backBtn = document.getElementById("back");
const zoom = document.getElementById("zoom");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// load + decode images ahead of time, so a layer can appear fully formed
const preloaded = new Map();
function preload(url) {
  if (!preloaded.has(url)) {
    const im = new Image();
    im.src = url;
    preloaded.set(url, im.decode().catch(() => {}));
  }
  return preloaded.get(url);
}
// ...but never keep people waiting on a slow connection
const ready = (urls, ms = 1500) => Promise.race([Promise.all(urls.map(preload)), wait(ms)]);
// the images a node shows first: its albums' covers for a group, the top of the feed for an album
const firstImages = (node) => (node.children ? node.children.map((c) => c.cover) : node.photos.slice(0, 2));

async function swap(fn) {
  veil.classList.add("on");
  await wait(480);
  await fn();
  await wait(40); // let the new layer paint under the veil
  veil.classList.remove("on");
}

function chrome() {
  document.body.classList.toggle("deep", path.length > 0);
  backBtn.textContent = path.length === 2 ? "← Back" : "← Overview";
  ["prev", "next", "dots"].forEach((id) => (document.getElementById(id).style.visibility = path.length ? "hidden" : ""));
  setHash();
}

async function enter(i) {
  if (transitioning) return;
  const a = AREAS[i];
  const dest = mod(nearest(target), N);
  // mid-turn, a click means "step into where I'm turning to" once it arrives
  if (Math.abs(target - angle) > STEP * 0.15) {
    pendingEnter = dest;
    return;
  }
  if (i !== current) return go(i);
  if (a.type === "contact") return; // nothing to step into
  transitioning = true;
  const loading = a.node && ready(firstImages(a.node));
  lookT = { x: 0, y: 0 };
  panels[i].classList.add("entering");
  dollyT = R * 0.4;
  await wait(650);
  await swap(async () => {
    await loading;
    path = [a.node];
    a.node.children ? await showSub(a.node) : showSheet(a.node);
    chrome();
  });
  transitioning = false;
}

async function openChild(node, el) {
  if (transitioning) return;
  transitioning = true;
  const loading = ready(firstImages(node));
  sub.classList.add("leaving");
  el.classList.add("entering");
  await wait(650);
  await swap(async () => {
    await loading;
    path = [path[0], node];
    sub.classList.remove("open");
    showSheet(node);
    chrome();
  });
  transitioning = false;
}

async function back() {
  if (transitioning || !path.length) return;
  transitioning = true;
  await swap(() => {
    sheet.classList.remove("open");
    if (path.length === 2) {
      // album → group overview: the cloud shrinks back into place
      path = [path[0]];
      sub.classList.add("open");
      sub.classList.remove("leaving");
      cloudsEl.querySelector(".entering")?.classList.remove("entering");
    } else {
      // back into the room: the camera pulls out of the photo
      path = [];
      sub.classList.remove("open", "developed");
      panels.forEach((p) => p.classList.remove("entering"));
      dollyT = 0;
    }
    chrome();
  });
  transitioning = false;
}
backBtn.onclick = back;

// desktop: cap the clouds' height so a row of them, titles included, fits
// on screen under the heading (the CSS turns this into a width per photo)
function fitClouds() {
  if (!sub.classList.contains("open")) return;
  const top = cloudsEl.getBoundingClientRect().top + sub.scrollTop + parseFloat(getComputedStyle(cloudsEl).paddingTop);
  const stagger = cloudsEl.children.length > 1 ? innerHeight * 0.07 : 0; // every other cloud sits lower
  const caption = 90; // album title + count below the photo, and a little air
  cloudsEl.style.setProperty("--fit-h", Math.max(240, innerHeight - top - stagger - caption) + "px");

  // a capped cloud is narrower than its cell: pull it towards the middle of
  // the row by what it lost, so neighbours keep overlapping as at full size
  const clouds = [...cloudsEl.children];
  const desktop = !matchMedia("(max-width: 700px)").matches;
  const cols = Math.min(clouds.length, 4);
  const cs = getComputedStyle(cloudsEl);
  const cell = (cloudsEl.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / cols;
  clouds.forEach((c, k) => {
    const full = Math.min(cell * 1.3 * (parseFloat(c.style.getPropertyValue("--pw")) || 1), 620);
    const dir = Math.sign((cols - 1) / 2 - (k % cols)); // left half → right, right half → left
    c.style.translate = desktop ? `${(dir * Math.max(0, full - c.offsetWidth)) / 2}px 0` : "";
  });
}
addEventListener("resize", fitClouds);

async function showSub(node) {
  document.getElementById("sub-k").textContent = kickerOf(node);
  document.getElementById("sub-title").textContent = node.title;
  sub.classList.remove("developed", "leaving");
  sub.scrollTop = 0;
  cloudsEl.innerHTML = "";
  cloudsEl.style.setProperty("--cols", Math.min(node.children.length, 4));
  cloudsEl.classList.toggle("pairs", node.children.length > 2);
  cloudsEl.classList.toggle("one-row", node.children.length <= 4); // nothing to scroll to on desktop
  node.children.forEach((child, k) => {
    const f = document.createElement("figure");
    f.className = "cloud";
    f.innerHTML = `<img src="${child.cover}" alt="" draggable="false" />
      <figcaption><b>${child.title}</b><span>${countOf(child)}</span></figcaption>`;
    f.onclick = () => openChild(child, f);
    // warm up the album while the pointer rests on its cloud
    f.onpointerenter = () => ready(firstImages(child));
    cloudsEl.appendChild(f);
  });
  // decide every mask and size before anything is shown, so nothing jumps
  const imgs = [...cloudsEl.querySelectorAll("img")];
  await Promise.race([Promise.all(imgs.map((im) => im.decode().catch(() => {}))), wait(1500)]);
  imgs.forEach((im) => {
    fitMask(im, (portrait) => portrait && im.parentNode.style.setProperty("--pw", 0.7));
    if (im.naturalWidth) im.parentNode.style.setProperty("--ar", im.naturalWidth / im.naturalHeight);
  });
  sub.classList.add("open");
  fitClouds();
  // develop the clouds once the veil starts lifting
  setTimeout(() => sub.classList.add("developed"), 120);
}

// ── the album page ────────────────────────────────────────────────
const sheetBody = document.getElementById("sheet-body");
// a photo fades in once it's both scrolled into view and loaded
const reveal = (fig) => fig.seen && fig.loaded && fig.classList.add("in");
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.seen = true;
      reveal(e.target);
    }),
  { root: sheet, threshold: 0.05 }
);
// photobook rhythm, as in the old darkroom: blocks of 1–3 photos, repeating,
// each nudged sideways a little so the edges don't line up
const BLOCKS = {
  desktop: ["hero", "duo-offset", "solo-left", "trio", "solo-right", "duo-even"],
  mobile: ["duo-even", "solo-left", "duo-offset", "solo-right"],
};
const PER_BLOCK = { hero: 1, "duo-offset": 2, "solo-left": 1, trio: 3, "solo-right": 1, "duo-even": 2 };
const SHIFTS = [0, 44, -36, 28, -52, 18, 40, -28, 56, -40, 24, -48]; // px

function showSheet(node) {
  // an album inside a group names its group; a top-level album is just its title
  document.getElementById("sheet-k").textContent = path.length === 2 ? path[0].title : "";
  document.getElementById("sheet-title").textContent = node.title;
  sheetBody.innerHTML = "";
  const feed = document.createElement("div");
  feed.className = "feed";
  const types = BLOCKS[mode];
  let block, room = 0;
  node.photos.forEach((p, i) => {
    if (!room) {
      const left = node.photos.length - i;
      let type = types[feed.children.length % types.length];
      // too few photos left for this block: fall back to one that fits
      if (PER_BLOCK[type] > left) type = left === 1 ? "solo-left" : "duo-even";
      block = document.createElement("div");
      block.className = "blk " + type;
      block.style.setProperty("--shift", SHIFTS[feed.children.length % SHIFTS.length] + "px");
      feed.appendChild(block);
      room = PER_BLOCK[type];
    }
    const fig = document.createElement("figure");
    fig.style.transitionDelay = (PER_BLOCK[block.classList[1]] - room) * 0.09 + "s";
    room--;
    fig.innerHTML = `<img loading="lazy" decoding="async" src="${p}" alt="" />`;
    const img = fig.querySelector("img");
    const loaded = () => {
      fig.loaded = true;
      reveal(fig);
    };
    img.complete ? loaded() : img.addEventListener("load", loaded, { once: true });
    img.addEventListener("error", loaded, { once: true });
    img.onclick = () => {
      zoom.querySelector("img").src = p;
      zoom.classList.add("open");
    };
    block.appendChild(fig);
    io.observe(fig);
  });
  sheetBody.appendChild(feed);
  sheet.classList.add("open");
  sheet.scrollTop = 0;
}
zoom.onclick = () => zoom.classList.remove("open");

// ── start ─────────────────────────────────────────────────────────
layout();
addEventListener("resize", layout);
// #outdoors faces that area, #outdoors/open walks in, #outdoors/mountains opens that album
const [startId, startChild] = START_HASH.split("/");
const start = AREAS.findIndex((a) => a.id === startId);
angle = target = Math.max(start, 0) * STEP;
if (start >= 0 && startChild) {
  setTimeout(async () => {
    await enter(start);
    const node = AREAS[start].node;
    const k = node?.children?.findIndex((c) => c.id === startChild) ?? -1;
    if (k >= 0) await openChild(node.children[k], cloudsEl.children[k]);
  }, 900);
} else if (start < 0) {
  // tiny peek to the right on first load, so people see it turns
  setTimeout(() => (target = STEP * 0.18), 900);
  setTimeout(() => (target = 0), 1700);
}
