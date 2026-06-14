import path from "node:path";

const PACKAGE_ROOT = path.join(import.meta.dirname, "..");
const ASSETS_DIR = "assets";

export const MARK_FILE = path.join(PACKAGE_ROOT, ASSETS_DIR, "remeda-mark.svg");
export const MONO_FILE = path.join(
  PACKAGE_ROOT,
  ASSETS_DIR,
  "remeda-mark-mono.svg",
);
export const STENCIL_FILE = path.join(
  PACKAGE_ROOT,
  ASSETS_DIR,
  "remeda-mark-mono-transparent.svg",
);
export const LOCKUP_LIGHT_FILE = path.join(
  PACKAGE_ROOT,
  ASSETS_DIR,
  "remeda-lockup-light.svg",
);
export const LOCKUP_DARK_FILE = path.join(
  PACKAGE_ROOT,
  ASSETS_DIR,
  "remeda-lockup-dark.svg",
);
