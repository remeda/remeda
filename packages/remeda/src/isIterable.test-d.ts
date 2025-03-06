import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isIterable } from "./isIterable";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isIterable(data)) {
    expectTypeOf(data).toEqualTypeOf<
      | string
      | Array<number>
      | Map<string, string>
      | Set<string>
      | [number, number, number]
      | Uint8Array<ArrayBuffer>
    >();
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isIterable);

  expectTypeOf(data).toEqualTypeOf<
    Array<
      | string
      | Array<number>
      | Map<string, string>
      | Set<string>
      | [number, number, number]
      | Uint8Array<ArrayBuffer>
    >
  >();
});
