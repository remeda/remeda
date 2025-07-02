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
