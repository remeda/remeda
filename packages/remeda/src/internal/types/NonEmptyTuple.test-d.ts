import type { IterableContainer } from "./IterableContainer";
import type { NonEmptyTuple } from "./NonEmptyTuple";

declare function nonEmptyTuple<T extends IterableContainer>(
  tuple: T,
): NonEmptyTuple<T>;

test("empty array", () => {
  const result = nonEmptyTuple([]);

  expectTypeOf(result).toEqualTypeOf<never>();
});

test("empty readonly array", () => {
  const result = nonEmptyTuple([] as const);

  expectTypeOf(result).toEqualTypeOf<never>();
});

test("simple array", () => {
  const result = nonEmptyTuple([] as Array<string>);

  expectTypeOf(result).toEqualTypeOf<[string, ...Array<string>]>();
});

test("simple tuple", () => {
  const result = nonEmptyTuple([1]);

  expectTypeOf(result).toEqualTypeOf<[number]>();
});

test("simple readonly tuple", () => {
  const result = nonEmptyTuple([1] as const);

  expectTypeOf(result).toEqualTypeOf<readonly [1]>();
});

test("optional tuple", () => {
  const result = nonEmptyTuple([] as [number?]);

  expectTypeOf(result).toEqualTypeOf<[number]>();
});
