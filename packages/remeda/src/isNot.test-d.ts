import { expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
  type TypedArray,
} from "../test/typesDataProvider";
import { isNot } from "./isNot";
import { isPromise } from "./isPromise";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
import { startsWith } from "./startsWith";

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
  if (isNot(isString)(data)) {
    expectTypeOf(data).toEqualTypeOf<
      | number[]
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
      | symbol
      | 1n
      | (() => void)
      | [number, number, number]
      | { readonly a: "asd" }
      | null
      | undefined
    >(data);
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));

  expectTypeOf(data).toEqualTypeOf<
    (
      | number[]
      | Date
      | Error
      | Map<string, string>
      | RegExp
      | Set<string>
      | TestClass
      | TypedArray
      | boolean
      | number
      | string
      | symbol
      | 1n
      | (() => void)
      | [number, number, number]
      | { readonly a: "asd" }
      | null
      | undefined
    )[]
  >();
});

test("negates a predicate wider than the data", () => {
  expectTypeOf(
    $typed<(string | null)[]>().filter(
      isNot(
        (x: unknown): x is null | undefined => x === null || x === undefined,
      ),
    ),
  ).items.toEqualTypeOf<string>();
});

test("type predicates that take a type parameter", () => {
  expectTypeOf(
    $typed<(true | false)[]>().filter(isNot(isTruthy)),
  ).items.toEqualTypeOf<false>();
});

test("type predicates which are too narrow for the wrapper", () => {
  // eslint-disable-next-line unicorn/no-unused-array-method-return
  $typed<(string | undefined)[]>().filter(
    // @ts-expect-error [ts2769] -- Intentional! This is what we want to test
    // here. The `undefined` in the data type cannot be processed by the type
    // predicate.
    isNot(startsWith("hello")),
  );
});
