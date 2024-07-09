import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isError } from "./isError";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
  if (isError(data)) {
    expect(data instanceof Error).toEqual(true);
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);
  expect(data.every((c) => c instanceof Error)).toEqual(true);
});
