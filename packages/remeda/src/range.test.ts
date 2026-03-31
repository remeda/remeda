import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { range } from "./range";
import { map } from "./map";
import { mapValues } from "./mapValues";

describe("trivial 0 cases", () => {
  test("start at 0", () => {
    expect(range(0, 5)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("end at 0", () => {
    expect(range(5, 0)).toStrictEqual([]);
  });

  test("empty range", () => {
    expect(range(0, 0)).toStrictEqual([]);
  });

  test("step 0", () => {
    expect(() => range(0, { end: 5, step: 0 })).toThrow(RangeError);
  });
});

test("simple range", () => {
  expect(range(10, 20)).toStrictEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
});

test("switched bounds", () => {
  expect(range(20, 1)).toStrictEqual([]);
});

describe("data last", () => {
  test("simple range", () => {
    expect(pipe(1, range(5))).toStrictEqual([1, 2, 3, 4]);
  });

  test("with step", () => {
    expect(pipe(1, range({ end: 20, step: 5 }))).toStrictEqual([1, 6, 11, 16]);
  });
});

describe("positive step", () => {
  test("trivial step", () => {
    expect(range(1, { end: 5, step: 1 })).toStrictEqual([1, 2, 3, 4]);
  });

  test("simple step", () => {
    expect(range(1, { end: 20, step: 5 })).toStrictEqual([1, 6, 11, 16]);
  });

  test("step larger than range", () => {
    expect(range(1, { end: 5, step: 100 })).toStrictEqual([1]);
  });

  test("step exactly divides range", () => {
    expect(range(0, { end: 10, step: 5 })).toStrictEqual([0, 5]);
  });
});

describe("negative step", () => {
  test("trivial step", () => {
    expect(range(5, { end: 0, step: -1 })).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("simple decrementing range", () => {
    expect(range(20, { end: 1, step: -5 })).toStrictEqual([20, 15, 10, 5]);
  });

  test("step in wrong direction", () => {
    expect(range(1, { end: 20, step: -5 })).toStrictEqual([]);
  });
});

describe("non-integer inputs", () => {
  test("floating-point start", () => {
    expect(range(0.5, 5)).toStrictEqual([0.5, 1.5, 2.5, 3.5, 4.5]);
  });

  test("floating-point step", () => {
    expect(range(1, { end: 5, step: 0.5 })).toStrictEqual([
      1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5,
    ]);
  });

  test("floating-point end", () => {
    expect(range(1, 5.5)).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe("lodash spec", () => {
  // @see https://github.com/lodash/lodash/blob/main/test/test.js#L18652-L18749

  test.fails(
    "should infer the sign of `step` when only `end` is given",
    //=> Calling `range` with a single parameter results in the data-last version of `range` being returned.
    () => {
      expect(range(4)).toStrictEqual([0, 1, 2, 3]);
      expect(range(-4)).toStrictEqual([0, -1, -2, -3]);
    },
  );

  test("should infer the sign of `step` when only `start` and `end` are given - incrementing", () => {
    expect(range(1, 5)).toStrictEqual([1, 2, 3, 4]);
  });

  test.fails(
    "should infer the sign of `step` when only `start` and `end` are given - decrementing",
    //=> `step` is always `1` when not provided explicitly, it is never inferred from the `start` or `end` parameters.
    () => {
      expect(range(5, 1)).toStrictEqual([5, 4, 3, 2]);
    },
  );

  test("should work with a `start`, `end`, and `step`", () => {
    expect(range(0, { end: -4, step: -1 })).toStrictEqual([0, -1, -2, -3]);
    expect(range(5, { end: 1, step: -1 })).toStrictEqual([5, 4, 3, 2]);
    expect(range(0, { end: 20, step: 5 })).toStrictEqual([0, 5, 10, 15]);
  });

  test.fails(
    "should support a `step` of `0`",
    //=> A `step` of `0` would result in an impossible infinite range. Lodash *special-cases* this by limiting the length to exactly `end - start`.
    () => {
      expect(range(1, { end: 4, step: 0 })).toStrictEqual([1, 1, 1]);
    },
  );

  test("should work with a `step` larger than `end`", () => {
    expect(range(1, { end: 5, step: 20 })).toStrictEqual([1]);
  });

  test("should work with a negative `step`", () => {
    expect(range(0, { end: -4, step: -1 })).toStrictEqual([0, -1, -2, -3]);
    expect(range(21, { end: 10, step: -3 })).toStrictEqual([21, 18, 15, 12]);
  });

  test("should support `start` of `-0`", () => {
    expect(1 / range(-0, 1)[0]!).toBe(-Infinity);
  });

  test.fails(
    "should treat falsey `start` as `0` - no arguments",
    //=> Not supported at the type-level!
    () => {
      expect(
        // @ts-expect-error [ts2554] -- Not supported at the type-level!
        range(),
      ).toStrictEqual([]);
    },
  );

  test.fails(
    "should treat falsey `start` as `0` - single argument non-numbers",
    //=> Not supported at the type-level!
    () => {
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          null,
        ),
      ).toStrictEqual([]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          undefined,
        ),
      ).toStrictEqual([]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          false,
        ),
      ).toStrictEqual([]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          "",
        ),
      ).toStrictEqual([]);
    },
  );

  test.fails(
    "should treat falsey `start` as `0` - single argument numbers",
    //=> Calling `range` with a single parameter results in the data-last version of `range` being returned.
    () => {
      expect(range(0)).toStrictEqual([]);
      expect(range(Number.NaN)).toStrictEqual([]);
    },
  );

  test.fails(
    "should treat falsey `start` as `0` - non-numbers",
    //=> Not supported at the type-level!
    () => {
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          null,
          1,
        ),
      ).toStrictEqual([0]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          undefined,
          1,
        ),
      ).toStrictEqual([0]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          false,
          1,
        ),
      ).toStrictEqual([0]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          "",
          1,
        ),
      ).toStrictEqual([0]);
    },
  );

  test("should treat falsey `start` as `0` - zero", () => {
    // Trivially correct!
    expect(range(0, 1)).toStrictEqual([0]);
  });

  test.fails(
    "should treat falsey `start` as `0` - NaN",
    //=> NaN is not treated as `0` implicitly, instead, we don't consider the input valid and thus the we don't define the expected output either.
    () => {
      expect(range(Number.NaN, 1)).toStrictEqual([0]);
    },
  );

  test.fails(
    "should coerce arguments to finite numbers - strings",
    //=> Not supported at the type-level!
    () => {
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          "1",
        ),
      ).toStrictEqual([0]);
      expect(
        range(
          // @ts-expect-error [ts2345] -- Not supported at the type-level!
          "0",
          1,
        ),
      ).toStrictEqual([0]);
      expect(
        range(0, {
          end: 1,
          // @ts-expect-error [ts2322] -- Not supported at the type-level!
          step: "1",
        }),
      ).toStrictEqual([0]);
    },
  );

  test("should coerce arguments to finite numbers - NaN", () => {
    // We don't explicitly handle NaN and therefore the behavior when
    // providing NaN is not explicitly defined or ensured. When both `start`
    // and `end` are NaN they happen to result in an empty range, but this is
    // not strictly enforced and is implementation dependent, and might break
    // in the future (without it being considered a breaking API change!)
    expect(range(Number.NaN, Number.NaN)).toStrictEqual([]);
  });

  test.fails(
    "should work as an iteratee for methods like `_.map`",
    //=> Lodash test for this because "headless" invocations are supported via an explicit guard that protects against the "index" parameter being passed as a second parameter to range (which would lead to funky ranges). We don't support "headless" invocations in general, and `range` doesn't support a single-param (implicit start) invocation anyway.
    () => {
      expect(map([1, 2, 3], range)).toStrictEqual([[0], [0, 1], [0, 1, 2]]);
      expect(mapValues({ a: 1, b: 2, c: 3 }, range)).toStrictEqual({
        a: [0],
        b: [0, 1],
        c: [0, 1, 2],
      });
    },
  );
});
