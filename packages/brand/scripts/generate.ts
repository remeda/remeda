/**
 * Regenerates the remeda mark and lockup SVGs from first principles.
 *
 * The mark is fully parametric: the "R" is polygonized, cut by the seam, and
 * re-stitched into clean per-side pieces, then every output is pixel-verified
 * against an independent clip-based construction at native resolution.
 *
 * Usage (from the repo root):
 *   npm run generate -w @remeda/brand
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions -- This is fine for a script */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import opentype, { type Font, type Path } from "opentype.js";
import { map } from "remeda";
import sharp from "sharp";
import {
  LOCKUP_DARK_FILE,
  LOCKUP_LIGHT_FILE,
  MARK_FILE,
  MONO_FILE,
  STENCIL_FILE,
} from "./config.ts";
import {
  COLOR,
  DIMENSION_PX,
  GLYPH_FONT,
  GLYPH_HEIGHT_PX,
  GLYPH_PADDING_BOTTOM_PX,
  GLYPH_PADDING_RIGHT_PX,
  SEAM_BOTTOM_POINT,
  SEAM_TOP_POINT,
  type Color,
  type Point,
} from "./spec.ts";

const FONTS_DIR = path.join(import.meta.dirname, "..", "fonts");

// Our computations assume the seam creates two right trapezoids. This means we
// will have two points on y=0 and two on y=DIMENSION_PX
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

// Probe at an arbitrary size to read the glyph's natural height, then rescale
// so it renders exactly GLYPH_HEIGHT_PX tall.
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

async function main(): Promise<number> {
  const blueHex = toHexColor(COLOR.blue);
  const yellowHex = toHexColor(COLOR.yellow);
  const inkHex = toHexColor(COLOR.ink);
  const whiteHex = toHexColor(COLOR.white);

  const colorLogo = renderLogo(blueHex, yellowHex, whiteHex, inkHex);
  const colorSvg = renderSvg(colorLogo);
  const monoSvg = renderSvg(renderLogo(inkHex, whiteHex, whiteHex, inkHex));
  const stencilSvg = renderSvg(...renderStencil(inkHex));
  const referenceSvg = renderSvg(...renderClipReference());

  const isInvalid = await validate(colorSvg, monoSvg, stencilSvg, referenceSvg);
  if (isInvalid) {
    console.error("verification failed; SVGs not written");
    return 1;
  }

  writeFileSync(MARK_FILE, colorSvg);
  writeFileSync(MONO_FILE, monoSvg);
  writeFileSync(STENCIL_FILE, stencilSvg);
  writeFileSync(LOCKUP_LIGHT_FILE, lockupSvg(colorLogo, inkHex));
  writeFileSync(
    LOCKUP_DARK_FILE,
    lockupSvg(colorLogo, toHexColor(COLOR.paper)),
  );

  console.log("wrote 5 SVGs to packages/brand/");

  return 0;
}

async function validate(
  colorSvg: string,
  monoSvg: string,
  stencilSvg: string,
  referenceSvg: string,
): Promise<boolean> {
  const [colorRender, monoRender, stencilRender, referenceRender] =
    await Promise.all(
      map(
        [colorSvg, monoSvg, stencilSvg, referenceSvg],
        async (path) =>
          await sharp(Buffer.from(path), { density: 72 })
            .flatten({ background: "#ffffff" })
            .raw()
            .toBuffer(),
      ),
    );

  let differingBytes = 0;
  for (const [index, element] of colorRender.entries()) {
    if (Math.abs(element - referenceRender[index]!) > 24) {
      differingBytes++;
    }
  }

  let mismatches = 0;
  const px = colorRender.length / 3;
  for (let index = 0; index < px; index++) {
    const r = colorRender[3 * index]!;
    const g = colorRender[3 * index + 1]!;
    const b = colorRender[3 * index + 2]!;
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
      monoRender[3 * index]! +
        monoRender[3 * index + 1]! +
        monoRender[3 * index + 2]! <
      384;
    if (expectDark !== isDark) {
      mismatches++;
    }
  }

  let divergentBytes = 0;
  for (const [index, element] of stencilRender.entries()) {
    if (Math.abs(element - monoRender[index]!) > 24) {
      divergentBytes++;
    }
  }

  let isInvalid = false;
  for (const { name, ratio, budget } of [
    {
      name: "flatten vs clip reference",
      ratio: differingBytes / colorRender.length,
      budget: 0.002,
    },
    {
      name: "mono vs color flattening rule",
      ratio: mismatches / px,
      budget: 0.002,
    },
    {
      name: "mono-transparent vs two-tone mono",
      ratio: divergentBytes / stencilRender.length,
      budget: 0.01,
    },
  ]) {
    const isOk = ratio <= budget;
    if (!isOk) {
      isInvalid = true;
    }

    console.log(
      `${isOk ? "ok  " : "FAIL"} ${name}: ${(ratio * 100).toFixed(3)}% (budget ${budget * 100}%)`,
    );
  }

  return isInvalid;
}

