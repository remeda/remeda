import { groupByProp } from "./groupByProp";
import { pipe } from "./pipe";

describe("data first", () => {
  it("must be grouped correctly by string", () => {
    expect(
      groupByProp(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        "a",
      ),
    ).toStrictEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });

  it("must be grouped correctly by number", () => {
    const data = groupByProp(
      [
        { 1: "cat", 2: 123 },
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
        { 1: "cat", 2: 101 },
      ],
      1,
    );

    expect(data).toStrictEqual({
      cat: [
        { 1: "cat", 2: 123 },
        { 1: "cat", 2: 101 },
      ],
      dog: [
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
      ],
    });
  });

  it("must be grouped correctly by Symbol", () => {
    const sym = Symbol("sym");
    const data = groupByProp(
      [
        { [sym]: "cat", 2: 123 },
        { [sym]: "dog", 2: 456 },
        { [sym]: "dog", 2: 789 },
        { [sym]: "cat", 2: 101 },
      ],
      sym,
    );

    expect(data).toStrictEqual({
      cat: [
        { [sym]: "cat", 2: 123 },
        { [sym]: "cat", 2: 101 },
      ],
      dog: [
        { [sym]: "dog", 2: 456 },
        { [sym]: "dog", 2: 789 },
      ],
    });
  });
});

describe("data last", () => {
  it("must be grouped correctly by string", () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        groupByProp("a"),
      ),
    ).toStrictEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });

  it("must be grouped correctly by number", () => {
    const data = pipe(
      [
        { 1: "cat", 2: 123 },
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
        { 1: "cat", 2: 101 },
      ],
      groupByProp(1),
    );

    expect(data).toStrictEqual({
      cat: [
        { 1: "cat", 2: 123 },
        { 1: "cat", 2: 101 },
      ],
      dog: [
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
      ],
    });
  });

  it("must be grouped correctly by Symbol", () => {
    const sym = Symbol("sym");
    const data = pipe(
      [
        { [sym]: "cat", 2: 123 },
        { [sym]: "dog", 2: 456 },
        { [sym]: "dog", 2: 789 },
        { [sym]: "cat", 2: 101 },
      ],
      groupByProp(sym),
    );

    expect(data).toStrictEqual({
      cat: [
        { [sym]: "cat", 2: 123 },
        { [sym]: "cat", 2: 101 },
      ],
      dog: [
        { [sym]: "dog", 2: 456 },
        { [sym]: "dog", 2: 789 },
      ],
    });
  });
});
