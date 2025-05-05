import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isIterable } from "./isIterable";

it("should work as type guard", () => {
  expect(isIterable(TYPES_DATA_PROVIDER.array)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.bigint)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.boolean)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.date)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.error)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.function)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.instance)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.map)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.null)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.number)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.object)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.promise)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.regex)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.set)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.string)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.symbol)).toBe(false);
  expect(isIterable(TYPES_DATA_PROVIDER.tuple)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.typedArray)).toBe(true);
  expect(isIterable(TYPES_DATA_PROVIDER.undefined)).toBe(false);
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isIterable);

  expect(
    data.every(
      (c) => typeof c === "string" || Symbol.iterator in (c as object),
    ),
  ).toBe(true);
});
