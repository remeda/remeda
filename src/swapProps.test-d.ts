import { swapProps } from "./swapProps";

it("protects against invalid prop names", () => {
  // @ts-expect-error [ts2345] - Argument of type '"c"' is not assignable to parameter of type '"a" | "b"'.
  swapProps({ a: 1, b: 2 }, "a", "c");
});
