import { differenceWith } from "./differenceWith";
import { isDeepEqual } from "./isDeepEqual";

it("narrows unions", () => {
  const data = 1 as number | string;

  if (isDeepEqual(data, 1)) {
    expectTypeOf(data).toEqualTypeOf<number>();
  } else {
    expectTypeOf(data).toEqualTypeOf<number | string>();
  }

  if (isDeepEqual(data, "hello")) {
    expectTypeOf(data).toEqualTypeOf<string>();
  } else {
    expectTypeOf(data).toEqualTypeOf<number | string>();
  }
});

it("narrows to literal", () => {
  const data = 1 as number;
  if (isDeepEqual(data, 1 as const)) {
    expectTypeOf(data).toEqualTypeOf<1>();
  } else {
    expectTypeOf(data).toEqualTypeOf<number>();
  }
});

it("doesn't accept non-overlapping types", () => {
  // @ts-expect-error [ts2345] - Checking against the wrong type should fail
  isDeepEqual(1 as number, true);
});

it("works deeply", () => {
  const data = [] as Array<
    { a: Array<number> | Array<string> } | { b: Array<boolean> }
  >;
  if (isDeepEqual(data, [{ a: [1] }])) {
    expectTypeOf(data).toEqualTypeOf<Array<{ a: Array<number> }>>();
  } else {
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | {
            a: Array<number> | Array<string>;
          }
        | {
            b: Array<boolean>;
          }
      >
    >();
  }
});

it("doesn't narrow when comparing objects of the same type", () => {
  const data1 = { a: 1 } as { a: number };
  const data2 = { a: 2 } as { a: number };
  if (isDeepEqual(data1, data2)) {
    expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
  } else {
    expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
  }
});

it("headless usage can infer types", () => {
  // Tests the issue reported in: https://github.com/remeda/remeda/issues/641
  const result = differenceWith(["a", "b", "c"], ["a", "c", "d"], isDeepEqual);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});
