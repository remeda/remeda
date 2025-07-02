import { expectTypeOf, it } from "vitest";
import { filter } from "./filter";
import { map } from "./map";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { tap } from "./tap";

it("should work in the middle of pipe sequence", () => {
  pipe(
    [-1, 2],
    filter((n) => n > 0),
    tap((data) => {
      expectTypeOf(data).toEqualTypeOf<Array<number>>();
    }),
    map(multiply(2)),
  );
});

it("should infer types after tapping function reference with parameter type any", () => {
  pipe(
    [-1, 2],
    filter((n) => n > 0),
    tap(foo),
    map((n) => {
      expectTypeOf(n).toEqualTypeOf<number>();

      return n * 2;
    }),
  );
});

// (same as console.log)
function foo(x: unknown): unknown {
  return x;
}
