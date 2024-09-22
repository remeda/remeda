import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { differenceWith } from "./differenceWith";
import { isDeepEqual } from "./isDeepEqual";
import { pipe } from "./pipe";
import { take } from "./take";

const source = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
const other = [{ a: 2 }, { a: 5 }, { a: 3 }];
const expected = [{ a: 1 }, { a: 4 }];

describe("data_first", () => {
  test("should return difference", () => {
    expect(differenceWith(source, other, isDeepEqual)).toStrictEqual(expected);
  });

  test("should allow differencing different data types", () => {
    expect(
      differenceWith([1, 2, 3, 4], ["2", "3"], (a, b) => a.toString() === b),
    ).toStrictEqual([1, 4]);
  });
});

describe("data_last", () => {
  test("should return difference", () => {
    expect(differenceWith(other, isDeepEqual)(source)).toStrictEqual(expected);
  });

  test("should allow differencing different data types", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        differenceWith(["2", "3"], (a, b) => a.toString() === b),
      ),
    ).toStrictEqual([1, 4]);
  });

  test("lazy", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
      counter.fn(),
      differenceWith([{ a: 2 }, { a: 3 }], isDeepEqual),
      take(2),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([{ a: 1 }, { a: 4 }]);
  });
});
