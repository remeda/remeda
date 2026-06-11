/**
 * Regenerates the remeda mark and lockup SVGs from first principles.
 *
 * The mark is fully parametric: the Sora 800 "R" is polygonized, cut by the
 * seam, and re-stitched into clean per-side pieces (no clip paths, no
 * degenerate bridge edges), then every output is pixel-verified against an
 * independent clip-based construction at native resolution.
 *
 * Usage (from the repo root):
 *   npm run generate -w @remeda/brand
 */
const sharp = require("sharp");
const opentype = require("opentype.js");
const fs = require("fs");
const path = require("path");

const BLUE = "#3178C6"; // official TypeScript blue
const YELLOW = "#F7DF1E"; // official JavaScript yellow
const INK = "#1c1f26";
const PAPER = "#f1f5f9";

// FINAL CUT: seam from (446,0) to (286,512), hugging the bowl's inner corner
const TOPX = 446;
const BOTX = 286;
const seamX = (y) => TOPX + ((BOTX - TOPX) * y) / 512;

const font = opentype.parse(
  fs
    .readFileSync(path.join(__dirname, "fonts", "sora-extrabold.ttf"))
    .buffer.slice(0),
);

// letter spec: Sora 800 "R", bbox height ~250, tucked to (right=490, bottom=486)
const probe = font.getPath("R", 0, 0, 100).getBoundingBox();
const SIZE = (250 / (probe.y2 - probe.y1)) * 100;
const bb = font.getPath("R", 0, 0, SIZE).getBoundingBox();
const R_GLYPH = font.getPath("R", 490 - bb.x2, 486 - bb.y2, SIZE);

// ---------------- polygonize glyph (TTF quadratics), split into rings
function rings(otPath) {
  const out = [];
  let ring = null;
  let cur = null;
  const SEG = 14;
  for (const c of otPath.commands) {
    if (c.type === "M") {
      if (ring && ring.length > 2) out.push(ring);
      ring = [[c.x, c.y]];
      cur = [c.x, c.y];
    } else if (c.type === "L") {
      ring.push([c.x, c.y]);
      cur = [c.x, c.y];
    } else if (c.type === "Q") {
      for (let i = 1; i <= SEG; i++) {
        const t = i / SEG;
        const mt = 1 - t;
        ring.push([
          mt * mt * cur[0] + 2 * mt * t * c.x1 + t * t * c.x,
          mt * mt * cur[1] + 2 * mt * t * c.y1 + t * t * c.y,
        ]);
      }
      cur = [c.x, c.y];
    } else if (c.type === "C") {
      for (let i = 1; i <= SEG; i++) {
        const t = i / SEG;
        const mt = 1 - t;
        ring.push([
          mt ** 3 * cur[0] +
            3 * mt * mt * t * c.x1 +
            3 * mt * t * t * c.x2 +
            t ** 3 * c.x,
          mt ** 3 * cur[1] +
            3 * mt * mt * t * c.y1 +
            3 * mt * t * t * c.y2 +
            t ** 3 * c.y,
        ]);
      }
      cur = [c.x, c.y];
    } else if (c.type === "Z" && ring && ring.length > 2) {
      out.push(ring);
      ring = null;
    }
  }
  if (ring && ring.length > 2) out.push(ring);
  return out;
}

const signedArea = (ring) => {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
};

