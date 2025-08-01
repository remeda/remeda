import { describe, expectTypeOf, test } from "vitest";
import { conditional } from "./conditional";
import { constant } from "./constant";
import { firstBy } from "./firstBy";
import { isNonNullish } from "./isNonNullish";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("data-first", () => {
  test("narrows types in the transformers", () => {
    const data = 3 as number | string;

    conditional(
      data,
      [
        isString,
        (str) => {
          expectTypeOf(str).toEqualTypeOf<string>();
        },
      ],
      [
        isNumber,
        (num) => {
          expectTypeOf(num).toEqualTypeOf<number>();
        },
      ],
      [
        isNullish,
        (impossible) => {
          expectTypeOf(impossible).toEqualTypeOf<never>();
        },
      ],
      [
        isNonNullish,
        (x) => {
          expectTypeOf(x).toEqualTypeOf<number | string>();
        },
      ],
      [
        (x): x is 3 => x === 3,
        (x) => {
          expectTypeOf(x).toEqualTypeOf<3>();
        },
      ],
    );
  });

  // https://github.com/remeda/remeda/issues/675
  test("narrows types when using `isNullish`/`isNonNullish` with complex data", () => {
    const data = firstBy(
      [{ x: 10 }, { x: 20 }] as Array<{ x: number }>,
      prop("x"),
    );

    conditional(
      data,
      [
        isNullish,
        (x) => {
          expectTypeOf(x).toEqualTypeOf<undefined>();
        },
      ],
      [
        isNonNullish,
        (x) => {
          expectTypeOf(x).toEqualTypeOf<{
            x: number;
          }>();
        },
      ],
    );
  });

  test("passes the trivial defaultCase's type to the output", () => {
    expectTypeOf(
      conditional(
        "Jokic",
        [isString, () => "hello" as const],
        constant(undefined),
      ),
    ).toEqualTypeOf<"hello" | undefined>();

    expectTypeOf(
      conditional(
        "Jokic",
        [isString, () => "hello" as const],
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- It's safe to delete this check once defaultCase is removed, the check above does the same thing.
        conditional.defaultCase(),
      ),
    ).toEqualTypeOf<"hello" | undefined>();
  });

  test("passes the defaultCase's type to the output", () => {
    expectTypeOf(
      conditional("Jokic", [isString, () => "hello" as const], constant(123)),
    ).toEqualTypeOf<"hello" | 123>();

    expectTypeOf(
      conditional(
        "Jokic",
        [isString, () => "hello" as const],
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- It's safe to delete this check once defaultCase is removed, the check above does the same thing.
        conditional.defaultCase(() => 123 as const),
      ),
    ).toEqualTypeOf<"hello" | 123>();
  });
});

describe("data-last", () => {
  test("narrows types in the transformers", () => {
    const data = 3 as number | string;

    pipe(
      data,
      conditional(
        [
          isString,
          (str) => {
            expectTypeOf(str).toEqualTypeOf<string>();
          },
        ],
        [
          isNumber,
          (num) => {
            expectTypeOf(num).toEqualTypeOf<number>();
          },
        ],
        [
          isNullish,
          (impossible) => {
            expectTypeOf(impossible).toEqualTypeOf<never>();
          },
        ],
        [
          isNonNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<number | string>();
          },
        ],
        [
          (x): x is 3 => x === 3,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<3>();
          },
        ],
      ),
    );
  });

  // https://github.com/remeda/remeda/issues/675
  test("narrows types when using `isNullish`/`isNonNullish` with complex data", () => {
    pipe(
      [{ x: 10 }, { x: 20 }],
      firstBy(prop("x")),
      conditional(
        [
          isNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<undefined>();
          },
        ],
        [
          isNonNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<{
              x: number;
            }>();
          },
        ],
      ),
    );
  });

  test("passes the trivial defaultCase's type to the output", () => {
    expectTypeOf(
      pipe(
        "Jokic",
        conditional([isString, () => "hello" as const], constant(undefined)),
      ),
    ).toEqualTypeOf<"hello" | undefined>();

    expectTypeOf(
      pipe(
        "Jokic",
        conditional(
          [isString, () => "hello" as const],
          // eslint-disable-next-line @typescript-eslint/no-deprecated -- It's safe to delete this check once defaultCase is removed, the check above does the same thing.
          conditional.defaultCase(),
        ),
      ),
    ).toEqualTypeOf<"hello" | undefined>();
  });

  test("passes the defaultCase's type to the output", () => {
    expectTypeOf(
      pipe(
        "Jokic",
        conditional([isString, () => "hello" as const], constant(123)),
      ),
    ).toEqualTypeOf<"hello" | 123>();

    expectTypeOf(
      pipe(
        "Jokic",
        conditional(
          [isString, () => "hello" as const],
          // eslint-disable-next-line @typescript-eslint/no-deprecated -- It's safe to delete this check once defaultCase is removed, the check above does the same thing.
          conditional.defaultCase(() => 123 as const),
        ),
      ),
    ).toEqualTypeOf<"hello" | 123>();
  });
});
