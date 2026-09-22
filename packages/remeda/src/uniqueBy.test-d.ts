import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { uniqueBy } from "./uniqueBy";

describe("callback data param", () => {
  test("lazily reconstructed in data-first", () => {
    uniqueBy([1, 2, 3] as const, (_item, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

      return 0;
    });
  });

  test("lazily reconstructed in data-last", () => {
    pipe(
      [1, 2, 3] as const,
      uniqueBy((_item, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return 0;
      }),
    );
  });
});
