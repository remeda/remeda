import { expect, test, vi } from "vitest";
import { constant } from "./constant";
import { pipe } from "./pipe";
import { splitWhen } from "./splitWhen";

test("should split array", () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3] as const, (x) => x === 2)).toStrictEqual([
    [1],
    [2, 3, 1, 2, 3],
  ]);
});

test("should with no matches", () => {
  const n = 1232;

  expect(splitWhen([1, 2, 3, 1, 2, 3], (x) => x === n)).toStrictEqual([
    [1, 2, 3, 1, 2, 3],
    [],
  ]);
});

test("empty array", () => {
  expect(splitWhen([], constant(true))).toStrictEqual([[], []]);
});

test("single item that matches", () => {
  expect(splitWhen([1], constant(true))).toStrictEqual([[], [1]]);
});

test("single item that doesn't match", () => {
  expect(splitWhen([1], constant(false))).toStrictEqual([[1], []]);
});

test("calls the predicate in order with the whole input, up to the first match", () => {
  const data = ["a", "b", "c", "d"];
  const predicate = vi.fn<
    (item: string, index: number, data: readonly string[]) => boolean
  >((item) => item === "b");

  splitWhen(data, predicate);

  expect(predicate.mock.calls).toStrictEqual([
    ["a", 0, data],
    ["b", 1, data],
  ]);
});

test("calls the predicate once per item when nothing matches", () => {
  const data = ["a", "b", "c"];
  const predicate = vi.fn<
    (item: string, index: number, data: readonly string[]) => boolean
  >(constant(false));

  splitWhen(data, predicate);

  expect(predicate.mock.calls).toStrictEqual([
    ["a", 0, data],
    ["b", 1, data],
    ["c", 2, data],
  ]);
});

test("holes are tested as undefined", () => {
  // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
  const data = [1, , 3];

  expect(splitWhen(data, (item) => item === undefined)).toStrictEqual([
    [1],
    // eslint-disable-next-line no-sparse-arrays -- The hole is the expected output.
    [, 3],
  ]);
});

test("holes are kept when an item matches", () => {
  // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
  const data = [1, , 3, , 5];

  expect(splitWhen(data, (item) => item === 3)).toStrictEqual([
    // eslint-disable-next-line no-sparse-arrays -- The hole is the expected output.
    [1, ,],
    // eslint-disable-next-line no-sparse-arrays -- The hole is the expected output.
    [3, , 5],
  ]);
});

test("holes become undefined when nothing matches", () => {
  expect(
    // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
    splitWhen([1, , 3], constant(false)),
  ).toStrictEqual([[1, undefined, 3], []]);
});

test("empty array in a pipe", () => {
  expect(pipe([], splitWhen(constant(true)))).toStrictEqual([[], []]);
});

test("holes are kept when an item matches in a pipe", () => {
  // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
  const data = [1, , 3, , 5];

  expect(
    pipe(
      data,
      splitWhen((item) => item === 3),
    ),
  ).toStrictEqual([
    // eslint-disable-next-line no-sparse-arrays -- The hole is the expected output.
    [1, ,],
    // eslint-disable-next-line no-sparse-arrays -- The hole is the expected output.
    [3, , 5],
  ]);
});
