import { describe, it, expect } from "vitest";
import { toReadonlyArray } from "./toReadonlyArray";

describe("toReadonlyArray", () => {
  it("should return the same array if input is already an array", () => {
    const input = [1, 2, 3];
    const result = toReadonlyArray(input);

    expect(result).toBe(input);
  });

  it("should convert an iterable to an array", () => {
    const input = new Set([1, 2, 3]);
    const result = toReadonlyArray(input);

    expect(result).toStrictEqual([1, 2, 3]);
  });

  it("should return an empty array if input is an empty iterable", () => {
    const input = new Set();
    const result = toReadonlyArray(input);

    expect(result).toStrictEqual([]);
  });
});
