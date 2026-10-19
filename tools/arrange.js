// Arrange mode: drag the room's clouds into place. With `npm run dev`
// (tools/dev.js) every change is saved into clouds.config.js on its own;
// on any other server, copy the printed lines in by hand.
//
// Local tool only: assets/room.js loads this file just on localhost with
// ?arrange in the URL, and .vercelignore keeps tools/ out of deployments.
// It runs after assets/room.js and uses its globals (AREAS, current,
// mode, stage, frame, hitShot, placeShot).

(function () {
  const style = document.createElement("style");
  style.textContent = `
    .arranging .area.active .frame {
      outline: 1px dashed rgba(0, 0, 0, 0.15);
    }
    .arranging .area.active .shot {
      outline: 1px dashed rgba(217, 68, 43, 0.6);
      outline-offset: -8px;
    }
    #arrange {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 70;
      max-width: min(560px, calc(100vw - 32px));
      padding: 12px 14px;
      background: #fff;
      border: 1px solid var(--line);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      font: 400 11px/1.5 var(--mono);
      color: var(--muted);
    }
    #arrange b {
      color: var(--accent);
      font-weight: 500;
    }
    #arrange pre {
      margin: 10px 0;
      color: var(--ink);
      font: 400 11px/1.6 var(--mono);
      white-space: pre;
      overflow-x: auto;
    }
    #arrange .status {
      margin-left: 8px;
    }
    #arrange button {
      font: 500 10px var(--mono);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 10px;
      border: 1px solid var(--ink);
      background: none;
      cursor: pointer;
    }
    @media (max-width: 700px) {
      #arrange {
        left: 8px;
        right: 8px;
        bottom: 8px;
        padding: 8px 10px;
        font-size: 9px;
      }
      #arrange pre {
        margin: 4px 0;
        font-size: 9px;
      }
    }`;
  document.head.appendChild(style);

  document.body.classList.add("arranging");
  const box = document.createElement("div");
  box.id = "arrange";
  box.innerHTML = `<b>arrange <span class="mode"></span></b> — drag a cloud to move it · scroll to resize · shift + scroll for depth · changes save on their own
    <pre></pre><button class="copy"></button> <button class="size" data-d="-2">− smaller</button> <button class="size" data-d="2">+ bigger</button><span class="status"></span>`;
  document.body.appendChild(box);
  const pre = box.querySelector("pre");
  const copyBtn = box.querySelector(".copy");
  const status = box.querySelector(".status");
  const copyLabel = () => `copy for room.${mode}`;
  const key = (t) => (/^[A-Za-z_$][\w$]*$/.test(t) ? t : JSON.stringify(t));

  let picked = null; // last cloud touched, for the size buttons (no scroll wheel on phones)
  box.querySelectorAll(".size").forEach(
    (b) =>
      (b.onclick = () => {
        const s = picked && AREAS[current].shots.includes(picked) ? picked : AREAS[current].shots[0];
        if (!s) return;
        s.w = Math.max(5, Math.min(96, s.w + +b.dataset.d));
        placeShot(s);
        refresh();
        queueSave();
      })
  );

  const snippet = () => {
    box.querySelector(".mode").textContent = mode;
    if (!copyBtn.dataset.busy) copyBtn.textContent = copyLabel();
    const a = AREAS[current];
    if (!a.node) return `(${a.label.toLowerCase()} isn't part of clouds.config.js)`;
    const line = (s) =>
      `  { photo: ${JSON.stringify(s.photo)}, x: ${Math.round(s.x)}, y: ${Math.round(s.y)}, size: ${Math.round(s.w)}` +
      (Math.round(s.z) ? `, depth: ${Math.round(s.z)}` : "") +
      " },";
    return `// clouds.config.js → room.${mode}\n${key(a.label)}: [\n${a.shots.map(line).join("\n")}\n],`;
  };
  const refresh = () => (pre.textContent = snippet());
  setInterval(refresh, 300); // also follows turning to another section

  // save into clouds.config.js through tools/dev.js, a moment after the last change
  const pending = new Map(); // one entry per mode + section
  let saveTimer;
  function queueSave() {
    const a = AREAS[current];
    if (!a.node) return;
    const shots = a.shots.map((s) => ({ photo: s.photo, x: s.x, y: s.y, size: s.w, depth: s.z || 0 }));
    pending.set(mode + "|" + a.label, { mode, section: a.label, shots });
    status.textContent = "saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 400);
  }
  async function flush() {
    for (const [k, body] of pending) {
      pending.delete(k);
      try {
        const r = await fetch("/__arrange", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
        const res = await r.json();
        if (!res.ok) throw new Error(res.error);
        status.textContent = "saved ✓";
      } catch (e) {
        status.textContent = noDevServer(e) ? "not saved: start the site with npm run dev, or copy the lines" : "not saved: " + e.message;
      }
    }
  }
  // npx serve and friends answer the POST with an error page, not JSON
  const noDevServer = (e) => e instanceof SyntaxError || e instanceof TypeError;

  const shotAt = (e) => {
    const el = hitShot(current, e.clientX, e.clientY);
    return AREAS[current].shots.find((s) => s.el === el);
  };

  // these run in the capture phase, ahead of the normal room controls
  let held = null;
  stage.addEventListener(
    "pointerdown",
    (e) => {
      const s = shotAt(e);
      if (!s) return;
      e.stopImmediatePropagation();
      picked = s;
      held = { s, x: e.clientX, y: e.clientY, x0: s.x, y0: s.y };
    },
    true
  );
  addEventListener(
    "pointermove",
    (e) => {
      if (!held) return;
      e.stopImmediatePropagation();
      held.s.x = held.x0 + ((e.clientX - held.x) / frame.w) * 100;
      held.s.y = held.y0 + ((e.clientY - held.y) / frame.h) * 100;
      placeShot(held.s);
      refresh();
    },
    true
  );
  addEventListener(
    "pointerup",
    () => {
      if (held && (held.s.x !== held.x0 || held.s.y !== held.y0)) queueSave();
      held = null;
    },
    true
  );
  // no stepping into sections while arranging
  stage.addEventListener("click", (e) => e.stopImmediatePropagation(), true);
  stage.addEventListener(
    "wheel",
    (e) => {
      const s = shotAt(e);
      if (!s) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      picked = s;
      const d = e.deltaY || e.deltaX; // shift+scroll arrives as deltaX on macOS
      if (e.shiftKey) s.z = Math.max(0, Math.min(150, (s.z || 0) - d * 0.2));
      else s.w = Math.max(5, Math.min(90, s.w - d * 0.03));
      placeShot(s);
      refresh();
      queueSave();
    },
    { capture: true, passive: false }
  );

  copyBtn.onclick = async () => {
    await navigator.clipboard.writeText(pre.textContent);
    copyBtn.dataset.busy = 1;
    copyBtn.textContent = "copied ✓";
    setTimeout(() => {
      delete copyBtn.dataset.busy;
      copyBtn.textContent = copyLabel();
    }, 1500);
  };
})();
