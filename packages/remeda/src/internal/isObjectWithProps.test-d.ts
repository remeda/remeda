import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../../test/typesDataProvider";
import { isObjectWithProps } from "./isObjectWithProps";

test("narrows nullable types", () => {
  const data: { a: string } | null = { a: "hello" };
  if (isObjectWithProps(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  }
});

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
  if (isObjectWithProps(data, "size")) {
    expectTypeOf(data).toEqualTypeOf<Map<string, string> | Set<string>>();
  }
});

test("should work even if data type is unknown", () => {
  const data = TYPES_DATA_PROVIDER.object as unknown;
  if (isObjectWithProps(data, "size")) {
    expectTypeOf(data).toEqualTypeOf<{ size: unknown }>();
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter((x) =>
    isObjectWithProps(x, "size"),
  );

  expectTypeOf(data).toEqualTypeOf<Array<Map<string, string> | Set<string>>>();
});

test("can narrow down `any`", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly testing `any`
  const data = { hello: "world" } as any;
  if (isObjectWithProps(data, "hello")) {
    expectTypeOf(data).toEqualTypeOf<{ hello: unknown }>();
  }
});
