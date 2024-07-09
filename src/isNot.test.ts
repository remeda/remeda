import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isNot } from "./isNot";
import { isPromise } from "./isPromise";
import { isString } from "./isString";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
  if (isNot(isString)(data)) {
    expect(data instanceof Promise).toBe(true);
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
  expect(data.some((c) => c instanceof Promise)).toBe(false);
});
