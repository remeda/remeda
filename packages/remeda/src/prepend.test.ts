import { prepend } from "./prepend";
import { toBasicIterable } from "./internal/toBasicIterable";
import { pipe } from "./pipe";

describe("prepend", () => {
  test("data first on arrays", () => {
    const actual = prepend([1, 2, 3] as const, ["a"] as const);

    expect(actual).toStrictEqual(["a", 1, 2, 3] as const);
  });

  test("data first on iterables", () => {
    const actual = prepend(toBasicIterable([1, 2, 3]), toBasicIterable(["a"]));

    expect(actual).toStrictEqual(["a", 1, 2, 3] as const);
  });

  test("data last on arrays", () => {
    const actual = pipe([1, 2, 3] as const, prepend(["a"] as const));

    expect(actual).toStrictEqual(["a", 1, 2, 3]);
  });

  test("data last on iterables", () => {
    const actual = pipe(
      toBasicIterable([1, 2, 3]),
      prepend(toBasicIterable(["a"])),
    );

    expect(actual).toStrictEqual(["a", 1, 2, 3]);
  });
});
