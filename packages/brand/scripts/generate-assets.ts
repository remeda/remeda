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
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PACKAGE_ROOT = path.join(import.meta.dirname, "..");

const MARK = path.join(PACKAGE_ROOT, "assets", "remeda-mark.svg");
const LOCKUP_LIGHT = path.join(
  PACKAGE_ROOT,
  "assets",
  "remeda-lockup-light.svg",
);
const DOCS_PUBLIC = path.join(PACKAGE_ROOT, "..", "docs", "public");
const DIST = path.join(PACKAGE_ROOT, "dist");
fs.mkdirSync(DIST, { recursive: true });

const renderMark = (size: number): Promise<Buffer> =>
  sharp(fs.readFileSync(MARK), { density: 300 })
    .resize(size, size)
    .png()
    .toBuffer();

// .ico container with embedded PNGs (valid since Windows Vista)
function buildIco(pngs: ReadonlyArray<{ size: number; buf: Buffer }>): Buffer {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * count;
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
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

// wide social/OG canvas: the lockup centered on white
async function socialCanvas(
  width: number,
  height: number,
  file: string,
): Promise<void> {
  const lockup = await sharp(fs.readFileSync(LOCKUP_LIGHT), { density: 300 })
    .resize({ width: Math.round(width * 0.72) })
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

// --- docs site (served from packages/docs/public/) ---
fs.copyFileSync(MARK, path.join(DOCS_PUBLIC, "favicon.svg"));
const icoPngs: Array<{ size: number; buf: Buffer }> = [];
for (const size of [16, 32, 48]) {
  icoPngs.push({ size, buf: await renderMark(size) });
}
fs.writeFileSync(path.join(DOCS_PUBLIC, "favicon.ico"), buildIco(icoPngs));
fs.writeFileSync(
  path.join(DOCS_PUBLIC, "apple-touch-icon.png"),
  await renderMark(180),
);
await socialCanvas(1200, 630, path.join(DOCS_PUBLIC, "og.png"));

// --- manually uploaded surfaces (brand/dist/) ---
fs.writeFileSync(path.join(DIST, "github-avatar.png"), await renderMark(1024));
// padded variant for circle-cropping contexts (the letter sits near the
// bottom-right corner of the full-bleed tile)
const inner = await renderMark(880);
await sharp({
  create: { width: 1024, height: 1024, channels: 3, background: "#ffffff" },
})
  .composite([{ input: inner, left: 72, top: 72 }])
  .png()
  .toFile(path.join(DIST, "github-avatar-padded.png"));
await socialCanvas(1280, 640, path.join(DIST, "github-social-preview.png"));

console.log("docs: favicon.svg, favicon.ico, apple-touch-icon.png, og.png");
console.log(
  "dist: github-avatar.png, github-avatar-padded.png, github-social-preview.png",
);
