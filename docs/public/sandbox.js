import * as R from "https://esm.sh/remeda";

window.R = R;

const sansSerif = "font-family: sans-serif; font-size: 16px";
const monospace = "font-family: monospace; font-size: 16px";

console.log(
  "%cYou can use Remeda with the %cR%c global.",
  sansSerif,
  monospace,
  sansSerif,
);
console.log(
  "%cTry typing %cR.add(5, 10)%c here:",
  sansSerif,
  monospace,
  sansSerif,
);
