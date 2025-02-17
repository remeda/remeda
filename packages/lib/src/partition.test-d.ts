import { isNumber } from "./isNumber";
import { partition } from "./partition";
import { pipe } from "./pipe";

test("partition with type guard", () => {
  const actual = partition([1, "a", 2, "b"], isNumber);

  expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
});

test("partition with type guard in pipe", () => {
  const actual = pipe(
    [1, "a", 2, "b"],
    partition((value): value is number => typeof value === "number"),
  );

  expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
});
