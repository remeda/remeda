import { dropLast } from "./dropLast";

test("empty array", () => {
  expect(dropLast([], 2)).toStrictEqual([]);
});

test("N < 0", () => {
  expect(dropLast([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("N === 0", () => {
  expect(dropLast([1, 2, 3, 4, 5], 0)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("N < length", () => {
  expect(dropLast([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2, 3]);
});

test("N === length", () => {
  expect(dropLast([1, 2, 3, 4, 5], 5)).toStrictEqual([]);
});

test("N > length", () => {
  expect(dropLast([1, 2, 3, 4, 5], 10)).toStrictEqual([]);
});

test("should drop last", () => {
  expect(dropLast([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2, 3]);
});

test("should return a new array even if there was no drop", () => {
  const data = [1, 2, 3, 4, 5];
  const result = dropLast(data, 0);
  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
