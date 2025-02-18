import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isArray } from "./isArray";

it("should infer ReadonlyArray<unknown> when given any", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly testing `any`
  const data = [] as any;
  if (isArray(data)) {
    expectTypeOf(data).not.toBeAny();
    expectTypeOf(data[0]).toBeUnknown();
  }
});

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<
      Array<number> | [number, number, number]
    >();
  }
});

it("should infer ReadonlyArray<unknown> when given `unknown`", () => {
  const data = TYPES_DATA_PROVIDER.array as unknown;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<ReadonlyArray<unknown>>();
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);

  expectTypeOf(data).toEqualTypeOf<
    Array<Array<number> | [number, number, number]>
  >();
});

test("mutable arrays work", () => {
  const data = [] as Array<number> | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<Array<number>>();
  }

  // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
  expectTypeOf([data].filter(isArray)).toEqualTypeOf<Array<Array<number>>>();
});

test("readonly arrays work", () => {
  const data = [] as ReadonlyArray<number> | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();
  }

  // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
  expectTypeOf([data].filter(isArray)).toEqualTypeOf<
    Array<ReadonlyArray<number>>
  >();
});
