import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isString } from "./isString";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.string as AllTypesDataProviderTypes;
  if (isString(data)) {
    expect(typeof data).toEqual("string");
  }
});

it("should work even if data type is unknown", () => {
  const data = TYPES_DATA_PROVIDER.string as unknown;
  if (isString(data)) {
    expect(typeof data).toEqual("string");
  }
});

it("should work with literal types", () => {
  const x = dataFunction();
  if (isString(x)) {
    expect(typeof x).toEqual("string");
  }
});

it("should work as type guard in array", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isString);
  expect(data.every((c) => typeof c === "string")).toEqual(true);
});

const dataFunction = (): number | "a" | "b" | "c" => "a";
