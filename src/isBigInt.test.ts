import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isBigInt } from "./isBigInt";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.bigint as AllTypesDataProviderTypes;
  if (isBigInt(data)) {
    expect(typeof data).toEqual("bigint");
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isBigInt);
  expect(data.every((c) => typeof c === "bigint")).toEqual(true);
});

it("should work even if data type is unknown", () => {
  const data = TYPES_DATA_PROVIDER.bigint as unknown;
  if (isBigInt(data)) {
    expect(typeof data).toEqual("bigint");
  }
});

it("should work with literal types", () => {
  const x = dataFunction();
  if (isBigInt(x)) {
    expect(typeof x).toEqual("bigint");
  }
});

const dataFunction = (): string | 1n | 2n | 3n => 1n;
