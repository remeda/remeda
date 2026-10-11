import { describe, expect, test } from "vitest";
import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { isDeepEqual } from "./isDeepEqual";
import { pipe } from "./pipe";
import { take } from "./take";
import { uniqueWith } from "./uniqueWith";

const source = [
  { a: 1 },
  { a: 2 },
  { a: 2 },
  { a: 5 },
  { a: 1 },
  { a: 6 },
  { a: 7 },
];
const expected = [{ a: 1 }, { a: 2 }, { a: 5 }, { a: 6 }, { a: 7 }];

describe("data_first", () => {
  test("should return uniq", () => {
    expect(uniqueWith(source, isDeepEqual)).toStrictEqual(expected);
  });

  test("consecutive duplicates", () => {
    expect(uniqueWith([1, 1, 2, 2], (a, b) => a === b)).toStrictEqual([1, 2]);
  });

  test("returns a shallow clone when no items are equal", () => {
    const data = [1, 2, 3];
    const result = uniqueWith(data, (a, b) => a === b);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  test("compares with every earlier item, not just the kept ones", () => {
    expect(
      // `3` is equal only to `2`, which is dropped for being equal to `1`.
      uniqueWith([1, 2, 3], (a, b) => Math.abs(a - b) === 1),
    ).toStrictEqual([1]);
  });

  test("should return items that are not equal to themselves", () => {
    // test case based on https://github.com/remeda/remeda/issues/999
    const data = [
      { id: 1, reason: "No name" },
      { id: 1, reason: "No name" },
      { reason: "No name" },
      { reason: "No name" },
    ];
    const expectedResult = [
      { id: 1, reason: "No name" },
      { reason: "No name" },
      { reason: "No name" },
    ];

    const result = uniqueWith(data, (errorA, errorB) => {
      // the objects with no ids should effectively be ignored from removal of duplicates
      if (errorA.id === undefined || errorB.id === undefined) {
        return false;
      }
      return errorA.id === errorB.id;
    });

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("data_last", () => {
  test("should return uniq", () => {
    expect(uniqueWith(isDeepEqual)(source)).toStrictEqual(expected);
  });

  test("compares with every earlier item, not just the kept ones", () => {
    expect(
      pipe(
        // `3` is equal only to `2`, which is dropped for being equal to `1`.
        [1, 2, 3],
        uniqueWith((a, b) => Math.abs(a - b) === 1),
      ),
    ).toStrictEqual([1]);
  });

  test("should return items that are not equal to themselves", () => {
    // test case based on https://github.com/remeda/remeda/issues/999
    const data = [
      { id: 1, reason: "No name" },
      { id: 1, reason: "No name" },
      { reason: "No name" },
      { reason: "No name" },
    ];
    const expectedResult = [
      { id: 1, reason: "No name" },
      { reason: "No name" },
      { reason: "No name" },
    ];

    const result = pipe(
      data,
      uniqueWith((errorA, errorB) => {
        // the objects with no ids should effectively be ignored from removal of duplicates
        if (errorA.id === undefined || errorB.id === undefined) {
          return false;
        }
        return errorA.id === errorB.id;
      }),
    );

    expect(result).toStrictEqual(expectedResult);
  });

  test("lazy", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      uniqueWith(isDeepEqual),
      take(3),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([{ a: 1 }, { a: 2 }, { a: 5 }]);
  });

  test("take before uniq", () => {
    // bug from https://github.com/remeda/remeda/issues/14
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      take(3),
      uniqueWith(isDeepEqual),
    );

    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([{ a: 1 }, { a: 2 }]);
  });
});
