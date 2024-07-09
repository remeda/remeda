import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isDate } from "./isDate";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isDate(data)) {
    expect(data instanceof Date).toEqual(true);
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);
  expect(data.every((c) => c instanceof Date)).toEqual(true);
});
