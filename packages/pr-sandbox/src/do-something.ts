import * as R from "remeda";

const DATA = ["a", "b", "c"];

export function doSomething() {
  return R.map(DATA, R.toUpperCase());
}
