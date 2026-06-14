export type Color = readonly [red: number, green: number, blue: number];
export type Point = readonly [x: number, y: number];

export const DIMENSION_PX = 512;

export const SEAM_TOP_POINT = [391, 0] satisfies Point;
export const SEAM_BOTTOM_POINT = [316, DIMENSION_PX] satisfies Point;

export const GLYPH = "R";
export const GLYPH_FONT = "sora-bold.ttf";
export const GLYPH_HEIGHT_PX = 285;
export const GLYPH_PADDING_RIGHT_PX = 28;
export const GLYPH_PADDING_BOTTOM_PX = 28;

export const WORDMARK = "Remeda";

// Lockup layout: the mark sits in a square this size, with LOCKUP_PAD_PX of
// breathing room on every outer edge and LOCKUP_GAP_PX between mark and
// wordmark.
export const LOCKUP_MARK_BOX_PX = 430;
export const LOCKUP_PAD_PX = 36;
export const LOCKUP_GAP_PX = 88;

export const COLOR = {
  // official TypeScript blue
  blue: [49, 120, 198],
  white: [255, 255, 255],

  // official JavaScript yellow
  yellow: [247, 223, 30],
  ink: [28, 31, 38],

  paper: [241, 245, 249],
} as const satisfies Readonly<Record<string, Color>>;
