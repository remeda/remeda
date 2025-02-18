import { countBy } from "./countBy";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("countBy", () => {
    const data = [1, 2, 3, 2, 1, 5];
    const result = countBy(data, (x) => x);

    expect(result).toStrictEqual({ 1: 2, 2: 2, 3: 1, 5: 1 });
  });

  test("array of strings", () => {
    const data = ["a", "b", "c", "B", "A", "a"];
    const result = countBy(data, (x) => x.toLowerCase());

    expect(result).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  test("array of objects", () => {
    const data = [
      { id: 1, category: "A" },
      { id: 2, category: "B" },
      { id: 3, category: "A" },
    ];
    const result = countBy(data, (x) => x.category);

    expect(result).toStrictEqual({ A: 2, B: 1 });
  });

  test("symbols", () => {
    const mySymbolA = Symbol("mySymbolA");
    const mySymbolB = Symbol("mySymbolB");
    const data = [mySymbolA, mySymbolB, mySymbolA];
    const result = countBy(data, (x) => x);

    expect(result).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  test("mixed data types", () => {
    const mySymbol = Symbol("mySymbol");
    const data = [1, "a", 1, mySymbol, "A", mySymbol];
    const result = countBy(data, (x) =>
      typeof x === "string" ? x.toLowerCase() : x,
    );

    expect(result).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  test("indexed", () => {
    const data = [1, 2, 3, 2, 1];
    const result = countBy(data, (_, index) =>
      index % 2 === 0 ? "even" : "odd",
    );

    expect(result).toStrictEqual({ even: 3, odd: 2 });
  });
});

describe("dataLast", () => {
  test("countBy", () => {
    const data = [1, 2, 3, 2, 1, 5];
    const result = pipe(
      data,
      countBy((x) => x),
    );

    expect(result).toStrictEqual({ 1: 2, 2: 2, 3: 1, 5: 1 });
  });

  test("array of strings", () => {
    const data = ["a", "b", "c", "B", "A", "a"];
    const result = pipe(
      data,
      countBy((x) => x.toLowerCase()),
    );

    expect(result).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  test("array of objects", () => {
    const data = [
      { id: 1, category: "A" },
      { id: 2, category: "B" },
      { id: 3, category: "A" },
    ];
    const result = pipe(
      data,
      countBy((x) => x.category),
    );

    expect(result).toStrictEqual({ A: 2, B: 1 });
  });

  test("symbols", () => {
    const mySymbolA = Symbol("mySymbolA");
    const mySymbolB = Symbol("mySymbolB");
    const data = [mySymbolA, mySymbolB, mySymbolA];
    const result = pipe(
      data,
      countBy((x) => x),
    );

    expect(result).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  test("mixed data types", () => {
    const mySymbol = Symbol("mySymbol");
    const data = [1, "a", 1, mySymbol, "A", mySymbol];
    const result = pipe(
      data,
      countBy((x) => (typeof x === "string" ? x.toLowerCase() : x)),
    );

    expect(result).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  test("indexed", () => {
    const data = [1, 2, 3, 2, 1];
    const result = pipe(
      data,
      countBy((_, index) => (index % 2 === 0 ? "even" : "odd")),
    );

    expect(result).toStrictEqual({ even: 3, odd: 2 });
  });
});

test("empty array", () => {
  const result = countBy([], (x) => x);

  expect(result).toStrictEqual({});
});
