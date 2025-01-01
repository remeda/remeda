import { flat } from "./flat";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

it("works on empty arrays", () => {
  const result = flat([], 1);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

it("works on already-flat arrays", () => {
  const result = flat([] as Array<string>, 1);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("works on a single level of nesting", () => {
  const result = flat([] as Array<Array<string>>, 1);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("stops after the first level of nesting (depth === 1)", () => {
  const threeDeepResult = flat([] as Array<Array<Array<string>>>, 1);

  expectTypeOf(threeDeepResult).toEqualTypeOf<Array<Array<string>>>();

  const fourDeepResult = flat([] as Array<Array<Array<Array<string>>>>, 1);

  expectTypeOf(fourDeepResult).toEqualTypeOf<Array<Array<Array<string>>>>();
});

it("works with mixed types", () => {
  const result = flat([] as Array<Array<number> | Array<string>>, 1);

  expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
});

it("works with mixed levels of nesting", () => {
  const result = flat([] as Array<Array<number> | string>, 1);

  expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
});

it("works when depth is deeper than the array", () => {
  const result = flat([] as Array<string>, 10);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("works when depth is really really really really big", () => {
  const result = flat([] as Array<string>, 9_999_999);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("keeps the typing of trivial tuples", () => {
  const result = flat([1, 2] as const, 1);

  expectTypeOf(result).toEqualTypeOf<[1, 2]>();
});

it("works on simple tuples", () => {
  const result = flat(
    [
      [1, 2],
      [3, 4],
    ] as const,
    1,
  );

  expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4]>();
});

it("works on tuples with different levels of nesting", () => {
  const result = flat([1, [2, 3], [4, [5, 6]]] as const, 1);

  expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, readonly [5, 6]]>();
});

it("works on tuples with depth>1", () => {
  const result = flat([1, [2, 3], [4, [5, 6]]] as const, 2);

  expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, 5, 6]>();
});

it("works with tuples with a lot of nesting", () => {
  const result = flat([[[[1]], [[[[2]]]]], [[[[3, 4], 5]]]] as const, 10);

  expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, 5]>();
});

it("works with a mix of simple arrays and tuples", () => {
  const result = flat([[]] as [Array<string>], 1);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("works with multiple types nested in a tuple", () => {
  const result = flat([[], []] as [Array<string>, Array<number>], 1);

  expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
});

it("works with a tuple with mixed array and non array items", () => {
  const result = flat([1, []] as [number, Array<string>], 1);

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<string>]>();
});

it("works with a tuple with mixed array and non array items, deeply", () => {
  const result = flat([[1], []] as [[number], Array<Array<string>>], 2);

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<string>]>();
});

it("works on non-empty arrays", () => {
  const result = flat([[1]] as NonEmptyArray<NonEmptyArray<number>>, 1);

  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<number>>();
});

it("works on tuples inside arrays", () => {
  const result = flat([] as Array<[Array<string>, Array<number>]>, 2);

  expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
});

it("works on arrays inside tuples", () => {
  const result = flat([1, [], 4] as [1, Array<[2, 3]>, 4], 2);

  expectTypeOf(result).toEqualTypeOf<[1, ...Array<2 | 3>, 4]>();
});

it("works with depths beyond 20", () => {
  // The built-in type for `Array.prototype.flat` only goes up to 20.

  const result = flat(
    [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] as const,
    99,
  );

  expectTypeOf(result).toEqualTypeOf<[1]>();
});

it("doesn't accept non-literal depths", () => {
  // @ts-expect-error [ts2345] - non-literal numbers can't be used as depth.
  flat([], 1 as number);
});

it("doesn't accept built-in 'infinite' numbers", () => {
  // They are all typed as `number` by typescript's libs.

  // @ts-expect-error [ts2345] - Infinity is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L9
  flat([], Number.POSITIVE_INFINITY);

  // @ts-expect-error [ts2345] - Max number is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L576
  flat([], Number.MAX_VALUE);

  // @ts-expect-error [ts2345] - Infinity is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L597
  flat([], Number.POSITIVE_INFINITY);
});
