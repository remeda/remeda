import { expectTypeOf, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isArray } from "./isArray";

test("should infer readonly unknown[] when given any", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly testing `any`
  const data = [] as any;
  if (isArray(data)) {
    expectTypeOf(data).not.toBeAny();
    expectTypeOf(data[0]).toBeUnknown();
  }
});

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<number[] | [number, number, number]>();
  }
});

test("should infer readonly unknown[] when given `unknown`", () => {
  const data = TYPES_DATA_PROVIDER.array as unknown;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<readonly unknown[]>();
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);

  expectTypeOf(data).toEqualTypeOf<(number[] | [number, number, number])[]>();
});

test("mutable arrays work", () => {
  const data = [] as number[] | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<number[]>();
  }

  // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
  expectTypeOf([data].filter(isArray)).toEqualTypeOf<number[][]>();
});

test("readonly arrays work", () => {
  const data = [] as readonly number[] | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<readonly number[]>();
  }

  // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
  expectTypeOf([data].filter(isArray)).toEqualTypeOf<(readonly number[])[]>();
});
