import { fromEntries } from "./fromEntries";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      fromEntries([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]),
    ).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        [
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ] as const,
        fromEntries(),
      ),
    ).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test("empty array", () => {
    expect(fromEntries([])).toStrictEqual({});
  });

  test("Single entry", () => {
    expect(fromEntries([["a", 1]])).toStrictEqual({ a: 1 });
  });

  test("boolean values", () => {
    expect(
      fromEntries([
        ["hello", true],
        ["world", false],
      ]),
    ).toStrictEqual({ hello: true, world: false });
  });

  test("string values", () => {
    expect(fromEntries([["a", "d"]])).toStrictEqual({ a: "d" });
  });

  test("number keys and values", () => {
    expect(fromEntries([[1, 123]])).toStrictEqual({ 1: 123 });
  });
});
