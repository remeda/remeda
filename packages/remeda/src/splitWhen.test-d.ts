import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { splitWhen } from "./splitWhen";

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(
      splitWhen([] as number[] | string[], (value) => value === 0),
    ).toEqualTypeOf<[(number | string)[], (number | string)[]]>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe(
        [] as number[] | string[],
        splitWhen((value) => value === 0),
      ),
    ).toEqualTypeOf<[(number | string)[], (number | string)[]]>();
  });
});
