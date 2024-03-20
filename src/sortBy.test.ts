import { constant } from "./constant";
import { identity } from "./identity";
import { map } from "./map";
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

describe("data first", () => {
  test("sort correctly", () => {
    expect(sortBy([{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }], prop("a"))).toEqual(
      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }],
    );
  });

  test("sort booleans correctly", () => {
    expect(sortBy(DATA, [prop("active"), "desc"]).map(prop("active"))).toEqual([
      true,
      true,
      false,
      false,
    ]);
  });

  test("sort dates correctly", () => {
    expect(sortBy(DATA, [prop("date"), "desc"]).map(prop("id"))).toEqual([
      4, 3, 2, 1,
    ]);
  });

  test("sort objects correctly", () => {
    expect(
      sortBy(DATA, prop("weight"), prop("color")).map(prop("weight")),
    ).toEqual([1, 1, 2, 3]);
  });

  test("sort objects correctly mixing sort pair and sort projection", () => {
    expect(
      sortBy(DATA, prop("weight"), [prop("color"), "asc"]).map(prop("weight")),
    ).toEqual([1, 1, 2, 3]);
  });

  test("sort objects descending correctly", () => {
    expect(sortBy(DATA, [prop("weight"), "desc"]).map(prop("weight"))).toEqual([
      3, 2, 1, 1,
    ]);
  });
});

describe("data last", () => {
  test("sort correctly", () => {
    expect(
      pipe([{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }], sortBy(prop("a"))),
    ).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]);
  });

  test('sort correctly using pipe and "desc"', () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
        sortBy([prop("a"), "desc"]),
      ),
    ).toEqual([{ a: 7 }, { a: 3 }, { a: 2 }, { a: 1 }]);
  });

  test("sort objects correctly", () => {
    expect(
      pipe(DATA, sortBy(prop("weight"), prop("color")), map(prop("color"))),
    ).toEqual(["green", "purple", "red", "blue"]);
  });

  test("sort objects correctly by weight asc then color desc", () => {
    expect(
      pipe(
        DATA,
        sortBy([prop("weight"), "asc"], [prop("color"), "desc"]),
        map(prop("color")),
      ),
    ).toEqual(["purple", "green", "red", "blue"]);
  });
});

describe("typing", () => {
  describe("dataFirst", () => {
    test("SortProjection", () => {
      const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
      const actual = sortBy(items, prop("a"));
      expectTypeOf(actual).toMatchTypeOf<Array<(typeof items)[number]>>();
    });

    test("SortPair", () => {
      const actual = sortBy(DATA, [(x) => x.active, "desc"]);
      expectTypeOf(actual).toEqualTypeOf<Array<(typeof DATA)[number]>>();
    });
  });

  describe("dataLast", () => {
    test("SortProjection", () => {
      const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
      const actual = pipe(items, sortBy(prop("a")));
      expectTypeOf(actual).toMatchTypeOf<Array<(typeof items)[number]>>();
    });

    test("SortPair", () => {
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
});
