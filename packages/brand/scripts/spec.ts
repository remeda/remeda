export type Color = readonly [red: number, green: number, blue: number];
export type Point = readonly [x: number, y: number];

export const DIMENSION_PX = 512;

export const SEAM_TOP_POINT = [446, 0] satisfies Point;
export const SEAM_BOTTOM_POINT = [286, DIMENSION_PX] satisfies Point;

export const GLYPH_FONT = "sora-extrabold.ttf";
export const GLYPH_HEIGHT_PX = 250;
export const GLYPH_PADDING_RIGHT_PX = 22;
export const GLYPH_PADDING_BOTTOM_PX = 26;

export const COLOR = {
  // official TypeScript blue
  blue: [49, 120, 198],
  white: [255, 255, 255],

  // official JavaScript yellow
  yellow: [247, 223, 30],
  ink: [28, 31, 38],

  paper: [241, 245, 249],
} as const satisfies Readonly<Record<string, Color>>;
