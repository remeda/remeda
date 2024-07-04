import * as R from "https://esm.sh/remeda";

const NOTICE = "font-family: sans-serif; font-size: 16px";
const CODE = "font-family: monospace; font-size: 16px; font-weight: 500";

window.R = R;

console.log(
  "%cYou can try out Remeda right here with the %cR%c global.",
  NOTICE,
  CODE,
  NOTICE,
);
console.log("%ce.g. %cR.add(5, 10)%c", NOTICE, CODE, NOTICE);
