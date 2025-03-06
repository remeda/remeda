import { purry } from "./purry";

function dataFirst(data: number, arg2: bigint, arg3: boolean): string {
  return `${data} ${arg2} ${arg3}`;
}

describe("purry", () => {
  it("works with data first", () => {
    expectTypeOf(purry(dataFirst, [1, 2n, true])).toEqualTypeOf<string>();
  });

  it("works with data last", () => {
    expectTypeOf(purry(dataFirst, [2n, true])(1)).toEqualTypeOf<string>();
  });

  it("works with ambiguous arguments", () => {
    const args = [] as unknown as [number, bigint, boolean] | [bigint, boolean];
    const result = purry(dataFirst, args);

    expectTypeOf(result).toEqualTypeOf<string | ((Data: number) => string)>();

    if (typeof result === "function") {
      expectTypeOf(result(1)).toEqualTypeOf<string>();
    } else {
      expectTypeOf(result).toEqualTypeOf<string>();
    }
  });

  it("works with unknown arguments", () => {
    const result = purry(dataFirst, []);

    expectTypeOf(result).toEqualTypeOf<unknown>();
  });
});