function distanceSquared(r: number, g: number, b: number, c: Color): number {
  return (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
}

// polygonize glyph (TTF quadratics), split into rings
function rings(otPath: Path): (readonly Point[])[] {
  const out: (readonly Point[])[] = [];
  // every contour opens with an M command, which resets both of these
  let ring: Point[] = [];
  let current: Point = [0, 0];
  const SEG = 14;
  for (const c of otPath.commands) {
    switch (c.type) {
      case "M":
        if (ring.length > 2) {
          out.push(ring);
        }
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

  if (ring.length > 2) {
    out.push(ring);
  }

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
function cutRing(
  ring: readonly Point[],
  keepLeft: boolean,
): (readonly Point[])[] {
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
        if (index === 0) {
          openedAtStart = chain;
        }
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
  if (chains.length === 0) {
    return [];
  }
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
    if (used[start]) {
      continue;
    }
    const piece: Point[] = [];
    let ci = start;
    for (let guard = 0; guard <= closedChains.length; guard++) {
      used[ci] = true;
      const c = closedChains[ci]!;
      piece.push(c.entry, ...c.pts, c.exit);
      const next = partner.get(`exit:${ci}`);
      if (next?.type !== "entry") {
        break;
      }
      if (next.ci === start) {
        break;
      }
      ci = next.ci;
    }
    if (piece.length > 2) {
      out.push(piece);
    }
  }
  return out;
}

function roundToHundredths(value: number): number {
  return Math.round(value * 100) / 100;
}

function ringsToPath(rs: readonly (readonly Point[])[]): string {
  return rs
    .map(
      (ring) =>
        `M${ring.map(([x, y]) => `${roundToHundredths(x)} ${roundToHundredths(y)}`).join("L")}Z`,
    )
    .join("");
}

function cutAll(keepLeft: boolean): (readonly Point[])[] {
  const font = loadFont();
  const glyph = getGlyph(font, "R");
  return rings(glyph).flatMap((ring) => cutRing(ring, keepLeft));
}

function renderLogo(
  cBlue: string,
  cYellow: string,
  cWhite: string,
  cInk: string,
): string {
  return [
    `<rect width="${DIMENSION_PX}" height="${DIMENSION_PX}" fill="${cYellow}"/>`,
    `<polygon points="${toPolygonPoints(BLUE_AREA_POLYGON)}" fill="${cBlue}"/>`,
    `<path d="${ringsToPath(cutAll(true))}" fill="${cWhite}"/>`,
    `<path d="${ringsToPath(cutAll(false))}" fill="${cInk}"/>`,
  ].join("");
}

function renderStencil(color: string): string[] {
  return [
    `<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="${DIMENSION_PX}" height="${DIMENSION_PX}">`,
    `<polygon points="${toPolygonPoints(BLUE_AREA_POLYGON)}" fill="#fff"/>`,
    `<path d="${ringsToPath(cutAll(true))}" fill="#000"/>`,
    `<path d="${ringsToPath(cutAll(false))}" fill="#fff"/>`,
    `</mask>`,
    `<rect width="${DIMENSION_PX}" height="${DIMENSION_PX}" fill="${color}" mask="url(#cut)"/>`,
  ];
}

// independent clip-based construction, used only to verify the
// flattening
function renderClipReference(): string[] {
  const font = loadFont();
  const glyph = getGlyph(font, "R");
  return [
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
  ];
}

function renderSvg(...body: readonly string[]): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DIMENSION_PX}" height="${DIMENSION_PX}" viewBox="0 0 ${DIMENSION_PX} ${DIMENSION_PX}">`,
    ...body,
    `</svg>`,
  ].join("");
}

function pathDataFull({ commands }: Path): string {
  return commands
    .map((command) => {
      switch (command.type) {
        case "M":
          return `M${roundToHundredths(command.x)} ${roundToHundredths(command.y)}`;

        case "L":
          return `L${roundToHundredths(command.x)} ${roundToHundredths(command.y)}`;

        case "Q":
          return `Q${roundToHundredths(command.x1)} ${roundToHundredths(command.y1)} ${roundToHundredths(command.x)} ${roundToHundredths(command.y)}`;

        case "C":
          return `C${roundToHundredths(command.x1)} ${roundToHundredths(command.y1)} ${roundToHundredths(command.x2)} ${roundToHundredths(command.y2)} ${roundToHundredths(command.x)} ${roundToHundredths(command.y)}`;

        default:
          return "Z";
      }
    })
    .join("");
}

// lockup: mark + "remeda" wordmark in the same font
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

function loadFont(): Font {
  const fontPath = path.join(FONTS_DIR, GLYPH_FONT);
  const { buffer, byteOffset, byteLength } = readFileSync(fontPath);

  // `opentype.parse` needs the raw ArrayBuffer. A Node Buffer can be a view
  // into a larger pooled ArrayBuffer, so we slice out exactly this file's
  // bytes rather than handing over the whole backing store.
  const fontData = buffer.slice(byteOffset, byteOffset + byteLength);

  return opentype.parse(fontData);
}

function getGlyph(font: Font, char: string): Path {
  const { y1: probeTop, y2: probeBottom } = font
    .getPath(char, 0, 0, PROBE_FONT_SIZE)
    .getBoundingBox();

  const effectiveSize =
    (GLYPH_HEIGHT_PX / (probeBottom - probeTop)) * PROBE_FONT_SIZE;

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
exit(await main());
