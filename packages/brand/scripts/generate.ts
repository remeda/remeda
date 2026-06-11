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

import fs from "node:fs";
import path from "node:path";
import opentype, { type Path } from "opentype.js";
import sharp from "sharp";
import { map } from "remeda";

type Color = readonly [red: number, green: number, blue: number];

// ---------------------- DEFINITION -------------------------------------------

const DIMENSION_PX = 512;

// FINAL CUT: seam from (446,0) to (286,DIMENSION_PX), hugging the bowl's inner corner
const TOP_X_PX = 446;
const BOTTOM_X_PX = 286;

const COLOR = {
  // official TypeScript blue
  blue: [49, 120, 198],
  white: [255, 255, 255],

  // official JavaScript yellow
  yellow: [247, 223, 30],
  ink: [28, 31, 38],

  paper: [241, 245, 249],
} as const satisfies Readonly<Record<string, Color>>;

const FONT_FILE = "sora-extrabold.ttf";

// -----------------------------------------------------------------------------

const PACKAGE_ROOT = path.join(import.meta.dirname, "..");
const FONTS_DIR = "fonts";
const OUT_DIR = "assets";

type Point = readonly [x: number, y: number];

type Chain = {
  entry: Point | null;
  pts: Point[];
  exit: Point | null;
};

type Crossing = {
  readonly y: number;
  readonly type: "entry" | "exit";
  readonly ci: number;
};

async function main(): Promise<void> {
  const checks: {
    readonly name: string;
    readonly ratio: number;
    readonly budget: number;
  }[] = [];

  const blueHex = toHexColor(COLOR.blue);
  const yellowHex = toHexColor(COLOR.yellow);
  const inkHex = toHexColor(COLOR.ink);
  const whiteHex = toHexColor(COLOR.white);

  const flatSvg = renderMark(blueHex, yellowHex, whiteHex, inkHex);
  const monoSvg = renderMark(inkHex, whiteHex, whiteHex, inkHex);
  const stencilSvg = renderStencil(inkHex);

  const [color, mono, stencil, clipBased] = await Promise.all(
    map(
      [flatSvg, monoSvg, stencilSvg, renderClipReference()],
      async (path) => await renderNative(path),
    ),
  );

  let d = 0;
  for (let i = 0; i < color.length; i++) {
    if (Math.abs(color[i]! - clipBased[i]!) > 24) {
      d++;
    }
  }

  checks.push({
    name: "flatten vs clip reference",
    ratio: d / color.length,
    budget: 0.002,
  });

  let mm = 0;
  const px = color.length / 3;
  for (let i = 0; i < px; i++) {
    const r = color[3 * i]!;
    const g = color[3 * i + 1]!;
    const b = color[3 * i + 2]!;
    const expectDark =
      Math.min(dist2(r, g, b, COLOR.blue), dist2(r, g, b, COLOR.ink)) <
      Math.min(dist2(r, g, b, COLOR.yellow), dist2(r, g, b, COLOR.white));
    const isDark = mono[3 * i]! + mono[3 * i + 1]! + mono[3 * i + 2]! < 384;
    if (expectDark !== isDark) {
      mm++;
    }
  }
  checks.push({
    name: "mono vs color flattening rule",
    ratio: mm / px,
    budget: 0.002,
  });

  let d2 = 0;
  for (let i = 0; i < stencil.length; i++) {
    if (Math.abs(stencil[i]! - mono[i]!) > 24) {
      d2++;
    }
  }
  checks.push({
    name: "mono-transparent vs two-tone mono",
    ratio: d2 / stencil.length,
    budget: 0.01,
  });

  let failed = false;
  for (const { name, ratio, budget } of checks) {
    const isOk = ratio <= budget;
    if (!isOk) {
      failed = true;
    }

    console.log(
      `${isOk ? "ok  " : "FAIL"} ${name}: ${(ratio * 100).toFixed(3)}% (budget ${budget * 100}%)`,
    );
  }

  if (failed) {
    console.error("verification failed; SVGs not written");
    process.exit(1);
  }

  write("remeda-mark.svg", flatSvg);
  write("remeda-mark-mono.svg", monoSvg);
  write("remeda-mark-mono-transparent.svg", stencilSvg);
  write("remeda-lockup-light.svg", lockupSvg(flatSvg, inkHex));
  write("remeda-lockup-dark.svg", lockupSvg(flatSvg, toHexColor(COLOR.paper)));
  console.log("wrote 5 SVGs to packages/brand/");
}

