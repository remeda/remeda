import { groupByProp } from "./groupByProp";
import { pipe } from "./pipe";

const SYMBOL = Symbol("sym");

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
    expect(
      groupByProp(
        [
          { 1: "cat", 2: 123 },
          { 1: "dog", 2: 456 },
          { 1: "dog", 2: 789 },
          { 1: "cat", 2: 101 },
        ],
        1,
      ),
    ).toStrictEqual({
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
    expect(
      groupByProp(
        [
          { [SYMBOL]: "cat", 2: 123 },
          { [SYMBOL]: "dog", 2: 456 },
          { [SYMBOL]: "dog", 2: 789 },
          { [SYMBOL]: "cat", 2: 101 },
        ],
        SYMBOL,
      ),
    ).toStrictEqual({
      cat: [
        { [SYMBOL]: "cat", 2: 123 },
        { [SYMBOL]: "cat", 2: 101 },
      ],
      dog: [
        { [SYMBOL]: "dog", 2: 456 },
        { [SYMBOL]: "dog", 2: 789 },
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
    expect(
      pipe(
        [
          { 1: "cat", 2: 123 },
          { 1: "dog", 2: 456 },
          { 1: "dog", 2: 789 },
          { 1: "cat", 2: 101 },
        ],
        groupByProp(1),
      ),
    ).toStrictEqual({
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
    expect(
      pipe(
        [
          { [SYMBOL]: "cat", 2: 123 },
          { [SYMBOL]: "dog", 2: 456 },
          { [SYMBOL]: "dog", 2: 789 },
          { [SYMBOL]: "cat", 2: 101 },
        ],
        groupByProp(SYMBOL),
      ),
    ).toStrictEqual({
      cat: [
        { [SYMBOL]: "cat", 2: 123 },
        { [SYMBOL]: "cat", 2: 101 },
      ],
      dog: [
        { [SYMBOL]: "dog", 2: 456 },
        { [SYMBOL]: "dog", 2: 789 },
      ],
    });
  });
});