// Cut a simple ring by the seam, returning CLEAN separate rings per side.
// Chains of kept vertices are stitched via interior intervals along the
// seam: crossings sorted by y alternate interior/exterior, so consecutive
// pairs are the connectors. No Sutherland-Hodgman bridge edges.
function cutRing(ring, keepLeft) {
  const f = ([x, y]) => x - seamX(y);
  const inside = (p) => (keepLeft ? f(p) < 0 : f(p) > 0);
  const intersect = (a, b) => {
    const fa = f(a);
    const fb = f(b);
    const t = fa / (fa - fb);
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  };

  const chains = [];
  let chain = null;
  let openedAtStart = null;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia && chain === null) {
      chain = { entry: null, pts: [a], exit: null };
      if (i === 0) openedAtStart = chain;
    } else if (ia) {
      chain.pts.push(a);
    }
    if (ia && !ib) {
      chain.exit = intersect(a, b);
      chains.push(chain);
      chain = null;
    } else if (!ia && ib) {
      chain = { entry: intersect(a, b), pts: [], exit: null };
    }
  }
  if (chain) {
    if (openedAtStart && openedAtStart !== chain) {
      openedAtStart.entry = chain.entry;
      openedAtStart.pts = [...chain.pts, ...openedAtStart.pts];
    } else if (chain.entry === null) {
      return [ring]; // never crossed: fully inside
    } else {
      chains.push(chain);
    }
  }
  if (chains.length === 0) return [];
  if (chains.some((c) => !c.entry || !c.exit)) {
    return chains.length === 1 && !chains[0].entry ? [ring] : [];
  }

  const crossings = [];
  chains.forEach((c, ci) => {
    crossings.push({ y: c.entry[1], type: "entry", ci });
    crossings.push({ y: c.exit[1], type: "exit", ci });
  });
  crossings.sort((p, q) => p.y - q.y);
  const partner = new Map();
  for (let i = 0; i + 1 < crossings.length; i += 2) {
    partner.set(`${crossings[i].type}:${crossings[i].ci}`, crossings[i + 1]);
    partner.set(
      `${crossings[i + 1].type}:${crossings[i + 1].ci}`,
      crossings[i],
    );
  }

  const used = new Array(chains.length).fill(false);
  const out = [];
  for (let start = 0; start < chains.length; start++) {
    if (used[start]) continue;
    const piece = [];
    let ci = start;
    for (let guard = 0; guard <= chains.length; guard++) {
      used[ci] = true;
      const c = chains[ci];
      piece.push(c.entry, ...c.pts, c.exit);
      const next = partner.get(`exit:${ci}`);
      if (!next || next.type !== "entry") break;
      if (next.ci === start) break;
      ci = next.ci;
    }
    if (piece.length > 2) out.push(piece.filter(Boolean));
  }
  return out;
}

const fmt = (n) => Math.round(n * 100) / 100;
const ringsToPath = (rs) =>
  rs
    .map((ring) => `M${ring.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L")}Z`)
    .join("");

const glyphRings = rings(R_GLYPH);
const outerSign = Math.sign(
  signedArea(
    glyphRings.reduce((m, r) =>
      Math.abs(signedArea(r)) > Math.abs(signedArea(m)) ? r : m,
    ),
  ),
);
const cutAll = (keepLeft) =>
  glyphRings.flatMap((r) =>
    cutRing(r, keepLeft).map((pts) => ({
      pts,
      isCounter: Math.sign(signedArea(r)) !== outerSign,
    })),
  );
const whitePieces = cutAll(true);
const inkPieces = cutAll(false);

const whitePath = ringsToPath(whitePieces.map((c) => c.pts));
const inkPath = ringsToPath(inkPieces.map((c) => c.pts));
const markSvg = (cBlue, cYellow, cWhite, cInk) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<polygon points="0,0 ${TOPX},0 ${BOTX},512 0,512" fill="${cBlue}"/>` +
  `<polygon points="${TOPX},0 512,0 512,512 ${BOTX},512" fill="${cYellow}"/>` +
  `<path d="${whitePath}" fill="${cWhite}"/>` +
  `<path d="${inkPath}" fill="${cInk}"/>` +
  `</svg>`;

const flatSvg = markSvg(BLUE, YELLOW, "#FFFFFF", INK);
const monoSvg = markSvg(INK, "#FFFFFF", "#FFFFFF", INK);

// one-color mark, light = transparent: field quad with the white pieces
// knocked out (counters restored), ink pieces filled; windings computed
const quadRing = [
  [0, 0],
  [TOPX, 0],
  [BOTX, 512],
  [0, 512],
];
const F = Math.sign(signedArea(quadRing));
const force = (pts, want) =>
  Math.sign(signedArea(pts)) === want ? pts : [...pts].reverse();
const stencilRings = [...whitePieces, ...inkPieces].map((c) =>
  force(c.pts, c.isCounter ? F : -F),
);
const stencilSvg = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<path d="M0 0L${TOPX} 0L${BOTX} 512L0 512Z${ringsToPath(stencilRings)}" fill="${color}"/>` +
  `</svg>`;

function pathDataFull(otPath) {
  return otPath.commands
    .map((c) => {
      switch (c.type) {
        case "M":
          return `M${fmt(c.x)} ${fmt(c.y)}`;
        case "L":
          return `L${fmt(c.x)} ${fmt(c.y)}`;
        case "Q":
          return `Q${fmt(c.x1)} ${fmt(c.y1)} ${fmt(c.x)} ${fmt(c.y)}`;
        case "C":
          return `C${fmt(c.x1)} ${fmt(c.y1)} ${fmt(c.x2)} ${fmt(c.y2)} ${fmt(c.x)} ${fmt(c.y)}`;
        default:
          return "Z";
      }
    })
    .join("");
}

