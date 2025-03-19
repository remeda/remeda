import { findIndex } from "./findIndex";
import { describeWithPipe } from "./internal/describeWithPipe";

describe("data first", () => {
  test("found", () => {
    expect(findIndex([10, 20, 30], (x) => x === 20)).toBe(1);
  });

  test("not found", () => {
    expect(findIndex([2, 3, 4], (x) => x === 20)).toBe(-1);
  });
});

describeWithPipe("data last", (pipe) => {
  test("found", () => {
    expect(
      pipe(
        [10, 20, 30],
        findIndex((x) => x === 20),
      ),
    ).toBe(1);
  });

  test("not found", () => {
    expect(
      pipe(
        [2, 3, 4],
        findIndex((x) => x === 20),
      ),
    ).toBe(-1);
  });
});
