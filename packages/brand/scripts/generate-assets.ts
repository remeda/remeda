/**
 * Generates every raster surface asset from the brand SVGs.
 *
 * Repo-consumed outputs are written directly into packages/docs/public/;
 * manually-uploaded surfaces (GitHub org avatar, repo social preview) land
 * in packages/brand/dist/. See README.md for the full surface inventory.
 *
 * Usage (from the repo root):
 *   npm run assets -w @remeda/brand
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { LOCKUP_DARK_FILE, LOCKUP_LIGHT_FILE, MARK_FILE } from "./config.ts";

type Image = {
  readonly size: number;
  readonly buf: Buffer;
};

type Dimensions = {
  readonly width: number;
  readonly height: number;
};

const DIST_DIR = path.join(import.meta.dirname, "..", "dist");
const OUT_GITHUB_AVATAR = "github-avatar.png";
const OUT_GITHUB_SOCIAL_PREVIEW = "github-social-preview.png";
const OUT_GITHUB_PADDED = "github-avatar-padded.png";

const DOCS_PUBLIC = path.join(
  import.meta.dirname,
  "..",
  "..",
  "docs",
  "public",
);
const DOCS_SVG_FAVICON = "favicon.svg";
const DOCS_ICO_FAVICON = "favicon.ico";
const DOCS_APPLE_FAVICON = "apple-touch-icon.png";
const DOCS_OG = "og.png";
// The nav header swaps between the two by theme; both are live surfaces.
const DOCS_LOCKUP_LIGHT = "remeda-lockup-light.svg";
const DOCS_LOCKUP_DARK = "remeda-lockup-dark.svg";

const ICON_SIZES = [16, 32, 48] as const;

const MARK_OPTIONS = {
  density: 300,
} as const satisfies sharp.SharpOptions;

const SOCIAL_CANVAS_OPTIONS = {
  density: 300,
} as const satisfies sharp.SharpOptions;
const SOCIAL_CANVAS_RESIZE_FACTOR = 0.72;

const DOCS_SITE_SOCIAL_CANVAS_DIMENSIONS = {
  width: 1200,
  height: 630,
} satisfies Dimensions;

const GITHUB_SOCIAL_CANVAS_DIMENSIONS = {
  width: 1280,
  height: 640,
} satisfies Dimensions;

async function main(): Promise<void> {
  await Promise.all([injectDocumentationSiteAssets(), generateGithubAssets()]);
}

// --- docs site (served from packages/docs/public/) ---
async function injectDocumentationSiteAssets(): Promise<void> {
  copyFileSync(MARK_FILE, path.join(DOCS_PUBLIC, DOCS_SVG_FAVICON));
  copyFileSync(LOCKUP_LIGHT_FILE, path.join(DOCS_PUBLIC, DOCS_LOCKUP_LIGHT));
  copyFileSync(LOCKUP_DARK_FILE, path.join(DOCS_PUBLIC, DOCS_LOCKUP_DARK));

  const icoPngs = await Promise.all(
    ICON_SIZES.map(
      async (size) => ({ size, buf: await renderMark(size) }) satisfies Image,
    ),
  );
  const ico = buildIco(icoPngs);

  writeFileSync(path.join(DOCS_PUBLIC, DOCS_ICO_FAVICON), ico);
  writeFileSync(
    path.join(DOCS_PUBLIC, DOCS_APPLE_FAVICON),
    await renderMark(180),
  );
  await socialCanvas(
    DOCS_SITE_SOCIAL_CANVAS_DIMENSIONS,
    path.join(DOCS_PUBLIC, DOCS_OG),
  );

  console.log(
    `docs: ${[DOCS_SVG_FAVICON, DOCS_LOCKUP_LIGHT, DOCS_LOCKUP_DARK, DOCS_ICO_FAVICON, DOCS_APPLE_FAVICON, DOCS_OG].join(", ")}`,
  );
}

// --- manually uploaded surfaces (brand/dist/) ---
async function generateGithubAssets(): Promise<void> {
  mkdirSync(DIST_DIR, { recursive: true });

  const [avatar, inner] = await Promise.all([
    renderMark(1024),
    // padded variant for circle-cropping contexts (the letter sits near the
    // bottom-right corner of the full-bleed tile)
    renderMark(880),
    socialCanvas(
      GITHUB_SOCIAL_CANVAS_DIMENSIONS,
      path.join(DIST_DIR, OUT_GITHUB_SOCIAL_PREVIEW),
    ),
  ]);

  writeFileSync(path.join(DIST_DIR, OUT_GITHUB_AVATAR), avatar);

  await sharp({
    create: { width: 1024, height: 1024, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: inner, left: 72, top: 72 }])
    .png()
    .toFile(path.join(DIST_DIR, OUT_GITHUB_PADDED));

  console.log(
    `dist: ${[OUT_GITHUB_AVATAR, OUT_GITHUB_PADDED, OUT_GITHUB_SOCIAL_PREVIEW].join(", ")}`,
  );
}

async function renderMark(size: number): Promise<Buffer> {
  const mark = readFileSync(MARK_FILE);
  return await sharp(mark, MARK_OPTIONS).resize(size, size).png().toBuffer();
}

// .ico container with embedded PNGs (valid since Windows Vista)
function buildIco(pngs: readonly Image[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map(({ buf }) => buf)]);
}

// wide social/OG canvas: the lockup centered on white
async function socialCanvas(
  { width, height }: Dimensions,
  file: string,
): Promise<void> {
  const lockup = await sharp(
    readFileSync(LOCKUP_LIGHT_FILE),
    SOCIAL_CANVAS_OPTIONS,
  )
    .resize({ width: Math.round(width * SOCIAL_CANVAS_RESIZE_FACTOR) })
    .png()
    .toBuffer();

  const meta = await sharp(lockup).metadata();
  await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .composite([
      {
        input: lockup,
        left: Math.round((width - meta.width) / 2),
        top: Math.round((height - meta.height) / 2),
      },
    ])
    .png()
    .toFile(file);
}

// ENTRY POINT
await main();
