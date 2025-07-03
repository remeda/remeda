import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isPromise } from "./isPromise";

test("should work as type guard", () => {
  expect(isPromise(TYPES_DATA_PROVIDER.promise)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isPromise);

  expect(data.every((c) => c instanceof Promise)).toBe(true);
});
