import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isSymbol } from "./isSymbol";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.symbol as AllTypesDataProviderTypes;
  if (isSymbol(data)) {
    expect(typeof data).toEqual("symbol");
  }
});

it("should work even if data type is `unknown`", () => {
  const data = TYPES_DATA_PROVIDER.symbol as unknown;
  if (isSymbol(data)) {
    expect(typeof data).toEqual("symbol");
  }
});

it("should work even if data type is `any`", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly checking any
  const data = TYPES_DATA_PROVIDER.symbol as any;
  if (isSymbol(data)) {
    expect(typeof data).toEqual("symbol");
  }
});

it("should work as type guard in array", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isSymbol);
  expect(data.every((c) => typeof c === "symbol")).toEqual(true);
});
