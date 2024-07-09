import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isFunction } from "./isFunction";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.function as AllTypesDataProviderTypes;
  if (isFunction(data)) {
    expect(typeof data).toEqual("function");
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isFunction);
  expect(data.every((c) => typeof c === "function")).toEqual(true);
});