function write(filename: string, content: string): void {
  fs.writeFileSync(path.join(PACKAGE_ROOT, OUT_DIR, filename), content);
}

function dist2(r: number, g: number, b: number, c: Color): number {
  return (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
}

// ---------------- polygonize glyph (TTF quadratics), split into rings
function rings(otPath: Path): readonly Point[][] {
  const out: Point[][] = [];
  // every contour opens with an M command, which resets both of these
  let ring: Point[] = [];
  let cur: Point = [0, 0];
  const SEG = 14;
  for (const c of otPath.commands) {
    if (c.type === "M") {
      if (ring.length > 2) out.push(ring);
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
    } else if (c.type === "Z" && ring.length > 2) {
      out.push(ring);
      ring = [];
    }
  }
  if (ring.length > 2) out.push(ring);
  return out;
}

function signedArea(ring: readonly Point[]): number {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i]!;
    const [x2, y2] = ring[(i + 1) % ring.length]!;
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

// Cut a simple ring by the seam, returning CLEAN separate rings per side.
// Chains of kept vertices are stitched via interior intervals along the
// seam: crossings sorted by y alternate interior/exterior, so consecutive
// pairs are the connectors. No Sutherland-Hodgman bridge edges.
function cutRing(ring: readonly Point[], keepLeft: boolean): Point[][] {
  const f = ([x, y]: Point): number => x - seamX(y);
  const inside = (p: Point): boolean => (keepLeft ? f(p) < 0 : f(p) > 0);
  const intersect = (a: Point, b: Point): Point => {
    const fa = f(a);
    const fb = f(b);
    const t = fa / (fa - fb);
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  };

  const chains: Chain[] = [];
  let chain: Chain | null = null;
  let openedAtStart: Chain | null = null;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const ia = inside(a);
    const ib = inside(b);
    if (ia) {
      if (chain === null) {
        chain = { entry: null, pts: [a], exit: null };
        if (i === 0) openedAtStart = chain;
      } else {
        chain.pts.push(a);
      }
      if (!ib) {
        chain.exit = intersect(a, b);
        chains.push(chain);
        chain = null;
      }
    } else if (ib) {
      chain = { entry: intersect(a, b), pts: [], exit: null };
    }
  }
  if (chain !== null) {
    if (openedAtStart !== null && openedAtStart !== chain) {
      openedAtStart.entry = chain.entry;
      openedAtStart.pts = [...chain.pts, ...openedAtStart.pts];
    } else if (chain.entry === null) {
      return [[...ring]]; // never crossed: fully inside
    } else {
      chains.push(chain);
    }
  }
  if (chains.length === 0) return [];
  const closedChains: {
    readonly entry: Point;
    readonly pts: readonly Point[];
    readonly exit: Point;
  }[] = [];
  for (const { entry, pts, exit } of chains) {
    if (entry === null || exit === null) {
      return chains.length === 1 && chains[0]?.entry === null
        ? [[...ring]]
        : [];
    }
    closedChains.push({ entry, pts, exit });
  }

  const crossings: Crossing[] = [];
  closedChains.forEach((c, ci) => {
    crossings.push({ y: c.entry[1], type: "entry", ci });
    crossings.push({ y: c.exit[1], type: "exit", ci });
  });
  crossings.sort((p, q) => p.y - q.y);
  const partner = new Map<string, Crossing>();
  for (let i = 0; i + 1 < crossings.length; i += 2) {
    const lower = crossings[i]!;
    const upper = crossings[i + 1]!;
    partner.set(`${lower.type}:${lower.ci}`, upper);
    partner.set(`${upper.type}:${upper.ci}`, lower);
  }

  const used = new Array<boolean>(closedChains.length).fill(false);
  const out: Point[][] = [];
  for (let start = 0; start < closedChains.length; start++) {
    if (used[start]) continue;
    const piece: Point[] = [];
    let ci = start;
    for (let guard = 0; guard <= closedChains.length; guard++) {
      used[ci] = true;
      const c = closedChains[ci]!;
      piece.push(c.entry, ...c.pts, c.exit);
      const next = partner.get(`exit:${ci}`);
      if (!next || next.type !== "entry") break;
      if (next.ci === start) break;
      ci = next.ci;
    }
    if (piece.length > 2) out.push(piece);
  }
  return out;
}

