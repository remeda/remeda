import type { NTuple } from "./NTuple";

declare function nTuple<T, N extends number>(x: T, n: N): NTuple<T, N>;

test("size 0", () => {
  const result = nTuple("foo", 0);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("non-trivial size", () => {
  const result = nTuple("foo", 3);
  expectTypeOf(result).toEqualTypeOf<[string, string, string]>();
});
