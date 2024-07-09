import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isNonNullish } from "./isNonNullish";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isNonNullish(data)) {
    expect(data instanceof Date).toBe(true);
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);
  expect(data).toHaveLength(17);
});
