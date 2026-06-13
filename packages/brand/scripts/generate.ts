/* eslint-disable @typescript-eslint/no-non-null-assertion -- `noUncheckedIndexedAccess` is on, and the heavy random-access geometry below relies on non-null assertions for array indices it knows are present. */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- This script builds SVG path data and geometry by interpolating numeric coordinates into strings; that's the bulk of the work. */

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

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import opentype, { type Font, type Path } from "opentype.js";
import { map } from "remeda";
import sharp from "sharp";

// ---------------------- DEFINITION -------------------------------------------

type Color = readonly [red: number, green: number, blue: number];
type Point = readonly [x: number, y: number];

const DIMENSION_PX = 512;

const SEAM_TOP_POINT = [446, 0] satisfies Point;
const SEAM_BOTTOM_POINT = [286, DIMENSION_PX] satisfies Point;

const GLYPH_FONT = "sora-extrabold.ttf";
const GLYPH_HEIGHT_PX = 250;
const GLYPH_PADDING_RIGHT_PX = 22;
const GLYPH_PADDING_BOTTOM_PX = 26;

const COLOR = {
  // official TypeScript blue
  blue: [49, 120, 198],
  white: [255, 255, 255],

  // official JavaScript yellow
  yellow: [247, 223, 30],
  ink: [28, 31, 38],

  paper: [241, 245, 249],
} as const satisfies Readonly<Record<string, Color>>;

// -----------------------------------------------------------------------------

const BLUE_AREA_POLYGON = [
  [0, 0],
  SEAM_TOP_POINT,
  SEAM_BOTTOM_POINT,
  [0, DIMENSION_PX],
] satisfies readonly Point[];

const YELLOW_AREA_POLYGON = [
  SEAM_TOP_POINT,
  [DIMENSION_PX, 0],
  [DIMENSION_PX, DIMENSION_PX],
  SEAM_BOTTOM_POINT,
] satisfies readonly Point[];

const PACKAGE_ROOT = path.join(import.meta.dirname, "..");
const FONTS_DIR = "fonts";
const OUT_DIR = "assets";

// Probe at an arbitrary size to read the glyph's natural height, then rescale
// so it renders exactly GLYPH_HEIGHT_PX tall. The probe size cancels in the
// ratio, so its value is irrelevant as long as both uses match.
const PROBE_FONT_SIZE = 100;

