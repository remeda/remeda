import { expectTypeOf, test } from "vitest";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";

test("should return a mutable tuple type whose length matches input container's length, consisting of the type of the initial value", () => {
  const result = mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100);

  expectTypeOf(result).toEqualTypeOf<
    [number, number, number, number, number]
  >();
});

test("should maintain the input shape via a pipe", () => {
  const result = pipe(
    [1, 2, 3, 4, 5] as const,
    mapWithFeedback((acc, x) => acc + x, 100),
  );

  expectTypeOf(result).toEqualTypeOf<
    [number, number, number, number, number]
  >();
});

test("should return a tuple consisting of the initial value type even if the initial iterable contains a different type", () => {
  const result = mapWithFeedback(
    ["1", "2", "3", "4", "5"],
    (acc, x) => acc + Number(x),
    100,
  );

  expectTypeOf(result).toEqualTypeOf<
    [number, number, number, number, number]
  >();
});

test("should correctly infer type with a non-literal array type", () => {
  const result = mapWithFeedback(
    [1, 2, 3, 4, 5] as number[],
    (acc, x) => acc + x,
    100,
  );

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("data param is lazily reconstructed in data-first", () => {
  mapWithFeedback(
    [1, 2, 3] as const,
    (_previousValue, _currentValue, _currentIndex, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

      return 0;
    },
    0,
  );
});

test("data param is lazily reconstructed in data-last", () => {
  pipe(
    [1, 2, 3] as const,
    mapWithFeedback((_previousValue, _currentValue, _currentIndex, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

      return 0;
    }, 0),
  );
});
