import { expectTypeOf, test } from "vitest";
import { last } from "./last";
import { pipe } from "./pipe";

test("works with empty arrays", () => {
  const result = last([] as const);

  expectTypeOf(result).toEqualTypeOf<never>();
});

test("works with regular arrays", () => {
  const result = last([1, 2, 3] as Array<number>);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("works with non-empty arrays", () => {
  const result = last([1] as [number, ...Array<number>]);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("should infer type in pipes", () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-spread -- This is fine...
  const result = pipe("this is a text", (text) => [...text], last());

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});

test("can infer last type from const arrays", () => {
  const result = last([3, "a", false] as const);

  expectTypeOf(result).toEqualTypeOf<false>();
});

test("a bit more complex example", () => {
  const result = last([["a", 1] as const, true, { foo: "bar" }] as const);

  expectTypeOf(result).toEqualTypeOf<{ readonly foo: "bar" }>();
});
