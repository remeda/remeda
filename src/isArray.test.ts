import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isArray } from "./isArray";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isArray(data)) {
    expect(Array.isArray(data)).toEqual(true);
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);
  expect(data.every((c) => Array.isArray(c))).toEqual(true);
});
