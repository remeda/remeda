import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isPromise } from "./isPromise";

it("should work as type guard", () => {
  expect(isPromise(TYPES_DATA_PROVIDER.promise)).toBe(true);
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isPromise);

  expect(data.every((c) => c instanceof Promise)).toBe(true);
});
