import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
import { equals } from "./equals";
import { pipe } from "./pipe";
import { take } from "./take";
import { uniqWith } from "./uniqWith";

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
    expect(uniqWith(source, equals)).toEqual(expected);
  });
});

describe("data_last", () => {
  test("should return uniq", () => {
    expect(uniqWith(equals)(source)).toEqual(expected);
  });

  it("lazy", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      uniqWith(equals),
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
      uniqWith(equals),
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });
});
