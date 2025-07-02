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
    (acc, x) => acc + Number.parseInt(x, 10),
    100,
  );

  expectTypeOf(result).toEqualTypeOf<
    [number, number, number, number, number]
  >();
});

test("should correctly infer type with a non-literal array type", () => {
  const result = mapWithFeedback(
    [1, 2, 3, 4, 5] as Array<number>,
    (acc, x) => acc + x,
    100,
  );

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

test("the items array passed to the callback should be an array type containing the union type of all of the members in the original array", () => {
  mapWithFeedback(
    [1, 2, 3, 4, 5] as const,
    (acc, x, _index, items) => {
      expectTypeOf(items).toEqualTypeOf<readonly [1, 2, 3, 4, 5]>();

      return acc + x;
    },
    100,
  );
});
