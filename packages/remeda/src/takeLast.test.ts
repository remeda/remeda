import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { take } from "./take";
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

test("a single item", () => {
  expect(takeLast([1], 1)).toStrictEqual([1]);
});

test("rounds a fractional n up", () => {
  expect(takeLast([1, 2, 3, 4, 5], 2.5)).toStrictEqual([3, 4, 5]);
});

test("a fraction below 1 takes one item", () => {
  expect(takeLast([1, 2, 3, 4, 5], 0.5)).toStrictEqual([5]);
});

test("a fraction too small to subtract from the length takes nothing", () => {
  // `length - n` rounds back to `length`, so the slice starts at the end.
  expect(takeLast([1, 2, 3, 4, 5], Number.MIN_VALUE)).toStrictEqual([]);
});

test("n is NaN", () => {
  expect(takeLast([1, 2, 3, 4, 5], NaN)).toStrictEqual([]);
});

test("n is Infinity", () => {
  expect(takeLast([1, 2, 3, 4, 5], Infinity)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("n is -Infinity", () => {
  expect(takeLast([1, 2, 3, 4, 5], -Infinity)).toStrictEqual([]);
});

test("keeps holes", () => {
  // eslint-disable-next-line no-sparse-arrays -- The holes are the case under test.
  expect(takeLast([1, , 3], 2)).toStrictEqual([, 3]);
});

test("data-last on an empty array", () => {
  expect(pipe([], takeLast(2))).toStrictEqual([]);
});

test("data-last", () => {
  expect(pipe([1, 2, 3, 4, 5], takeLast(2))).toStrictEqual([4, 5]);
});

describe("known issues!", () => {
  test("a lazy step before it reads holes as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    const result = pipe([1, , 3], take(Infinity), takeLast(2));

    // `slice` keeps holes, but a lazy step iterates its input, which reads a
    // hole as `undefined`.
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(result).not.toStrictEqual([, 3]);

    // Actual
    expect(result).toStrictEqual([undefined, 3]);
  });
});
