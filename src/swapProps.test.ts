import { pipe } from "./pipe";
import { swapProps } from "./swapProps";

describe("runtime", () => {
  it("data-first", () => {
    expect(swapProps({ a: 1, b: 2 }, "a", "b")).toEqual({ a: 2, b: 1 });
  });

  it("data-last", () => {
    expect(pipe({ a: 1, b: 2 }, swapProps("a", "b"))).toEqual({ a: 2, b: 1 });
  });

  it("maintains the shape of the rest of the object", () => {
    expect(swapProps({ a: true, b: "hello", c: 3 }, "a", "b")).toEqual({
      a: "hello",
      b: true,
      c: 3,
    });
  });
});

describe("typing", () => {
  it("protects against invalid prop names", () => {
    // @ts-expect-error [ts2345] - Argument of type '"c"' is not assignable to parameter of type '"a" | "b"'.
    swapProps({ a: 1, b: 2 }, "a", "c");
  });
});
