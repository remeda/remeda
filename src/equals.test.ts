import { equals } from "./equals";

function func1(): void {
  // (intentionally empty)
}
function func2(): void {
  // (intentionally empty)
}

describe("scalars", () => {
  test("equal numbers", () => {
    expect(equals(1, 1)).toBe(true);
  });
  test("not equal numbers", () => {
    expect(equals(1, 2)).toBe(false);
  });
  test("number and array are not equal", () => {
    expect(equals(1, [])).toBe(false);
  });
  test("0 and null are not equal", () => {
    expect(equals(0, null)).toBe(false);
  });
  test("equal strings", () => {
    expect(equals("a", "a")).toBe(true);
  });
  test("not equal strings", () => {
    expect(equals("a", "b")).toBe(false);
  });
  test("empty string and null are not equal", () => {
    expect(equals("", null)).toBe(false);
  });
  test("null is equal to null", () => {
    expect(equals(null, null)).toBe(true);
  });
  test("equal booleans (true)", () => {
    expect(equals(true, true)).toBe(true);
  });
  test("equal booleans (false)", () => {
    expect(equals(false, false)).toBe(true);
  });
  test("not equal booleans", () => {
    expect(equals(true, false)).toBe(false);
  });
  test("1 and true are not equal", () => {
    expect(equals(1, true)).toBe(false);
  });
  test("0 and false are not equal", () => {
    expect(equals(0, false)).toBe(false);
  });
  test("NaN and NaN are equal", () => {
    expect(equals(Number.NaN, Number.NaN)).toBe(true);
  });
  test("0 and -0 are equal", () => {
    expect(equals(0, -0)).toBe(true);
  });
  test("Infinity and Infinity are equal", () => {
    expect(equals(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(
      true,
    );
  });
  test("Infinity and -Infinity are not equal", () => {
    expect(equals(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBe(
      false,
    );
  });
});

describe("objects", () => {
  test("empty objects are equal", () => {
    expect(equals({}, {})).toBe(true);
  });
  test('equal objects (same properties "order")', () => {
    expect(equals({ a: 1, b: "2" }, { a: 1, b: "2" })).toBe(true);
  });
  test('equal objects (different properties "order")', () => {
    expect(equals({ a: 1, b: "2" }, { b: "2", a: 1 })).toBe(true);
  });
  test("not equal objects (extra property)", () => {
    expect(equals({ a: 1, b: "2" }, { a: 1, b: "2", c: [] })).toBe(false);
  });
  test("not equal objects (different properties) #1", () => {
    expect(equals({ a: 1, b: "2", c: 3 }, { a: 1, b: "2", d: 3 })).toBe(false);
  });
  test("not equal objects (different properties) #2", () => {
    expect(equals({ a: 1, b: "2", c: 3 }, { a: 1, b: "2", d: 3 })).toBe(false);
  });
  test("equal objects (same sub-properties)", () => {
    expect(equals({ a: [{ b: "c" }] }, { a: [{ b: "c" }] })).toBe(true);
  });
  test("not equal objects (different sub-property value)", () => {
    expect(equals({ a: [{ b: "c" }] }, { a: [{ b: "d" }] })).toBe(false);
  });
  test("not equal objects (different sub-property)", () => {
    expect(equals({ a: [{ b: "c" }] }, { a: [{ c: "c" }] })).toBe(false);
  });
  test("empty array and empty object are not equal", () => {
    expect(equals({}, [])).toBe(false);
  });
  test("object with extra undefined properties are not equal #1", () => {
    expect(equals({}, { foo: undefined })).toBe(false);
  });
  test("object with extra undefined properties are not equal #2", () => {
    expect(equals({ foo: undefined }, {})).toBe(false);
  });
  test("object with extra undefined properties are not equal #3", () => {
    expect(equals({ foo: undefined }, { bar: undefined })).toBe(false);
  });
  test("nulls are equal", () => {
    expect(equals(null, null)).toBe(true);
  });
  test("null and undefined are not equal", () => {
    expect(equals(null, undefined)).toBe(false);
  });
  test("null and empty object are not equal", () => {
    expect(equals(null, {})).toBe(false);
  });
  test("undefined and empty object are not equal", () => {
    expect(equals(undefined, {})).toBe(false);
  });
});

describe("arrays", () => {
  test("two empty arrays are equal", () => {
    expect(equals([], [])).toBe(true);
  });
  test("equal arrays", () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBe(true);
  });
  test("not equal arrays (different item)", () => {
    expect(equals([1, 2, 3], [1, 2, 4])).toBe(false);
  });
  test("not equal arrays (different length)", () => {
    expect(equals([1, 2, 3], [1, 2])).toBe(false);
  });
  test("equal arrays of objects", () => {
    expect(equals([{ a: "a" }, { b: "b" }], [{ a: "a" }, { b: "b" }])).toBe(
      true,
    );
  });
  test("not equal arrays of objects", () => {
    expect(equals([{ a: "a" }, { b: "b" }], [{ a: "a" }, { b: "c" }])).toBe(
      false,
    );
  });
  test("pseudo array and equivalent array are not equal", () => {
    expect(equals({ "0": 0, "1": 1, length: 2 }, [0, 1])).toBe(false);
  });
});

describe("Date objects", () => {
  test("equal date objects", () => {
    expect(
      equals(
        new Date("2017-06-16T21:36:48.362Z"),
        new Date("2017-06-16T21:36:48.362Z"),
      ),
    ).toBe(true);
  });
  test("not equal date objects", () => {
    expect(
      equals(
        new Date("2017-06-16T21:36:48.362Z"),
        new Date("2017-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });
  test("date and string are not equal", () => {
    expect(
      equals(new Date("2017-06-16T21:36:48.362Z"), "2017-06-16T21:36:48.362Z"),
    ).toBe(false);
  });
  test("date and object are not equal", () => {
    expect(equals(new Date("2017-06-16T21:36:48.362Z"), {})).toBe(false);
  });
});

describe("RegExp objects", () => {
  test("equal RegExp objects", () => {
    expect(equals(/foo/u, /foo/u)).toBe(true);
  });
  test("not equal RegExp objects (different pattern)", () => {
    expect(equals(/foo/u, /bar/u)).toBe(false);
  });
  test("not equal RegExp objects (different flags)", () => {
    expect(equals(/foo/u, /foo/iu)).toBe(false);
  });
  test("RegExp and string are not equal", () => {
    expect(equals(/foo/u, "foo")).toBe(false);
  });
  test("RegExp and object are not equal", () => {
    expect(equals(/foo/u, {})).toBe(false);
  });
});

describe("functions", () => {
  test("same function is equal", () => {
    expect(equals(func1, func1)).toBe(true);
  });
  test("different functions are not equal", () => {
    expect(equals(func1, func2)).toBe(false);
  });
});

describe("sample objects", () => {
  test("big object", () => {
    expect(
      equals(
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