function fmt(n: number): number {
  return Math.round(n * 100) / 100;
}

function ringsToPath(rs: readonly (readonly Point[])[]): string {
  return rs
    .map((ring) => `M${ring.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L")}Z`)
    .join("");
}

function cutAll(keepLeft: boolean) {
  const font = opentype.parse(
    fs
      .readFileSync(path.join(PACKAGE_ROOT, FONTS_DIR, FONT_FILE))
      .buffer.slice(0),
  );
  const glyph = getGlyph(font, "R");
  const glyphRings = rings(glyph);

  const sign = Math.sign(
    signedArea(
      glyphRings.reduce((m, r) =>
        Math.abs(signedArea(r)) > Math.abs(signedArea(m)) ? r : m,
      ),
    ),
  );

  return glyphRings.flatMap((ring) =>
    cutRing(ring, keepLeft).map((pts) => ({
      pts,
      isCounter: Math.sign(signedArea(ring)) !== sign,
    })),
  );
}

function renderMark(
  cBlue: string,
  cYellow: string,
  cWhite: string,
  cInk: string,
): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    `<polygon points="0,0 ${TOP_X_PX},0 ${BOTTOM_X_PX},${DIMENSION_PX} 0,${DIMENSION_PX}" fill="${cBlue}"/>`,
    `<polygon points="${TOP_X_PX},0 ${DIMENSION_PX},0 ${DIMENSION_PX},${DIMENSION_PX} ${BOTTOM_X_PX},${DIMENSION_PX}" fill="${cYellow}"/>`,
    `<path d="${ringsToPath(cutAll(true).map(({ pts }) => pts))}" fill="${cWhite}"/>`,
    `<path d="${ringsToPath(cutAll(false).map(({ pts }) => pts))}" fill="${cInk}"/>`,
    `</svg>`,
  ].join("");
}

function renderStencil(color: string): string {
  const sign = Math.sign(
    // one-color mark, light = transparent: field quad with the white pieces
    // knocked out (counters restored), ink pieces filled; windings computed
    signedArea([
      [0, 0],
      [TOP_X_PX, 0],
      [BOTTOM_X_PX, DIMENSION_PX],
      [0, DIMENSION_PX],
    ]),
  );

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    `<path d="M0 0L${TOP_X_PX} 0L${BOTTOM_X_PX} ${DIMENSION_PX}L0 ${DIMENSION_PX}Z${ringsToPath(
      [...cutAll(true), ...cutAll(false)].map(({ pts, isCounter }) =>
        Math.sign(signedArea(pts)) === (isCounter ? sign : -sign)
          ? pts
          : [...pts].reverse(),
      ),
    )}" fill="${color}"/>`,
    `</svg>`,
  ].join("");
}

