import { takeLast } from "./takeLast";

test("empty array", () => {
  expect(takeLast([], 2)).toStrictEqual([]);
});

test("n < 0", () => {
  expect(takeLast([1, 2, 3, 4, 5], -1)).toStrictEqual([]);
});

test("n === 0", () => {
  expect(takeLast([1, 2, 3, 4, 5], 0)).toStrictEqual([]);
});

test("n < length", () => {
  expect(takeLast([1, 2, 3, 4, 5], 2)).toStrictEqual([4, 5]);
});

test("n === length", () => {
  expect(takeLast([1, 2, 3, 4, 5], 5)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("n > length", () => {
  expect(takeLast([1, 2, 3, 4, 5], 10)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("should return a new array even if everything was taken", () => {
  const data = [1, 2, 3, 4, 5];
  const result = takeLast(data, data.length);

  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
