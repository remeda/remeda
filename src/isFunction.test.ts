import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isFunction } from "./isFunction";

it("should work as type guard", () => {
  expect(isFunction(TYPES_DATA_PROVIDER.function)).toBe(true);
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isFunction);

  expect(data.every((c) => typeof c === "function")).toBe(true);
});
