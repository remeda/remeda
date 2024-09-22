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
    expect(uniqueWith(source, isDeepEqual)).toEqual(expected);
  });
});

describe("data_last", () => {
  test("should return uniq", () => {
    expect(uniqueWith(isDeepEqual)(source)).toEqual(expected);
  });

  it("lazy", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      uniqueWith(isDeepEqual),
      take(3),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([{ a: 1 }, { a: 2 }, { a: 5 }]);
  });

  it("take before uniq", () => {
    // bug from https://github.com/remeda/remeda/issues/14
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      take(3),
      uniqueWith(isDeepEqual),
    );

    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });
});
