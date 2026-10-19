// Local dev server: `npm run dev`, then http://localhost:3000
//
// Serves the site like Vercel does, plus:
// - rebuilds data.js whenever clouds.config.js or media/ changes, so a
//   reload always shows the latest
// - for arrange mode (?arrange): POST /__arrange writes a section's clouds
//   into clouds.config.js, so moved clouds stick
// Local only, tools/ is never deployed.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const CONFIG = path.join(ROOT, "clouds.config.js");
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

// ── editing clouds.config.js in place, keeping its comments ────────────

// index of the bracket closing the one at s[i], skipping strings and comments
function closing(s, i) {
  let depth = 0;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'" || c === "`") {
      for (i++; s[i] !== c; i++) if (s[i] === "\\") i++;
    } else if (c === "/" && s[i + 1] === "/") {
      i = s.indexOf("\n", i);
    } else if (c === "/" && s[i + 1] === "*") {
      i = s.indexOf("*/", i) + 1;
    } else if ("([{".includes(c)) {
      depth++;
    } else if (")]}".includes(c) && --depth === 0) {
      return i;
    }
  }
  throw new Error("unbalanced brackets in clouds.config.js");
}

// the { ... } block that follows `name:` somewhere after `from`
function block(s, name, from = 0) {
  const m = new RegExp(`\\b${name}\\s*:\\s*\\{`).exec(s.slice(from));
  if (!m) throw new Error(`no "${name}: {" in clouds.config.js`);
  const open = from + m.index + m[0].length - 1;
  return { open, close: closing(s, open) };
}

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const key = (t) => (/^[A-Za-z_$][\w$]*$/.test(t) ? t : JSON.stringify(t));
const num = (v) => Math.round(Number(v) || 0);

function writeRoom(text, mode, section, shots) {
  const room = block(text, "room");
  const set = block(text, mode, room.open);
  if (set.close > room.close) throw new Error(`no room.${mode} in clouds.config.js`);

  const items = shots.map(
    (s) => `        { photo: ${JSON.stringify(String(s.photo))}, x: ${num(s.x)}, y: ${num(s.y)}, size: ${num(s.size)}` + (num(s.depth) ? `, depth: ${num(s.depth)}` : "") + " },"
  );
  const list = `[\n${items.join("\n")}\n      ]`;

  const inSet = text.slice(set.open, set.close);
  const m = new RegExp(`^[ \\t]*(${escape(section)}|${escape(JSON.stringify(section))})\\s*:\\s*\\[`, "m").exec(inSet);
  if (m) {
    const open = set.open + m.index + m[0].length - 1;
    return text.slice(0, open) + list + text.slice(closing(text, open) + 1);
  }
  // section not in this set yet: add it at the end
  const before = text.slice(0, set.close).replace(/\s*$/, "");
  return `${before}\n      ${key(section)}: ${list},\n    ${text.slice(set.close)}`;
}

function saveArrangement(body) {
  const { mode, section, shots } = JSON.parse(body);
  if (!["desktop", "mobile"].includes(mode)) throw new Error(`unknown mode "${mode}"`);
  if (typeof section !== "string" || !Array.isArray(shots) || !shots.length) throw new Error("nothing to save");
  fs.writeFileSync(CONFIG, writeRoom(fs.readFileSync(CONFIG, "utf8"), mode, section, shots));
  console.log(`saved room.${mode} → ${section}`);
  return build();
}

// ── rebuilding data.js ─────────────────────────────────────────────────

function build() {
  clearTimeout(rebuildTimer); // a save already covers any pending rebuild
  try {
    const out = execFileSync(process.execPath, [path.join(ROOT, "build-data.js")], { cwd: ROOT, encoding: "utf8", stdio: "pipe" });
    process.stdout.write(out);
    return out;
  } catch (e) {
    // e.g. a typo in clouds.config.js: say so, keep serving the last good data.js
    console.error("build failed:", (e.stderr || e.message).trim());
    throw new Error("build failed, see the terminal");
  }
}

let rebuildTimer;
const rebuildSoon = () => {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    try {
      build();
    } catch {}
  }, 300);
};
// the folder, not the file: some editors save by replacing the file
fs.watch(ROOT, (_, file) => file === path.basename(CONFIG) && rebuildSoon());
fs.watch(path.join(ROOT, "media"), { recursive: true }, (_, file) => file && !file.endsWith(".DS_Store") && rebuildSoon());
build();

// ── the server ─────────────────────────────────────────────────────────

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url === "/__arrange") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        try {
          const log = saveArrangement(body);
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: true, log }));
        } catch (e) {
          console.error("arrange:", e.message);
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }

    let file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    fs.readFile(file, (err, data) => {
      if (err) return res.writeHead(404, { "content-type": "text/plain" }).end("not found");
      // no caching, so a reload always shows the latest data.js
      res.writeHead(200, { "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}  (arrange: http://localhost:${PORT}/?arrange)`));
