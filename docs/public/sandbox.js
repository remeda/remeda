import * as R from "https://esm.sh/remeda";

const SANS_SERIF = "font-family: sans-serif; font-size: 16px";
const MONOSPACE = "font-family: monospace; font-size: 16px";

window.R = R;

console.log(
  "%cYou can try out Remeda right here with the %cR%c global.",
  SANS_SERIF,
  MONOSPACE,
  SANS_SERIF,
);
console.log("%ce.g. %cR.add(5, 10)%c", SANS_SERIF, MONOSPACE, SANS_SERIF);
