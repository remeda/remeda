import { describe, expect, it, test } from "vitest";
import { isDeepEqual } from "./isDeepEqual";

describe("scalars", () => {
  test("equal numbers", () => {
    expect(isDeepEqual(1, 1)).toBe(true);
  });

  test("not equal numbers", () => {
    expect(isDeepEqual(1, 2)).toBe(false);
  });

  test("number and array are not equal", () => {
    expect(isDeepEqual(1 as unknown, [])).toBe(false);
  });

  test("0 and null are not equal", () => {
    expect(isDeepEqual(0 as unknown, null)).toBe(false);
  });

  test("equal strings", () => {
    expect(isDeepEqual("a", "a")).toBe(true);
  });

  test("not equal strings", () => {
    expect(isDeepEqual("a", "b")).toBe(false);
  });

  test("empty string and null are not equal", () => {
    expect(isDeepEqual("" as unknown, null)).toBe(false);
  });

  test("null is equal to null", () => {
    expect(isDeepEqual(null, null)).toBe(true);
  });

  test("equal booleans (true)", () => {
    expect(isDeepEqual(true, true)).toBe(true);
  });

  test("equal booleans (false)", () => {
    expect(isDeepEqual(false, false)).toBe(true);
  });

  test("not equal booleans", () => {
    expect(isDeepEqual(true, false)).toBe(false);
  });

  test("1 and true are not equal", () => {
    expect(isDeepEqual(1 as unknown, true)).toBe(false);
  });

  test("0 and false are not equal", () => {
    expect(isDeepEqual(0 as unknown, false)).toBe(false);
  });

  test("naN and NaN are equal", () => {
    expect(isDeepEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  test("0 and -0 are equal", () => {
    expect(isDeepEqual(0, -0)).toBe(true);
  });

  test("infinity and Infinity are equal", () => {
    expect(
      isDeepEqual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    ).toBe(true);
  });

  test("infinity and -Infinity are not equal", () => {
    expect(
      isDeepEqual(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY),
    ).toBe(false);
  });
});

describe("Objects", () => {
  test("empty objects are equal", () => {
    expect(isDeepEqual({}, {})).toBe(true);
  });

  test('equal objects (same properties "order")', () => {
    expect(isDeepEqual({ a: 1, b: "2" }, { a: 1, b: "2" })).toBe(true);
  });

  test('equal objects (different properties "order")', () => {
    expect(isDeepEqual({ a: 1, b: "2" }, { b: "2", a: 1 })).toBe(true);
  });

  test("not equal objects (extra property)", () => {
    expect(isDeepEqual({ a: 1, b: "2" }, { a: 1, b: "2", c: [] })).toBe(false);
  });

  test("not equal objects (different properties) #1", () => {
    expect(
      isDeepEqual({ a: 1, b: "2", c: 3 } as unknown, { a: 1, b: "2", d: 3 }),
    ).toBe(false);
  });

  test("not equal objects (different properties) #2", () => {
    expect(
      isDeepEqual({ a: 1, b: "2", c: 3 } as unknown, { a: 1, b: "2", d: 3 }),
    ).toBe(false);
  });

  test("equal objects (same sub-properties)", () => {
    expect(isDeepEqual({ a: [{ b: "c" }] }, { a: [{ b: "c" }] })).toBe(true);
  });

  test("not equal objects (different sub-property value)", () => {
    expect(isDeepEqual({ a: [{ b: "c" }] }, { a: [{ b: "d" }] })).toBe(false);
  });

  test("not equal objects (different sub-property)", () => {
    expect(
      isDeepEqual({ a: [{ b: "c" }] } as unknown, { a: [{ c: "c" }] }),
    ).toBe(false);
  });

  test("empty array and empty object are not equal", () => {
    expect(isDeepEqual({}, [])).toBe(false);
  });

  test("object with extra undefined properties are not equal #1", () => {
    expect(isDeepEqual({}, { foo: undefined })).toBe(false);
  });

  test("object with extra undefined properties are not equal #2", () => {
    expect(isDeepEqual({ foo: undefined } as unknown, {})).toBe(false);
  });

  test("object with extra undefined properties are not equal #3", () => {
    expect(isDeepEqual({ foo: undefined } as unknown, { bar: undefined })).toBe(
      false,
    );
  });

  test("nulls are equal", () => {
    expect(isDeepEqual(null, null)).toBe(true);
  });

  test("null and undefined are not equal", () => {
    expect(isDeepEqual(null as unknown, undefined)).toBe(false);
  });

  test("null and empty object are not equal", () => {
    expect(isDeepEqual(null as unknown, {})).toBe(false);
  });

  test("undefined and empty object are not equal", () => {
    expect(isDeepEqual(undefined as unknown, {})).toBe(false);
  });
});

describe("Sets", () => {
  test("two empty sets should be equal", () => {
    expect(isDeepEqual(new Set(), new Set())).toBe(true);
  });

  test("two sets of the same lenght should not be equal", () => {
    expect(isDeepEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  });

  test("two sets of with different primitive content should not be equal", () => {
    expect(isDeepEqual(new Set([1, 2, 4]), new Set([1, 2, 3]))).toBe(false);
  });

  test("two sets of with the same primitive content should equal", () => {
    expect(
      isDeepEqual(new Set([{ a: 1 }, { b: 3 }]), new Set([{ b: 3 }, { a: 1 }])),
    ).toBe(true);
  });

  test("two sets with duplicated non primitive content should not be equal", () => {
    expect(
      isDeepEqual(
        new Set([{ a: 1 }, { b: 3 }, { a: 1 }]),
        new Set([{ b: 3 }, { a: 1 }, { b: 3 }]),
      ),
    ).toBe(false);
  });

  test("two sets of Maps with the same values should be equal", () => {
    expect(
      isDeepEqual(
        new Set([new Map([["a", 123]]), new Map([["b", 456]])]),
        new Set([new Map([["b", 456]]), new Map([["a", 123]])]),
      ),
    ).toBe(true);
  });

  test("two sets with more than two items that are all equal should be equal", () => {
    expect(
      isDeepEqual(
        new Set([{ a: 1 }, { b: 3 }, { c: 4 }, { a: 1 }]),
        new Set([{ b: 3 }, { c: 4 }, { a: 1 }, { a: 1 }]),
      ),
    ).toBe(true);
  });
});

describe("Arrays", () => {
  test("two empty arrays are equal", () => {
    expect(isDeepEqual([], [])).toBe(true);
  });

  test("equal arrays", () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test("not equal arrays (different item)", () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  test("not equal arrays (different length)", () => {
    expect(isDeepEqual([1, 2, 3], [1, 2])).toBe(false);
  });

  test("equal arrays of objects", () => {
    expect(
      isDeepEqual([{ a: "a" }, { b: "b" }], [{ a: "a" }, { b: "b" }]),
    ).toBe(true);
  });

  test("not equal arrays of objects", () => {
    expect(
      isDeepEqual([{ a: "a" }, { b: "b" }], [{ a: "a" }, { b: "c" }]),
    ).toBe(false);
  });

  test("pseudo array and equivalent array are not equal", () => {
    expect(isDeepEqual({ "0": 0, "1": 1, length: 2 }, [0, 1])).toBe(false);
  });
});

describe("Maps", () => {
  it("works on shallow equal maps", () => {
    expect(isDeepEqual(new Map([["a", 1]]), new Map([["a", 1]]))).toBe(true);
  });

  test("two empty Maps should be equal", () => {
    expect(isDeepEqual(new Map(), new Map())).toBe(true);
  });

  it("two Maps with different size should not be equal", () => {
    expect(isDeepEqual(new Map(), new Map([["a", 1]]))).toBe(false);
  });

  it("two Maps with different keys shoud not be equal", () => {
    expect(
      isDeepEqual(
        new Map([
          ["a", 1],
          ["c", 2],
        ]),
        new Map([
          ["a", 1],
          ["b", 2],
        ]),
      ),
    ).toBe(false);
  });

  it("two maps with the same keys but with different values should not be equal", () => {
    expect(
      isDeepEqual(
        new Map([
          ["a", 1],
          ["b", 3],
          ["c", 2],
        ]),
        new Map([
          ["a", 1],
          ["b", 2],
          ["c", 2],
        ]),
      ),
    ).toBe(false);
  });

  it("two Maps with the same non primitives data should be equal", () => {
    expect(
      isDeepEqual(
        new Map([
          ["a", { a: [1, 2, 3] }],
          ["b", { a: [3] }],
          ["c", { b: [4] }],
        ]),
        new Map([
          ["a", { a: [1, 2, 3] }],
          ["b", { a: [3] }],
          ["c", { b: [4] }],
        ]),
      ),
    ).toBe(true);
  });
});

describe("Dates", () => {
  test("equal date objects", () => {
    expect(
      isDeepEqual(
        new Date("2017-06-16T21:36:48.362Z"),
        new Date("2017-06-16T21:36:48.362Z"),
      ),
    ).toBe(true);
  });

  test("not equal date objects", () => {
    expect(
      isDeepEqual(
        new Date("2017-06-16T21:36:48.362Z"),
        new Date("2017-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });

  test("date and string are not equal", () => {
    expect(
      isDeepEqual(
        new Date("2017-06-16T21:36:48.362Z") as unknown,
        "2017-06-16T21:36:48.362Z",
      ),
    ).toBe(false);
  });

  test("date and object are not equal", () => {
    expect(
      isDeepEqual(new Date("2017-06-16T21:36:48.362Z") as unknown, {}),
    ).toBe(false);
  });
});

describe("RegExp", () => {
  test("equal RegExp objects", () => {
    expect(isDeepEqual(/foo/u, /foo/u)).toBe(true);
  });

  test("not equal RegExp objects (different pattern)", () => {
    expect(isDeepEqual(/foo/u, /bar/u)).toBe(false);
  });

  test("not equal RegExp objects (different flags)", () => {
    expect(isDeepEqual(/foo/u, /foo/iu)).toBe(false);
  });

  test("regExp and string are not equal", () => {
    expect(isDeepEqual(/foo/u as unknown, "foo")).toBe(false);
  });

  test("regExp and object are not equal", () => {
    expect(isDeepEqual(/foo/u as unknown, {})).toBe(false);
  });
});

describe("functions", () => {
  test("same function is equal", () => {
    expect(isDeepEqual(func1, func1)).toBe(true);
  });

  test("different functions are not equal", () => {
    expect(isDeepEqual(func1, func2)).toBe(false);
  });
});

describe("sample objects", () => {
  test("big object", () => {
    expect(
      isDeepEqual(
        {
          prop1: "value1",
          prop2: "value2",
          prop3: "value3",
          prop4: {
            subProp1: "sub value1",
            subProp2: {
              subSubProp1: "sub sub value1",
              subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
            },
          },
          prop5: 1000,
          prop6: new Date(2016, 2, 10),
        },
        {
          prop5: 1000,
          prop3: "value3",
          prop1: "value1",
          prop2: "value2",
          prop6: new Date("2016/03/10"),
          prop4: {
            subProp2: {
              subSubProp1: "sub sub value1",
              subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
            },
            subProp1: "sub value1",
          },
        },
      ),
    ).toBe(true);
  });
});

/* v8 ignore next 3 -- We only need the function pointer, we never call it! */
function func1(): void {
  throw new Error("This function should never be called!");
}

/* v8 ignore next 3 -- We only need the function pointer, we never call it! */
function func2(): void {
  throw new Error("This function should never be called!");
}
