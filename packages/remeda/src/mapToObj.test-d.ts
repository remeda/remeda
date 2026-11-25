import { describe, expectTypeOf, test } from "vitest";
import { mapToObj } from "./mapToObj";
import { pipe } from "./pipe";

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(
      mapToObj([] as number[] | string[], (value) => [value, value]),
    ).toEqualTypeOf<Record<number | string, number | string>>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe(
        [] as number[] | string[],
        mapToObj((value) => [value, value]),
      ),
    ).toEqualTypeOf<Record<number | string, number | string>>();
  });
});
