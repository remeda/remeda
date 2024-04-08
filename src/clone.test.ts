/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- FIXME! */

import { clone } from "./clone";

const eq = (a: any, b: any): void => {
  expect(a).toEqual(b);
};

const fn = (x: number): number => x + x;

describe("deep clone integers, strings and booleans", () => {
  it("clones integers", () => {
    eq(clone(-4), -4);
    eq(clone(9_007_199_254_740_991), 9_007_199_254_740_991);
  });

  it("clones floats", () => {
    eq(clone(-4.5), -4.5);
    eq(clone(0), 0);
  });

  it("clones strings", () => {
    eq(clone("foo"), "foo");
  });

  it("clones booleans", () => {
    eq(clone(true), true);
  });
});

describe("deep clone objects", () => {
  it("clones shallow object", () => {
    const obj = { a: 1, b: "foo", c: true, d: new Date(2013, 11, 25) };
    const cloned = clone(obj);
    obj.c = false;
    obj.d.setDate(31);
    eq(cloned, { a: 1, b: "foo", c: true, d: new Date(2013, 11, 25) });
  });

  it("clones deep object", () => {
    const obj = { a: { b: { c: "foo" } } };
    const cloned = clone(obj);
    obj.a.b.c = "bar";
    eq(cloned, { a: { b: { c: "foo" } } });
  });

  it("clones objects with circular references", () => {
    const x: any = { c: null };
    const y = { a: x };
    const z = { b: y };
    x.c = z;
    const cloned = clone(x);
    assert.notStrictEqual(x, cloned);
    assert.notStrictEqual(x.c, cloned.c);
    assert.notStrictEqual(x.c.b, cloned.c.b);
    assert.notStrictEqual(x.c.b.a, cloned.c.b.a);
    assert.notStrictEqual(x.c.b.a.c, cloned.c.b.a.c);
    eq(Object.keys(cloned), Object.keys(x));
    eq(Object.keys(cloned.c), Object.keys(x.c));
    eq(Object.keys(cloned.c.b), Object.keys(x.c.b));
    eq(Object.keys(cloned.c.b.a), Object.keys(x.c.b.a));
    eq(Object.keys(cloned.c.b.a.c), Object.keys(x.c.b.a.c));

    x.c.b = 1;
    assert.notDeepEqual(cloned.c.b, x.c.b);
  });
});

describe("deep clone arrays", () => {
  it("clones shallow arrays", () => {
    const list = [1, 2, 3];
    const cloned = clone(list);
    list.pop();
    eq(cloned, [1, 2, 3]);
  });

  it("clones deep arrays", () => {
    const list: any = [1, [1, 2, 3], [[[5]]]];
    const cloned = clone(list);

    assert.notStrictEqual(list, cloned);
    assert.notStrictEqual(list[2], cloned[2]);
    assert.notStrictEqual(list[2][0], cloned[2][0]);

    eq(cloned, [1, [1, 2, 3], [[[5]]]]);
  });
});

describe("deep clone functions", () => {
  it("keep reference to function", () => {
    const list = [{ a: fn }] as const;

    const cloned = clone(list);

    eq(cloned[0].a(10), 20);
    eq(list[0].a, cloned[0].a);
  });
});

describe("built-in types", () => {
  it("clones Date object", () => {
    const date = new Date(2014, 10, 14, 23, 59, 59, 999);

    const cloned = clone(date);

    assert.notStrictEqual(date, cloned);
    eq(cloned, new Date(2014, 10, 14, 23, 59, 59, 999));

    eq(cloned.getDay(), 5); // friday
  });

  it.each([
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
    assert.notStrictEqual(cloned, pattern);
    eq(cloned.constructor, RegExp);
    eq(cloned.source, pattern.source);
    eq(cloned.global, pattern.global);
    eq(cloned.ignoreCase, pattern.ignoreCase);
    eq(cloned.multiline, pattern.multiline);
  });
});

describe("deep clone deep nested mixed objects", () => {
  it("clones array with objects", () => {
    const list: any = [{ a: { b: 1 } }, [{ c: { d: 1 } }]];
    const cloned = clone(list);
    list[1][0] = null;
    eq(cloned, [{ a: { b: 1 } }, [{ c: { d: 1 } }]]);
  });

  it("clones array with arrays", () => {
    const list: Array<Array<any>> = [[1], [[3]]];
    const cloned = clone(list);
    list[1]![0] = null;
    eq(cloned, [[1], [[3]]]);
  });

  it("clones array with mutual ref object", () => {
    const obj = { a: 1 };
    const list = [{ b: obj }, { b: obj }];
    const cloned = clone(list);

    assert.strictEqual(list[0]?.b, list[1]?.b);
    assert.strictEqual(cloned[0]?.b, cloned[1]?.b);
    assert.notStrictEqual(cloned[0]?.b, list[0]?.b);
    assert.notStrictEqual(cloned[1]?.b, list[1]?.b);

    eq(cloned[0]?.b, { a: 1 });
    eq(cloned[1]?.b, { a: 1 });

    obj.a = 2;
    eq(cloned[0]?.b, { a: 1 });
    eq(cloned[1]?.b, { a: 1 });
  });
});

describe("deep clone edge cases", () => {
  it("nulls, undefineds and empty objects and arrays", () => {
    eq(clone(null), null);
    eq(clone(undefined), undefined);
    assert.notStrictEqual(clone(undefined), null);

    const obj = {};
    assert.notStrictEqual(clone(obj), obj);

    const list: any = [];
    assert.notStrictEqual(clone(list), list);
  });
});

describe("deep clone using attached clone function", () => {
  test("calls the clone function on the object if it exists", () => {
    const cloneMock = vi.fn();
    clone({ clone: cloneMock });
    expect(cloneMock).toHaveBeenCalled();
  });
});
