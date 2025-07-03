/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import { describe, expect, test } from "vitest";
import { clone } from "./clone";

describe("primitive types", () => {
  test("number", () => {
    expect(clone(0)).toBe(0);
    expect(clone(4)).toBe(4);
    expect(clone(-4)).toBe(-4);
    expect(clone(4.5)).toBe(4.5);
    expect(clone(9_007_199_254_740_991)).toBe(9_007_199_254_740_991);
  });

  test("string", () => {
    expect(clone("foo")).toBe("foo");
    expect(clone("")).toBe("");
  });

  test("boolean", () => {
    expect(clone(true)).toBe(true);
    expect(clone(false)).toBe(false);
  });
});

describe("objects", () => {
  test("clones shallow object", () => {
    const obj = { a: 1, b: "foo", c: true, d: new Date(2013, 11, 25) };
    const cloned = clone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned).toStrictEqual(obj);

    obj.c = false;
    obj.d.setDate(31);

    expect(cloned).toStrictEqual({
      a: 1,
      b: "foo",
      c: true,
      d: new Date(2013, 11, 25),
    });
  });

  test("clones deep object", () => {
    const obj = { a: { b: { c: "foo" } } };
    const cloned = clone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned).toStrictEqual(obj);

    obj.a.b.c = "bar";

    expect(cloned).toStrictEqual({ a: { b: { c: "foo" } } });
  });

  test("clones objects with circular references", () => {
    const x: any = { c: null };
    const y = { a: x };
    const z = { b: y };
    x.c = z;
    const cloned = clone(x);

    expect(cloned).not.toBe(x);
    expect(cloned).toStrictEqual(x);

    expect(cloned.c).not.toBe(x.c);
    expect(cloned.c).toStrictEqual(x.c);

    expect(cloned.c.b).not.toBe(x.c.b);
    expect(cloned.c.b).toStrictEqual(x.c.b);

    expect(cloned.c.b.a).not.toBe(x.c.b.a);
    expect(cloned.c.b.a).toStrictEqual(x.c.b.a);

    expect(cloned.c.b.a.c).not.toBe(x.c.b.a.c);
    expect(cloned.c.b.a.c).toStrictEqual(x.c.b.a.c);

    x.c.b = 1;

    expect(cloned.c.b).not.toStrictEqual(x.c.b);
  });
});

describe("arrays", () => {
  test("clones shallow arrays", () => {
    const list = [1, 2, 3];
    const cloned = clone(list);

    expect(cloned).not.toBe(list);
    expect(cloned).toStrictEqual(list);

    list.pop();

    expect(cloned).not.toStrictEqual(list);
    expect(cloned).toStrictEqual([1, 2, 3]);
  });

  test("clones deep arrays", () => {
    const list: any = [1, [1, 2, 3], [[[5]]]];
    const cloned = clone(list);

    expect(cloned).not.toBe(list);
    expect(cloned).toStrictEqual(list);

    expect(cloned[2]).not.toBe(list[2]);
    expect(cloned[2]).toStrictEqual(list[2]);

    expect(cloned[2][0]).not.toBe(list[2][0]);
    expect(cloned[2][0]).toStrictEqual(list[2][0]);

    expect(cloned).toStrictEqual([1, [1, 2, 3], [[[5]]]]);
  });
});

describe("functions", () => {
  test("keep reference to function", () => {
    const list = [{ a: (x: number): number => x + x }] as const;
    const cloned = clone(list);

    expect(cloned).not.toBe(list);
    expect(cloned).toStrictEqual(list);

    expect(cloned[0].a(10)).toBe(20);
    expect(list[0].a).toBe(cloned[0].a);
  });
});

describe("built-in types", () => {
  test("clones Date object", () => {
    const date = new Date(2014, 10, 14, 23, 59, 59, 999);

    const cloned = clone(date);

    expect(cloned).not.toBe(date);
    expect(cloned).toStrictEqual(new Date(2014, 10, 14, 23, 59, 59, 999));

    expect(cloned.getDay()).toBe(5); // friday
  });

  test.each([
    /x/u,
    /x/gu,
    /x/iu,
    /x/mu,
    /x/giu,
    /x/gmu,
    /x/imu,
    /x/gimu,
    /x/uy,
    // eslint-disable-next-line require-unicode-regexp -- we want to test the negative case
    /x/,
  ])("clones RegExp object: %s", (pattern) => {
    const cloned = clone(pattern);

    expect(cloned).not.toBe(pattern);
    expect(cloned).toStrictEqual(pattern);
    expect(cloned.constructor).toStrictEqual(RegExp);
    expect(cloned.source).toStrictEqual(pattern.source);
    expect(cloned.global).toStrictEqual(pattern.global);
    expect(cloned.ignoreCase).toStrictEqual(pattern.ignoreCase);
    expect(cloned.multiline).toStrictEqual(pattern.multiline);
  });
});

describe("nested mixed objects", () => {
  test("clones array with objects", () => {
    const list: any = [{ a: { b: 1 } }, [{ c: { d: 1 } }]];
    const cloned = clone(list);
    list[1][0] = null;

    expect(cloned).toStrictEqual([{ a: { b: 1 } }, [{ c: { d: 1 } }]]);
  });

  describe("clones array with arrays", () => {
    test("nulls", () => {
      const list: Array<Array<any>> = [[1], [[3]]];
      const cloned = clone(list);
      list[1]![0] = null;

      expect(cloned).toStrictEqual([[1], [[3]]]);
    });

    test("clones array with mutual ref object", () => {
      const obj = { a: 1 };
      const list = [{ b: obj }, { b: obj }];
      const cloned = clone(list);

      expect(cloned[0]?.b).toBe(cloned[1]?.b);

      expect(cloned[0]?.b).not.toBe(list[0]?.b);
      expect(cloned[0]?.b).toStrictEqual(list[0]?.b);
      expect(cloned[1]?.b).not.toBe(list[1]?.b);
      expect(cloned[1]?.b).toStrictEqual(list[1]?.b);

      expect(cloned[0]?.b).toStrictEqual({ a: 1 });
      expect(cloned[1]?.b).toStrictEqual({ a: 1 });

      obj.a = 2;

      expect(cloned[0]?.b).toStrictEqual({ a: 1 });
      expect(cloned[1]?.b).toStrictEqual({ a: 1 });
    });
  });
});

describe("edge cases", () => {
  test("undefined", () => {
    expect(clone(undefined)).toBeUndefined();
  });

  test("nulls", () => {
    expect(clone(null)).toBeNull();
  });

  test("empty object", () => {
    const obj = {} as const;

    expect(clone(obj)).not.toBe(obj);
  });

  test("empty array", () => {
    const array = [] as const;

    expect(clone(array)).not.toBe(array);
  });
});
