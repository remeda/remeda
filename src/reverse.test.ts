import { reverse } from "./reverse";
import { pipe } from "./pipe";

describe("data first", () => {
  test("reverse", () => {
    const actual = reverse([1, 2, 3]);
    expect(actual).toEqual([3, 2, 1]);
  });
  describe("reverse typings", () => {
    test("arrays", () => {
      const actual = reverse([1, 2, 3]);
      assertType<Array<number>>(actual);
    });
    test("tuples", () => {
      const actual = reverse([1, 2, [true], "a"] as const);
      assertType<["a", readonly [true], 2, 1]>(actual);
    });

    test("variadic tuples", () => {
      const input: [number, ...Array<string>] = [1, "two", "three"];
      const actual = reverse(input);
      assertType<[...Array<string>, number]>(actual);
    });
  });
});

describe("data last", () => {
  test("reverse", () => {
    const actual = pipe([1, 2, 3], reverse());
    expect(actual).toEqual([3, 2, 1]);
  });
  describe("reverse typings", () => {
    test("arrays", () => {
      const actual = pipe([1, 2, 3], reverse());
      assertType<Array<number>>(actual);
    });
    test("tuples", () => {
      const actual = pipe([1, 2, [true], "a"] as const, reverse());
      assertType<["a", readonly [true], 2, 1]>(actual);
    });

    test("variadic tuples", () => {
      const input: [number, ...Array<string>] = [1, "two", "three"];
      const actual = pipe(input, reverse());
      assertType<[...Array<string>, number]>(actual);
    });
  });
});
