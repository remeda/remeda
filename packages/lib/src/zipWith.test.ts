import { pipe } from "./pipe";
import { zipWith } from "./zipWith";

describe("data first", () => {
  test("should zip with predicate", () => {
    expect(
      zipWith(["1", "2", "3"], ["a", "b", "c"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      zipWith(["1", "2", "3"], ["a", "b"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      zipWith(["1", "2"], ["a", "b", "c"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b"]);
  });
});

describe("data second", () => {
  test("should zip with predicate", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2", "3"],
        ["a", "b", "c"],
      ),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2", "3"],
        ["a", "b"],
      ),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2"],
        ["a", "b", "c"],
      ),
    ).toStrictEqual(["1a", "2b"]);
  });
});

describe("data second with initial arg", () => {
  test("should zip with predicate", () => {
    expect(
      pipe(
        ["1", "2", "3"],
        zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      pipe(
        ["1", "2", "3"],
        zipWith(["a", "b"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      pipe(
        ["1", "2"],
        zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b"]);
  });
});
