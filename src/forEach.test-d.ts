import { doNothing } from "./doNothing";
import { forEach } from "./forEach";
import { pipe } from "./pipe";

describe("typing", () => {
  it("doesn't return anything on dataFirst invocations", () => {
    const result = forEach([1, 2, 3], doNothing());
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- Intentionally
    expectTypeOf(result).toEqualTypeOf<void>();
  });

  it("passes the item type to the callback", () => {
    pipe(
      [1, 2, 3] as const,
      forEach((x) => {
        expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>();
      }),
    );
  });

  it("maintains the array shape", () => {
    const data = [1, "a"] as [1 | 2, "a" | "b", ...Array<boolean>];

    pipe(data, forEach(doNothing()), (x) => {
      expectTypeOf(x).toEqualTypeOf<[1 | 2, "a" | "b", ...Array<boolean>]>();
    });
  });

  it("makes the result mutable", () => {
    const data = [] as ReadonlyArray<number>;

    pipe(data, forEach(doNothing()), (x) => {
      expectTypeOf(x).toEqualTypeOf<Array<number>>();
    });
  });
});