function renderClipReference(): string {
  const font = opentype.parse(
    fs
      .readFileSync(path.join(PACKAGE_ROOT, FONTS_DIR, FONT_FILE))
      .buffer.slice(0),
  );
  const glyph = getGlyph(font, "R");
  return [
    // independent clip-based construction, used only to verify the
    // flattening
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    `<defs>`,
    `<clipPath id="t">`,
    `<polygon points="0,0 ${TOP_X_PX},0 ${BOTTOM_X_PX},${DIMENSION_PX} 0,${DIMENSION_PX}"/>`,
    `</clipPath>`,
    `<clipPath id="u">`,
    `<polygon points="${TOP_X_PX},0 ${DIMENSION_PX},0 ${DIMENSION_PX},${DIMENSION_PX} ${BOTTOM_X_PX},${DIMENSION_PX}"/>`,
    `</clipPath>`,
    `</defs>`,
    `<rect width="${DIMENSION_PX}" height="${DIMENSION_PX}" fill="${toHexColor(COLOR.blue)}"/>`,
    `<polygon points="${TOP_X_PX},0 ${DIMENSION_PX},0 ${DIMENSION_PX},${DIMENSION_PX} ${BOTTOM_X_PX},${DIMENSION_PX}" fill="${toHexColor(COLOR.yellow)}"/>`,
    `<path d="${pathDataFull(glyph)}" fill="${toHexColor(COLOR.white)}" clip-path="url(#t)"/>`,
    `<path d="${pathDataFull(glyph)}" fill="${toHexColor(COLOR.ink)}" clip-path="url(#u)"/>`,
    `</svg>`,
  ].join("");
}

function pathDataFull({ commands }: Path): string {
  return commands
    .map((command) => {
      switch (command.type) {
        case "M":
          return `M${fmt(command.x)} ${fmt(command.y)}`;

        case "L":
          return `L${fmt(command.x)} ${fmt(command.y)}`;

        case "Q":
          return `Q${fmt(command.x1)} ${fmt(command.y1)} ${fmt(command.x)} ${fmt(command.y)}`;

        case "C":
          return `C${fmt(command.x1)} ${fmt(command.y1)} ${fmt(command.x2)} ${fmt(command.y2)} ${fmt(command.x)} ${fmt(command.y)}`;

        default:
          return "Z";
      }
    })
    .join("");
}

// lockup: mark + "remeda" wordmark in the same Sora 800
function lockupSvg(flatSvg: string, textColor: string): string {
  const font = opentype.parse(
    fs
      .readFileSync(path.join(PACKAGE_ROOT, FONTS_DIR, FONT_FILE))
      .buffer.slice(0),
  );

  const wordProbe = font.getPath("remeda", 0, 0, 100).getBoundingBox();
  const wSize = (250 / (wordProbe.y2 - wordProbe.y1)) * 100;
  const wb = font.getPath("remeda", 0, 0, wSize).getBoundingBox();
  const MARK_BOX = 430;
  const markX = 36;
  const textX = markX + MARK_BOX + 72 - wb.x1;
  const textY = 256 + (wb.y2 - wb.y1) / 2 - wb.y2;
  const wPath = pathDataFull(font.getPath("remeda", textX, textY, wSize));
  const width = Math.ceil(textX + wb.x2 - wb.x1 + 72);
  const scale = (MARK_BOX / DIMENSION_PX).toFixed(4);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${DIMENSION_PX}" viewBox="0 0 ${width} ${DIMENSION_PX}">`,
    `<g transform="translate(${markX},${(DIMENSION_PX - MARK_BOX) / 2}) scale(${scale})">`,
    flatSvg.replace(/<\/?svg[^>]*>/g, ""),
    `</g>`,
    `<path d="${wPath}" fill="${textColor}"/>`,
    `</svg>`,
  ].join("");
}

function renderNative(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg), { density: 72 })
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer();
}

function getGlyph(font: opentype.Font, char: string): Path {
  const { y1, y2 } = font.getPath(char, 0, 0, 100).getBoundingBox();
  const size = (250 / (y2 - y1)) * 100;
  const { x2, y2: y2b } = font.getPath(char, 0, 0, size).getBoundingBox();
  return font.getPath(char, 490 - x2, 486 - y2b, size);
}

function seamX(y: number): number {
  return TOP_X_PX + ((BOTTOM_X_PX - TOP_X_PX) * y) / DIMENSION_PX;
}

function toHex(x: number): string {
  return x.toString(16).padStart(2, "0");
}

function toHexColor([red, green, blue]: Color): `#${string}` {
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

// ENTRY POINT
await main();
