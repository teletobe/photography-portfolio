// album carousel + reader that pops up on the ZINES section of the darkroom
// needs ZINES from ../js/data.js loaded first

(function () {
  // data.js paths are relative to the project root
  const ALL_ALBUMS = ZINES.map((z) => ({ ...z }));

  // portfolio is surfaced via its own button on the PORTFOLIO section
  const ALBUMS = ALL_ALBUMS.filter((z) => z.id !== "portfolio");

  const overlay = document.createElement("div");
  overlay.id = "zc-overlay";
  overlay.innerHTML = `
    <div id="zc-inner">
      <div id="zc-label">SELECT ALBUM</div>
      <div id="zc-nav">
        <button class="zc-btn zc-btn--prev" aria-label="Previous album">&#8249;</button>
        <div id="zc-track"></div>
        <button class="zc-btn zc-btn--next" aria-label="Next album">&#8250;</button>
      </div>
      <div id="zc-dots"></div>
      <button id="zc-back" aria-label="Close album browser">← BACK</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const reader = document.createElement("div");
  reader.id = "zc-reader";
  reader.setAttribute("aria-hidden", "true");
  reader.innerHTML = `
    <div id="zc-reader-header">
      <span id="zc-reader-title"></span>
      <button id="zc-reader-close" aria-label="Close zine">×</button>
    </div>
    <div id="zc-reader-body">
      <div id="zc-content"></div>
    </div>
  `;
  document.body.appendChild(reader);

  const track       = document.getElementById("zc-track");
  const dotsEl      = document.getElementById("zc-dots");
  const prevBtn     = overlay.querySelector(".zc-btn--prev");
  const nextBtn     = overlay.querySelector(".zc-btn--next");
  const closeBtn    = document.getElementById("zc-reader-close");
  const readerTitle = document.getElementById("zc-reader-title");
  const readerBody  = document.getElementById("zc-reader-body");
  const content     = document.getElementById("zc-content");

  let activeIndex = 0;
  const cards = [];

  const ROTATIONS = [-2.3, 1.4, -1.0, 2.1, -1.7, 0.8];

  ALBUMS.forEach((album, i) => {
    const card = document.createElement("article");
    card.className = "zc-card";
    card.style.setProperty("--rot", ROTATIONS[i % ROTATIONS.length] + "deg");

    card.innerHTML = `
      <div class="zc-card-inner">
        <div class="zc-card-cover">
          <img src="${album.cover}" alt="${album.title} cover" loading="lazy" />
        </div>
        <div class="zc-card-meta">
          <span class="zc-card-title">${album.title.toUpperCase()}</span>
          <span class="zc-card-sub">${album.subtitle}</span>
          <span class="zc-card-open">[ OPEN ]</span>
        </div>
      </div>
    `;

    track.appendChild(card);
    cards.push(card);
  });

  ALBUMS.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "zc-dot";
    dot.setAttribute("aria-label", "Album " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  // shortest wrap-around distance (handles the 6-album loop)
  function normalizedOffset(i) {
    const n = ALBUMS.length;
    let off = i - activeIndex;
    while (off >  n / 2) off -= n;
    while (off < -n / 2) off += n;
    return off;
  }

  function update() {
    cards.forEach((card, i) => {
      const off = normalizedOffset(i);
      const abs = Math.abs(off);

      card.style.setProperty("--off", off);
      card.classList.remove("zc-center", "zc-side", "zc-hidden");

      if (off === 0) {
        card.classList.add("zc-center");
        card.style.setProperty("--sc", "1");
        card.style.setProperty("--op", "1");
        card.style.setProperty("--zi", "4");
        card.onclick = () => openReader(ALBUMS[i]);
      } else if (abs === 1) {
        card.classList.add("zc-side");
        card.style.setProperty("--sc", "0.76");
        card.style.setProperty("--op", "0.5");
        card.style.setProperty("--zi", "3");
        card.onclick = () => goTo(i);
      } else {
        card.classList.add("zc-hidden");
        card.style.setProperty("--sc", "0.55");
        card.style.setProperty("--op", "0");
        card.style.setProperty("--zi", "1");
        card.onclick = null;
      }
    });

    dotsEl.querySelectorAll(".zc-dot").forEach((d, i) =>
      d.classList.toggle("zc-dot--active", i === activeIndex)
    );
  }

  function goTo(i) {
    activeIndex = ((i % ALBUMS.length) + ALBUMS.length) % ALBUMS.length;
    update();
  }

  prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  let sx = 0;
  track.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend",   (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
  }, { passive: true });

  // editorial layout for the reader scroll view
  const SHIFTS = [0, 44, -36, 28, -52, 18, 40, -28, 56, -40, 24, -48];
  const LAYOUTS = [
    { type: "hero",       count: 1 },
    { type: "duo-offset", count: 2 },
    { type: "solo-left",  count: 1 },
    { type: "trio",       count: 3 },
    { type: "solo-right", count: 1 },
    { type: "duo-even",   count: 2 },
  ];
  const MOBILE_LAYOUTS = [
    { type: "duo-even",   count: 2 },
    { type: "solo-left",  count: 1 },
    { type: "duo-offset", count: 2 },
    { type: "solo-right", count: 1 },
  ];

  function buildZine(photos) {
    content.innerHTML = "";
    let pi = 0, li = 0;
    const layouts = window.innerWidth <= 640 ? MOBILE_LAYOUTS : LAYOUTS;

    while (pi < photos.length) {
      const layout = layouts[li % layouts.length];
      const count  = Math.min(layout.count, photos.length - pi);
      const block  = document.createElement("div");
      block.className = `zcr-block zcr-${layout.type}`;
      block.style.setProperty("--shift", SHIFTS[li % SHIFTS.length] + "px");

      for (let k = 0; k < count; k++) {
        const wrap = document.createElement("div");
        wrap.className = "zcr-wrap";
        wrap.style.transitionDelay = (k * 0.09) + "s";

        const img = document.createElement("img");
        img.dataset.src = photos[pi + k].src;
        img.alt         = "";
        img.decoding    = "async";
        wrap.appendChild(img);
        block.appendChild(wrap);
      }

      content.appendChild(block);
      pi += count;
      li++;
    }

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const img = e.target.querySelector("img[data-src]");
        if (!img) return;
        const reveal = () => e.target.classList.add("visible");
        img.onload  = reveal;
        img.onerror = reveal;
        img.src = img.dataset.src;
        delete img.dataset.src;
      }),
      { threshold: 0, root: readerBody, rootMargin: "300px 0px" }
    );
    content.querySelectorAll(".zcr-wrap").forEach((w) => obs.observe(w));
  }

  function openReader(album) {
    readerTitle.textContent = album.title.toUpperCase();
    buildZine(album.photos);
    readerBody.scrollTop = 0;
    reader.classList.add("active");
    reader.removeAttribute("aria-hidden");
    window.zineReaderActive = true;
    closeBtn.focus();
  }

  function closeReader() {
    reader.classList.remove("active");
    reader.setAttribute("aria-hidden", "true");
    window.zineReaderActive = false;
    setTimeout(() => { content.innerHTML = ""; }, 380);
  }

  closeBtn.addEventListener("click", closeReader);

  window.hideZineReader = closeReader;

  window.openPortfolioReader = function () {
    const portfolio = ALL_ALBUMS.find((a) => a.id === "portfolio");
    if (portfolio) openReader(portfolio);
  };

  // darkroom.js bails early if zineCarouselActive, so arrows are ours when open
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Escape" || e.key === "ArrowDown") && window.zineReaderActive) {
      closeReader();
      return;
    }
    if (!window.zineCarouselActive || window.zineReaderActive) return;
    if (e.key === "ArrowLeft")  goTo(activeIndex - 1);
    if (e.key === "ArrowRight") goTo(activeIndex + 1);
    if (e.key === "Enter" || e.key === "ArrowUp") {
      e.preventDefault();
      openReader(ALBUMS[activeIndex]);
    }
  });

  window.openZineCarousel = function () {
    overlay.classList.add("visible");
    window.zineCarouselActive = true;
    document.getElementById("section-info").classList.add("carousel-mode");
    document.body.classList.add("carousel-active");
    const zinesBtn = document.getElementById("zines-btn");
    if (zinesBtn) zinesBtn.classList.remove("visible");
    update();
  };

  // kept for darkroom.js navigate() calls; does NOT restore zines-btn
  window.hideZineCarousel = function () {
    overlay.classList.remove("visible");
    window.zineCarouselActive = false;
    document.getElementById("section-info").classList.remove("carousel-mode");
    document.body.classList.remove("carousel-active");
  };

  // back button: close carousel and return to the zines section view
  const backBtn = document.getElementById("zc-back");
  backBtn.addEventListener("click", () => {
    window.hideZineCarousel();
    const zinesBtn = document.getElementById("zines-btn");
    if (zinesBtn) zinesBtn.classList.add("visible");
  });

  update();
})();
