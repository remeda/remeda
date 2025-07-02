import { describe, expectTypeOf, it, test } from "vitest";
import { constant } from "./constant";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";

const DATA = [
  { id: 1, color: "red", weight: 2, active: true, date: new Date(2021, 1, 1) },
  {
    id: 2,
    color: "blue",
    weight: 3,
    active: false,
    date: new Date(2021, 1, 2),
  },
  {
    id: 3,
    color: "green",
    weight: 1,
    active: false,
    date: new Date(2021, 1, 3),
  },
  {
    id: 4,
    color: "purple",
    weight: 1,
    active: true,
    date: new Date(2021, 1, 4),
  },
];

describe("dataFirst", () => {
  test("sortProjection", () => {
    const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
    const actual = sortBy(items, prop("a"));

    expectTypeOf(actual).toExtend<Array<(typeof items)[number]>>();
  });

  test("sortPair", () => {
    const actual = sortBy(DATA, [(x) => x.active, "desc"]);

    expectTypeOf(actual).toEqualTypeOf<Array<(typeof DATA)[number]>>();
  });
});

describe("dataLast", () => {
  test("sortProjection", () => {
    const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
    const actual = pipe(items, sortBy(prop("a")));

    expectTypeOf(actual).toExtend<Array<(typeof items)[number]>>();
  });

  test("sortPair", () => {
    const actual = pipe(
      DATA,
      sortBy([prop("weight"), "asc"], [prop("color"), "desc"]),
    );

    expectTypeOf(actual).toEqualTypeOf<Array<(typeof DATA)[number]>>();
  });
});

it("on empty tuple", () => {
  const result = sortBy([] as [], identity);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

it("on empty readonly tuple", () => {
  const result = sortBy([] as const, identity);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

it("on array", () => {
  const result = sortBy([] as Array<number>, identity);

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("on readonly array", () => {
  const result = sortBy([] as ReadonlyArray<number>, identity);

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("on tuple", () => {
  const result = sortBy([1, 2, 3] as [1, 2, 3], identity);

  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

it("on readonly tuple", () => {
  const result = sortBy([1, 2, 3] as const, identity);

  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

it("on tuple with rest tail", () => {
  const result = sortBy([1] as [number, ...Array<number>], identity);

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

it("on readonly tuple with rest tail", () => {
  const result = sortBy([1] as readonly [number, ...Array<number>], identity);

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

test("on tuple with rest middle", () => {
  const result = sortBy(
    [3, 2, 1] as [number, ...Array<number>, number],
    identity,
  );

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
});

test("on readonly tuple with rest middle", () => {
  const result = sortBy(
    [3, 2, 1] as readonly [number, ...Array<number>, number],
    identity,
  );

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
});

it("on tuple with rest head", () => {
  const result = sortBy([1] as [...Array<number>, number], identity);

  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

it("on readonly tuple with rest head", () => {
  const result = sortBy([1] as readonly [...Array<number>, number], identity);

  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

test("on tuple with optional values", () => {
  const result = sortBy([] as [number?, number?, number?], constant(0));

  expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
});

test("on readonly tuple with optional values", () => {
  const result = sortBy(
    [] as readonly [number?, number?, number?],
    constant(0),
  );

  expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
});

it("on mixed types tuple", () => {
  const result = sortBy(
    [1, "hello", true] as [number, string, boolean],
    identity,
  );

  expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
  >();
});
