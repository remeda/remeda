import { describe, expect, it } from "vitest";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";

describe("data_first", () => {
  it("takeWhile", () => {
    expect(
      takeWhile([1, 2, 3, 4, 3, 2, 1] as const, (x) => x !== 4),
    ).toStrictEqual([1, 2, 3]);
  });
});

describe("data_last", () => {
  it("takeWhile", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 3, 2, 1] as const,
        takeWhile((x) => x !== 4),
      ),
    ).toStrictEqual([1, 2, 3]);
  });
});
