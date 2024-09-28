import { identity } from "./identity";
import { meanBy } from "./meanBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("data first", () => {
  test("meanBy", () => {
    expect(
      meanBy([{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }], prop("a")),
    ).toBe(3);
  });

  test("indexed", () => {
    expect(
      meanBy(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        ({ a }, idx) => a + idx,
      ),
    ).toBe(5);
  });

  test("should handle empty array", () => {
    expect(meanBy([], identity())).toBeNaN();
  });
});

describe("data last", () => {
  test("meanBy", () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        meanBy(prop("a")),
      ),
    ).toBe(3);
  });

  test("indexed", () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        meanBy(({ a }, idx) => a + idx),
      ),
    ).toBe(5);
  });

  test("should handle empty array", () => {
    expect(pipe([], meanBy(identity()))).toBeNaN();
  });
});
