import { expectTypeOf, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
  type TypedArray,
} from "../test/typesDataProvider";
import { isFunction } from "./isFunction";

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.function as AllTypesDataProviderTypes;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<() => void>();
  } else {
    expectTypeOf(data).toEqualTypeOf<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | Promise<number>
      | RegExp
      | Set<string>
      | TestClass
      | TypedArray
      | boolean
      | number
      | string
      | symbol
      | 1n
      | { readonly a: "asd" }
      | [number, number, number]
      | null
      | undefined
    >();
  }
});

test("union with non-function types", () => {
  let data: string | ((a: number) => string) | undefined;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<(a: number) => string>();
  } else {
    expectTypeOf(data).toEqualTypeOf<string | undefined>();
  }
});

test("should work as type guard in filter", () => {
  expectTypeOf(ALL_TYPES_DATA_PROVIDER.filter(isFunction)).toEqualTypeOf<
    Array<() => void>
  >();
});

test("unknown", () => {
  const data = "Hello, world!" as unknown;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<(...args: never) => unknown>();
  } else {
    expectTypeOf(data).toEqualTypeOf<unknown>();
  }
});

test("any", () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any -- Intentional!
  const data = "Hello, world!" as any;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<(...args: never) => unknown>();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectTypeOf(data).toEqualTypeOf<any>();
  }
});
