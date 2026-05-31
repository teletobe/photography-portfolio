// panorama viewer — depends on SECTIONS from sections.js

const ZOOM = 140; // image height as % of viewport

const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderSub = document.getElementById("loader-sub");
const pano = document.getElementById("pano");
const sectionInfo = document.getElementById("section-info");
const sectionDots = document.getElementById("section-dots");
const prevName = document.getElementById("prev-name");
const nextName = document.getElementById("next-name");

const N = SECTIONS.length;
let imgW,
  imgH,
  currentSection = 1,
  busy = false;
// accumulated px shift so wrap-around pans the right direction
let wrapOffset = 0;

// convert 0–1 image fractions to background-position px values
// that centre that point in the viewport
function posX(imgXFrac) {
  const rw = (imgW * ((window.innerHeight * ZOOM) / 100)) / imgH;
  return window.innerWidth / 2 - imgXFrac * rw + wrapOffset;
}
function posY(imgYFrac) {
  const rh = (window.innerHeight * ZOOM) / 100;
  return window.innerHeight / 2 - imgYFrac * rh;
}

// instant = skip CSS transition (used on resize and first load)
function applySection(s, instant) {
  if (instant) pano.classList.add("instant");
  pano.style.backgroundPositionX = posX(s.imgX ?? 0.5) + "px";
  pano.style.backgroundPositionY = posY(s.imgY ?? 0.5) + "px";
  pano.style.transform = `scale(${s.scale || 1})`;
  if (instant) requestAnimationFrame(() => pano.classList.remove("instant"));
}

// build nav dots
SECTIONS.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "dot" + (i === currentSection ? " active" : "");
  sectionDots.appendChild(d);
});

function updateUI() {
  const s = SECTIONS[currentSection];
  document.getElementById("section-name").textContent = s.name;
  document.getElementById("section-cta").textContent = s.cta || "";
  document
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("active", i === currentSection));
  prevName.textContent = SECTIONS[(((currentSection - 1) % N) + N) % N].name;
  nextName.textContent = SECTIONS[(currentSection + 1) % N].name;

  const leaveBtn = document.getElementById("leave-btn");
  if (leaveBtn) leaveBtn.classList.toggle("visible", s.name === "CONTACT");

  const portfolioBtn = document.getElementById("portfolio-btn");
  if (portfolioBtn) portfolioBtn.classList.toggle("visible", s.name === "PORTFOLIO");

  const gearBtn = document.getElementById("gear-btn");
  if (gearBtn) gearBtn.classList.toggle("visible", s.name === "GEAR");

  const zinesBtn = document.getElementById("zines-btn");
  if (zinesBtn) zinesBtn.classList.toggle("visible", s.name === "ZINES");

  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) welcomeText.classList.toggle("visible", s.name === "INSPIRATION");
}

function navigate(dir) {
  if (busy) return;
  busy = true;

  // hide carousel and section overlays first, then pan after they fade out
  document.getElementById("section-cta").textContent = "";
  if (typeof window.hideZineCarousel === "function") window.hideZineCarousel();
  ["welcome-text", "portfolio-btn", "gear-btn", "zines-btn", "leave-btn"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("visible");
  });

  sectionInfo.classList.add("fading");

  const prev = currentSection;
  currentSection = (((currentSection + dir) % N) + N) % N;

  // wait for overlays to fade (matches 0.4s CSS transition), then pan
  setTimeout(() => {
    // on wrap-around, shift by one image width so the pan goes the natural way
    // (left from first to last, right from last to first)
    if (imgW && imgH) {
      const rw = (imgW * ((window.innerHeight * ZOOM) / 100)) / imgH;
      if (dir < 0 && prev === 0 && currentSection === N - 1) wrapOffset += rw;
      if (dir > 0 && prev === N - 1 && currentSection === 0) wrapOffset -= rw;
    }

    applySection(SECTIONS[currentSection]);
    setTimeout(() => {
      updateUI();
      sectionInfo.classList.remove("fading");
      busy = false;
    }, 950);
  }, 400);
}

// reset wrapOffset on resize since rw changes with the viewport
window.addEventListener("resize", () => {
  wrapOffset = 0;
  applySection(SECTIONS[currentSection], true);
});

function openCurrentSection() {
  // blocked on LEAVE DARKROOM section
  const leaveBtn = document.getElementById("leave-btn");
  if (leaveBtn && leaveBtn.classList.contains("visible")) return;

  const ids = ["welcome-text", "portfolio-btn", "gear-btn", "zines-btn"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.classList.contains("visible")) { el.click(); return; }
  }
}

function closeCurrentSection() {
  const gearModal = document.getElementById("gear-modal");
  const inspModal = document.getElementById("inspiration-modal");
  if (window.zineReaderActive && typeof window.hideZineReader === "function") {
    window.hideZineReader(); return;
  }
  if (window.zineCarouselActive && typeof window.hideZineCarousel === "function") {
    window.hideZineCarousel();
    const zinesBtn = document.getElementById("zines-btn");
    if (zinesBtn) zinesBtn.classList.add("visible");
    return;
  }
  if (gearModal && gearModal.classList.contains("visible")) {
    gearModal.classList.remove("visible"); return;
  }
  if (inspModal && inspModal.classList.contains("visible")) {
    inspModal.classList.remove("visible");
  }
}

function isModalOpen() {
  const gearModal = document.getElementById("gear-modal");
  const inspModal = document.getElementById("inspiration-modal");
  return (gearModal && gearModal.classList.contains("visible")) ||
         (inspModal && inspModal.classList.contains("visible"));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "ArrowDown") {
    closeCurrentSection();
    return;
  }
  if (isModalOpen()) return;
  if (window.zineCarouselActive || window.zineReaderActive) return;
  if (e.key === "ArrowRight") navigate(1);
  if (e.key === "ArrowLeft")  navigate(-1);
  if (e.key === "Enter" || e.key === "ArrowUp") {
    e.preventDefault();
    openCurrentSection();
    e.stopImmediatePropagation();
  }
});

requestAnimationFrame(() => {
  loaderBar.style.width = "50%";
});

const img = new Image();
img.onerror = () => {
  loaderSub.textContent = "scene32bit.png not found";
  loaderBar.style.background = "#c0392b";
};
img.onload = () => {
  imgW = img.naturalWidth;
  imgH = img.naturalHeight;

  pano.style.backgroundSize = `auto ${ZOOM}%`;
  applySection(SECTIONS[currentSection], true);
  updateUI();

  loaderBar.style.width = "100%";
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }, 300);
};
img.src = "scene32bit.png";