// lockup: mark + "remeda" wordmark in the same Sora 800
function lockupSvg(textColor) {
  const wordProbe = font.getPath("remeda", 0, 0, 100).getBoundingBox();
  const wSize = (250 / (wordProbe.y2 - wordProbe.y1)) * 100;
  const wb = font.getPath("remeda", 0, 0, wSize).getBoundingBox();
  const MARK_BOX = 430;
  const markX = 36;
  const textX = markX + MARK_BOX + 72 - wb.x1;
  const textY = 256 + (wb.y2 - wb.y1) / 2 - wb.y2;
  const wPath = pathDataFull(font.getPath("remeda", textX, textY, wSize));
  const width = Math.ceil(textX + wb.x2 - wb.x1 + 72);
  const scale = (MARK_BOX / 512).toFixed(4);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="512" viewBox="0 0 ${width} 512">` +
    `<g transform="translate(${markX},${(512 - MARK_BOX) / 2}) scale(${scale})">` +
    flatSvg.replace(/<\/?svg[^>]*>/g, "") +
    `</g>` +
    `<path d="${wPath}" fill="${textColor}"/>` +
    `</svg>`
  );
}

// independent clip-based construction, used only to verify the flattening
const refSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<defs>` +
  `<clipPath id="t"><polygon points="0,0 ${TOPX},0 ${BOTX},512 0,512"/></clipPath>` +
  `<clipPath id="u"><polygon points="${TOPX},0 512,0 512,512 ${BOTX},512"/></clipPath>` +
  `</defs>` +
  `<rect width="512" height="512" fill="${BLUE}"/>` +
  `<polygon points="${TOPX},0 512,0 512,512 ${BOTX},512" fill="${YELLOW}"/>` +
  `<path d="${pathDataFull(R_GLYPH)}" fill="#FFFFFF" clip-path="url(#t)"/>` +
  `<path d="${pathDataFull(R_GLYPH)}" fill="${INK}" clip-path="url(#u)"/>` +
  `</svg>`;

(async () => {
  const renderNative = (svg) =>
    sharp(Buffer.from(svg), { density: 72 })
      .flatten({ background: "#ffffff" })
      .raw()
      .toBuffer();

  const checks = [];
  {
    const [a, b] = await Promise.all([
      renderNative(flatSvg),
      renderNative(refSvg),
    ]);
    let d = 0;
    for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 24) d++;
    checks.push(["flatten vs clip reference", d / a.length, 0.002]);
  }
  {
    const [color, mono] = await Promise.all([
      renderNative(flatSvg),
      renderNative(monoSvg),
    ]);
    const dist2 = (r, g, b, c) =>
      (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    const C = {
      blue: [49, 120, 198],
      ink: [28, 31, 38],
      yellow: [247, 223, 30],
      white: [255, 255, 255],
    };
    let mm = 0;
    const px = color.length / 3;
    for (let i = 0; i < px; i++) {
      const r = color[3 * i];
      const g = color[3 * i + 1];
      const b = color[3 * i + 2];
      const expectDark =
        Math.min(dist2(r, g, b, C.blue), dist2(r, g, b, C.ink)) <
        Math.min(dist2(r, g, b, C.yellow), dist2(r, g, b, C.white));
      const isDark = mono[3 * i] + mono[3 * i + 1] + mono[3 * i + 2] < 384;
      if (expectDark !== isDark) mm++;
    }
    checks.push(["mono vs color flattening rule", mm / px, 0.002]);
  }
  {
    const [a, b] = await Promise.all([
      renderNative(stencilSvg(INK)),
      renderNative(monoSvg),
    ]);
    let d = 0;
    for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 24) d++;
    checks.push(["mono-transparent vs two-tone mono", d / a.length, 0.01]);
  }

  let failed = false;
  for (const [name, ratio, budget] of checks) {
    const ok = ratio <= budget;
    if (!ok) failed = true;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${name}: ${(ratio * 100).toFixed(3)}% (budget ${budget * 100}%)`,
    );
  }
  if (failed) {
    console.error("verification failed; SVGs not written");
    process.exit(1);
  }

  fs.writeFileSync(path.join(__dirname, "remeda-mark.svg"), flatSvg);
  fs.writeFileSync(path.join(__dirname, "remeda-mark-mono.svg"), monoSvg);
  fs.writeFileSync(
    path.join(__dirname, "remeda-mark-mono-transparent.svg"),
    stencilSvg(INK),
  );
  fs.writeFileSync(
    path.join(__dirname, "remeda-lockup-light.svg"),
    lockupSvg(INK),
  );
  fs.writeFileSync(
    path.join(__dirname, "remeda-lockup-dark.svg"),
    lockupSvg(PAPER),
  );
  console.log("wrote 5 SVGs to packages/brand/");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
