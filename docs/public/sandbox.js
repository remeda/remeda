import * as R from "https://esm.sh/remeda";

const NORMAL_STYLE = "font-family: sans-serif; font-size: 1rem";
const BOLD_STYLE =
  "font-family: sans-serif; font-size: 1.25rem; font-weight: 600";
// The console's default style is mono-spaced font...
const CODE_STYLE = "";

window.R = R;

console.log(
  "%cYou can try out %cRemeda%c right here via the global const %cR",
  NORMAL_STYLE,
  BOLD_STYLE,
  NORMAL_STYLE,
  BOLD_STYLE,
);
console.log("%ce.g. %cR.add(5, 10)", NORMAL_STYLE, CODE_STYLE);
