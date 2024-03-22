import { findIndex } from "./findIndex";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findIndex", () => {
    expect(findIndex([10, 20, 30], (x) => x === 20)).toBe(1);
  });

  test("findIndex -1", () => {
    expect(findIndex([2, 3, 4], (x) => x === 20)).toBe(-1);
  });
});

describe("data last", () => {
  test("findIndex", () => {
    const counter = vi.fn(identity);
    const actual = pipe(
      [10, 20, 30] as const,
      map(counter),
      findIndex((x) => x === 20),
    );
    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });
});