type Chain = {
  entry: Point | undefined;
  pts: Point[];
  exit: Point | undefined;
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

  const flatInner = markInner(blueHex, yellowHex, whiteHex, inkHex);
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
  for (const [index, element] of color.entries()) {
    if (Math.abs(element - clipBased[index]!) > 24) {
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
  for (let index = 0; index < px; index++) {
    const r = color[3 * index]!;
    const g = color[3 * index + 1]!;
    const b = color[3 * index + 2]!;
    const expectDark =
      Math.min(
        distanceSquared(r, g, b, COLOR.blue),
        distanceSquared(r, g, b, COLOR.ink),
      ) <
      Math.min(
        distanceSquared(r, g, b, COLOR.yellow),
        distanceSquared(r, g, b, COLOR.white),
      );
    const isDark =
      mono[3 * index]! + mono[3 * index + 1]! + mono[3 * index + 2]! < 384;
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
  for (const [index, element] of stencil.entries()) {
    if (Math.abs(element - mono[index]!) > 24) {
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
    // eslint-disable-next-line unicorn/no-process-exit -- This is a CLI script, and a non-zero exit code is the correct way to signal that verification failed and nothing was written.
    process.exit(1);
  }

  write("remeda-mark.svg", flatSvg);
  write("remeda-mark-mono.svg", monoSvg);
  write("remeda-mark-mono-transparent.svg", stencilSvg);
  write("remeda-lockup-light.svg", lockupSvg(flatInner, inkHex));
  write(
    "remeda-lockup-dark.svg",
    lockupSvg(flatInner, toHexColor(COLOR.paper)),
  );
  console.log("wrote 5 SVGs to packages/brand/");
}

function write(filename: string, content: string): void {
  writeFileSync(path.join(PACKAGE_ROOT, OUT_DIR, filename), content);
}

function distanceSquared(r: number, g: number, b: number, c: Color): number {
  return (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
}

// ---------------- polygonize glyph (TTF quadratics), split into rings
function rings(otPath: Path): readonly Point[][] {
  const out: Point[][] = [];
  // every contour opens with an M command, which resets both of these
  let ring: Point[] = [];
  let current: Point = [0, 0];
  const SEG = 14;
  for (const c of otPath.commands) {
    switch (c.type) {
      case "M":
        if (ring.length > 2) out.push(ring);
        ring = [[c.x, c.y]];
        current = [c.x, c.y];

        break;

      case "L":
        ring.push([c.x, c.y]);
        current = [c.x, c.y];

        break;

      case "Q":
        for (let index = 1; index <= SEG; index++) {
          const t = index / SEG;
          const mt = 1 - t;
          ring.push([
            mt * mt * current[0] + 2 * mt * t * c.x1 + t * t * c.x,
            mt * mt * current[1] + 2 * mt * t * c.y1 + t * t * c.y,
          ]);
        }
        current = [c.x, c.y];

        break;

      case "C":
        for (let index = 1; index <= SEG; index++) {
          const t = index / SEG;
          const mt = 1 - t;
          ring.push([
            mt ** 3 * current[0] +
              3 * mt * mt * t * c.x1 +
              3 * mt * t * t * c.x2 +
              t ** 3 * c.x,
            mt ** 3 * current[1] +
              3 * mt * mt * t * c.y1 +
              3 * mt * t * t * c.y2 +
              t ** 3 * c.y,
          ]);
        }
        current = [c.x, c.y];

        break;

      case "Z":
        if (ring.length > 2) {
          out.push(ring);
          ring = [];
        }
        break;
    }
  }
  if (ring.length > 2) out.push(ring);
  return out;
}

function signedSeamOffset([x, y]: Point): number {
  return (
    x -
    (SEAM_TOP_POINT[0] +
      ((SEAM_BOTTOM_POINT[0] - SEAM_TOP_POINT[0]) * y) / DIMENSION_PX)
  );
}

function seamCrossingPoint(a: Point, b: Point): Point {
  const signedSeamOffsetA = signedSeamOffset(a);
  const signedSeamOffsetB = signedSeamOffset(b);
  const crossingFraction =
    signedSeamOffsetA / (signedSeamOffsetA - signedSeamOffsetB);
  return [
    a[0] + crossingFraction * (b[0] - a[0]),
    a[1] + crossingFraction * (b[1] - a[1]),
  ];
}

// Cut a simple ring by the seam, returning CLEAN separate rings per side.
// Chains of kept vertices are stitched via interior intervals along the
// seam: crossings sorted by y alternate interior/exterior, so consecutive
// pairs are the connectors. No Sutherland-Hodgman bridge edges.
function cutRing(ring: readonly Point[], keepLeft: boolean): Point[][] {
  const chains: Chain[] = [];
  let chain: Chain | undefined = undefined;
  let openedAtStart: Chain | undefined = undefined;
  for (let index = 0; index < ring.length; index++) {
    const a = ring[index]!;
    const b = ring[(index + 1) % ring.length]!;
    const ib = keepLeft ? signedSeamOffset(b) < 0 : signedSeamOffset(b) > 0;
    if (keepLeft ? signedSeamOffset(a) < 0 : signedSeamOffset(a) > 0) {
      if (chain === undefined) {
        chain = { entry: undefined, pts: [a], exit: undefined };
        if (index === 0) openedAtStart = chain;
      } else {
        chain.pts.push(a);
      }
      if (!ib) {
        chain.exit = seamCrossingPoint(a, b);
        chains.push(chain);
        chain = undefined;
      }
    } else if (ib) {
      chain = { entry: seamCrossingPoint(a, b), pts: [], exit: undefined };
    }
  }
  if (chain !== undefined) {
    if (openedAtStart !== undefined && openedAtStart !== chain) {
      openedAtStart.entry = chain.entry;
      openedAtStart.pts = [...chain.pts, ...openedAtStart.pts];
    } else if (chain.entry === undefined) {
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
    if (entry === undefined || exit === undefined) {
      return chains.length === 1 && chains[0]?.entry === undefined
        ? [[...ring]]
        : [];
    }
    closedChains.push({ entry, pts, exit });
  }

  const crossings: Crossing[] = [];
  for (const [ci, c] of closedChains.entries()) {
    crossings.push(
      { y: c.entry[1], type: "entry", ci },
      { y: c.exit[1], type: "exit", ci },
    );
  }
  crossings.sort((p, q) => p.y - q.y);
  const partner = new Map<string, Crossing>();
  for (let index = 0; index + 1 < crossings.length; index += 2) {
    const lower = crossings[index]!;
    const upper = crossings[index + 1]!;
    partner.set(`${lower.type}:${lower.ci}`, upper);
    partner.set(`${upper.type}:${upper.ci}`, lower);
  }

  const used = Array.from({ length: closedChains.length }).fill(false);
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
      if (next?.type !== "entry") break;
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

function cutAll(keepLeft: boolean): Point[][] {
  const font = loadFont();
  return rings(getGlyph(font, "R")).flatMap((ring) => cutRing(ring, keepLeft));
}

// The mark's interior (seam-split field plus the two glyph halves), without the
// enclosing <svg>. Kept separate so the lockup can drop it straight into a
// <g transform> alongside the wordmark instead of stripping a rendered <svg>.
function markInner(
  cBlue: string,
  cYellow: string,
  cWhite: string,
  cInk: string,
): string {
  return [
    `<polygon points="${toPolygonPoints(BLUE_AREA_POLYGON)}" fill="${cBlue}"/>`,
    `<polygon points="${toPolygonPoints(YELLOW_AREA_POLYGON)}" fill="${cYellow}"/>`,
    `<path d="${ringsToPath(cutAll(true))}" fill="${cWhite}"/>`,
    `<path d="${ringsToPath(cutAll(false))}" fill="${cInk}"/>`,
  ].join("");
}

function renderMark(
  cBlue: string,
  cYellow: string,
  cWhite: string,
  cInk: string,
): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    markInner(cBlue, cYellow, cWhite, cInk),
    `</svg>`,
  ].join("");
}

// One-color mark, light = transparent. The Sora "R" is built from overlapping
// contours (stem, bowl, leg), so the per-side pieces overlap each other. A
// single winding path would double-subtract in those overlaps and leak fill,
// so instead the two-tone construction is mirrored into a luminance mask
// where every piece fills solidly and overlaps union cleanly: the dark field
// and the ink pieces paint white (kept), the white pieces paint black
// (knocked out), and one ink rect shows through. Counters fall out for free
// as the regions no piece covers, exactly as they do in the two-tone mark.
function renderStencil(color: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    `<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="${DIMENSION_PX}" height="${DIMENSION_PX}">`,
    `<polygon points="${toPolygonPoints(BLUE_AREA_POLYGON)}" fill="#fff"/>`,
    `<path d="${ringsToPath(cutAll(true))}" fill="#000"/>`,
    `<path d="${ringsToPath(cutAll(false))}" fill="#fff"/>`,
    `</mask>`,
    `<rect width="${DIMENSION_PX}" height="${DIMENSION_PX}" fill="${color}" mask="url(#cut)"/>`,
    `</svg>`,
  ].join("");
}

function renderClipReference(): string {
  const font = loadFont();
  const glyph = getGlyph(font, "R");
  return [
    // independent clip-based construction, used only to verify the
    // flattening
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    `<defs>`,
    `<clipPath id="t">`,
    `<polygon points="${toPolygonPoints(BLUE_AREA_POLYGON)}"/>`,
    `</clipPath>`,
    `<clipPath id="u">`,
    `<polygon points="${toPolygonPoints(YELLOW_AREA_POLYGON)}"/>`,
    `</clipPath>`,
    `</defs>`,
    `<rect width="${DIMENSION_PX}" height="${DIMENSION_PX}" fill="${toHexColor(COLOR.blue)}"/>`,
    `<polygon points="${toPolygonPoints(YELLOW_AREA_POLYGON)}" fill="${toHexColor(COLOR.yellow)}"/>`,
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
function lockupSvg(markBody: string, textColor: string): string {
  const font = loadFont();

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
    markBody,
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

function loadFont(): Font {
  // `opentype.parse` needs the raw ArrayBuffer. A Node Buffer can be a view
  // into a larger pooled ArrayBuffer, so we slice out exactly this file's
  // bytes rather than handing over the whole backing store.
  const data = readFileSync(path.join(PACKAGE_ROOT, FONTS_DIR, GLYPH_FONT));
  return opentype.parse(
    data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
  );
}

function getGlyph(font: Font, char: string): Path {
  const probeBox = font.getPath(char, 0, 0, PROBE_FONT_SIZE).getBoundingBox();
  const effectiveSize =
    (GLYPH_HEIGHT_PX / (probeBox.y2 - probeBox.y1)) * PROBE_FONT_SIZE;

  const { x2: right, y2: bottom } = font
    .getPath(char, 0, 0, effectiveSize)
    .getBoundingBox();
  return font.getPath(
    char,
    DIMENSION_PX - GLYPH_PADDING_RIGHT_PX - right,
    DIMENSION_PX - GLYPH_PADDING_BOTTOM_PX - bottom,
    effectiveSize,
  );
}

function toHexColor(colors: Color): `#${string}` {
  return `#${colors.map((color) => color.toString(16 /* radix */).padStart(2, "0")).join("")}`;
}

function toPolygonPoints(coordinates: readonly Point[]): string {
  return coordinates.map(([x, y]) => `${x},${y}`).join(" ");
}

// ENTRY POINT
await main();
