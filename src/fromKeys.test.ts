import { add } from "./add";
import { fromKeys } from "./fromKeys";
import { pipe } from "./pipe";

it("works on trivially empty arrays", () => {
  expect(fromKeys([] as Array<string>, (item) => `${item}_`)).toEqual({});
});

it("works on regular arrays", () => {
  expect(fromKeys(["a"], (item) => `${item}_`)).toEqual({ a: "a_" });
});

it("works with duplicates", () => {
  expect(fromKeys(["a", "a"], (item) => `${item}_`)).toEqual({ a: "a_" });
});

it("uses the last value", () => {
  let counter = 0;
  expect(
    fromKeys(["a", "a"], () => {
      counter += 1;
      return counter;
    }),
  ).toEqual({ a: 2 });
});

it("works with number keys", () => {
  expect(fromKeys([123], add(1))).toEqual({ 123: 124 });
});

it("works with symbols", () => {
  const symbol = Symbol("a");
  expect(fromKeys([symbol], () => 1)).toEqual({ [symbol]: 1 });
});

it("works with a mix of key types", () => {
  const symbol = Symbol("a");
  expect(fromKeys(["a", 123, symbol], (item) => typeof item)).toEqual({
    a: "string",
    123: "number",
    [symbol]: "symbol",
  });
});

describe("dataLast", () => {
  it("works on trivially empty arrays", () => {
    expect(
      pipe(
        [] as Array<string>,
        fromKeys((item) => `${item}_`),
      ),
    ).toEqual({});
  });

  it("works on regular arrays", () => {
    expect(
      pipe(
        ["a"],
        fromKeys((item) => `${item}_`),
      ),
    ).toEqual({ a: "a_" });
  });

  it("works with duplicates", () => {
    expect(
      pipe(
        ["a", "a"],
        fromKeys((item) => `${item}_`),
      ),
    ).toEqual({ a: "a_" });
  });

  it("uses the last value", () => {
    let counter = 0;
    expect(
      pipe(
        ["a", "a"],
        fromKeys(() => {
          counter += 1;
          return counter;
        }),
      ),
    ).toEqual({ a: 2 });
  });

  it("works with number keys", () => {
    expect(pipe([123], fromKeys(add(1)))).toEqual({ 123: 124 });
  });

  it("works with symbols", () => {
    const symbol = Symbol("a");
    expect(
      pipe(
        [symbol],
        fromKeys(() => 1),
      ),
    ).toEqual({ [symbol]: 1 });
  });

  it("works with a mix of key types", () => {
    const symbol = Symbol("a");
    expect(
      pipe(
        ["a", 123, symbol],
        fromKeys((item) => typeof item),
      ),
    ).toEqual({
      a: "string",
      123: "number",
      [symbol]: "symbol",
    });
  });
});
