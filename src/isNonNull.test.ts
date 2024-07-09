import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isNonNull } from "./isNonNull";

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isNonNull(data)) {
    expect(data instanceof Date).toBe(true);
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);
  expect(data).toHaveLength(18);
});
