/**
 * Regenerates the original "bridge" mark and lockup SVGs.
 *
 * This design was superseded by the peel mark (see packages/brand/), and is
 * archived here so the repository history preserves both the assets and the
 * exact construction. Winner parameters from the original exploration:
 * strong asymmetry (CX=358), corner radius 64, panel gap 46, Arimo R at 368.
 *
 * Usage (from the repo root):
 *   node packages/brand/archive-bridge/generate.cjs
 */
const opentype = require("opentype.js");
const fs = require("fs");
const path = require("path");

const font = opentype.parse(
  fs.readFileSync(path.join(__dirname, "fonts", "arimo.ttf")).buffer.slice(0),
);

const INK = "#1c1f26";
const BLUE = "#3178C6";
const YELLOW = "#F7DF1E";
const CX = 358;
const RAD = 64;
const GAP = 46;
const SIZE = 368;
const RBOTTOM = 476;

const bR = CX - GAP / 2;
const yL = CX + GAP / 2;
const blue = `M0,0 L${bR - RAD},0 Q${bR},0 ${bR},${RAD} L${bR},${512 - RAD} Q${bR},512 ${bR - RAD},512 L0,512 Z`;
const yellow = `M512,0 L${yL + RAD},0 Q${yL},0 ${yL},${RAD} L${yL},${512 - RAD} Q${yL},512 ${yL + RAD},512 L512,512 Z`;

const bb = font.getPath("R", 0, 0, SIZE).getBoundingBox();
const rPath = font
  .getPath("R", CX - (bb.x1 + bb.x2) / 2, RBOTTOM - bb.y2, SIZE)
  .toPathData(2);
const tiles = `<path d="${blue}" fill="${BLUE}"/><path d="${yellow}" fill="${YELLOW}"/>`;

const markSVG = (ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  tiles +
  `<path d="${rPath}" fill="${ink}"/></svg>`;

function lockup(ink) {
  const s = 170 / 512;
  const mx = 50;
  const my = (250 - 170) / 2;
  const word = font.getPath("remeda", 50 + 170 + 38, 170, 132).toPathData(2);
  const wordW = font.getAdvanceWidth("remeda", 132);
  const W = Math.round(50 + 170 + 38 + wordW + 50);
  const H = 250;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<g transform="translate(${mx},${my}) scale(${s})">` +
    tiles +
    `<path d="${rPath}" fill="${ink}"/></g>` +
    `<path d="${word}" fill="${ink}"/></svg>`
  );
}

fs.writeFileSync(path.join(__dirname, "remeda-mark-light.svg"), markSVG(INK));
fs.writeFileSync(
  path.join(__dirname, "remeda-mark-dark.svg"),
  markSVG("#FFFFFF"),
);
fs.writeFileSync(path.join(__dirname, "remeda-lockup-light.svg"), lockup(INK));
fs.writeFileSync(
  path.join(__dirname, "remeda-lockup-dark.svg"),
  lockup("#FFFFFF"),
);
console.log("wrote 4 bridge SVGs to brand/archive-bridge/");
