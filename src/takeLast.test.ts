import { takeLast } from "./takeLast";

test("should take last", () => {
  expect(takeLast([1, 2, 3, 4, 5], 2)).toStrictEqual([4, 5]);
});

test("should not take last", () => {
  expect(takeLast([1, 2, 3, 4, 5], 0)).toStrictEqual([]);
  expect(takeLast([1, 2, 3, 4, 5], -0)).toStrictEqual([]);
  expect(takeLast([1, 2, 3, 4, 5], -1)).toStrictEqual([]);
  expect(takeLast([1, 2, 3, 4, 5], Number.NaN)).toStrictEqual([]);
});

test("should return a new array even if everything was taken", () => {
  const data = [1, 2, 3, 4, 5];
  const result = takeLast(data, data.length);
  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
