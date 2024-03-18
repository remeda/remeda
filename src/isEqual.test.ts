import { hasPropSatisfying } from "./hasPropSatisfying";
import { isEqual } from "./isEqual";
import { pipe } from "./pipe";

describe("data-first", () => {
  it("should return true for two equal primitive values", () => {
    expect(isEqual(2, 2)).toBe(true);
    expect(isEqual("hello", "hello")).toBe(true);
    expect(isEqual(false, false)).toBe(true);
  });

  it("should return false for two different primitive values", () => {
    expect(isEqual(2, 3)).toBe(false);
    expect(isEqual("hello", "world")).toBe(false);
    expect(isEqual(false, true)).toBe(false);
  });

  it("should return false when passed two different types", () => {
    // @ts-expect-error these types don't overlap
    expect(isEqual(2, "2")).toBe(false);
  });

  it("should return true for two referrentially equal values", () => {
    const obj = {};
    expect(isEqual(obj, obj)).toBe(true);

    const arr = [123];
    expect(isEqual(arr, arr)).toBe(true);

    const sym = Symbol("foo");
    expect(isEqual(sym, sym)).toBe(true);
  });

  it("should return false when passed two different objects even if they are shallowly equal", () => {
    expect(isEqual({ foo: 1 }, { foo: 1 })).toBe(false);
    expect(isEqual([1, 2], [1, 2])).toBe(false);
  });

  it("should use Object.is equality logic", () => {
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(false);
  });

  it("should narrow the type of the first value to match that of the second value", () => {
    const status = "pending" as "fulfilled" | "pending" | "rejected";
    if (isEqual(status, "pending")) {
      expectTypeOf(status).toEqualTypeOf<"pending">();
    }

    const count = 2 as 1 | 2 | 3;
    if (isEqual(count, 2)) {
      expectTypeOf(count).toEqualTypeOf<2>();
    }
  });

  it("should narrow the type of the first value, even when it's a broader type", () => {
    const stringValue = "pending" as string;
    if (isEqual(stringValue, "pending")) {
      expectTypeOf(stringValue).toEqualTypeOf<"pending">();
    }

    const count = 2 as number;
    if (isEqual(count, 2)) {
      expectTypeOf(count).toEqualTypeOf<2>();
    }
  });

  it("should leave the type unmodified when comparing an object to itself", () => {
    const obj = { foo: "bar" };
    if (isEqual(obj, obj)) {
      expectTypeOf(obj).toEqualTypeOf<{ foo: string }>();
    }
  });

  describe("interactions", () => {
    it("should work together with hasPropSatisfying to narrow the types of object unions", () => {
      const obj = { type: "foo", foo: 1 } as
        | { type: "bar"; bar: string }
        | { type: "foo"; foo: number };
      if (hasPropSatisfying(obj, "type", isEqual("foo"))) {
        expectTypeOf(obj).toEqualTypeOf<{ type: "foo"; foo: number }>();
      }
    });
  });
});

describe("data-last", () => {
  it("should return true for two equal primitive values", () => {
    expect(pipe(2, isEqual(2))).toBe(true);
    expect(pipe("hello", isEqual("hello"))).toBe(true);
    expect(pipe(false, isEqual(false))).toBe(true);
  });

  it("should return false for two different primitive values", () => {
    expect(pipe(2, isEqual(3))).toBe(false);
    expect(pipe("hello", isEqual("world"))).toBe(false);
    expect(pipe(false, isEqual(true))).toBe(false);
  });

  it("should return false when passed two different types", () => {
    // @ts-expect-error these types don't overlap
    expect(pipe(2, isEqual("2"))).toBe(false);
  });

  it("should return true for two referrentially equal values", () => {
    const obj = {};
    expect(pipe(obj, isEqual(obj))).toBe(true);

    const arr = [123];
    expect(pipe(arr, isEqual(arr))).toBe(true);

    const sym = Symbol("foo");
    expect(pipe(sym, isEqual(sym))).toBe(true);
  });

  it("should return false when passed two different objects even if they are shallowly equal", () => {
    expect(pipe({ foo: 1 }, isEqual({ foo: 1 }))).toBe(false);
    expect(pipe([1, 2], isEqual([1, 2]))).toBe(false);
  });

  it("should use Object.is equality logic", () => {
    expect(pipe(NaN, isEqual(NaN))).toBe(true);
    expect(pipe(0, isEqual(-0))).toBe(false);
  });

  it("should narrow the type of an array when filtering", () => {
    const statuses = ["pending", "fulfilled", "rejected"] as const;
    const pendingStatuses = statuses.filter(isEqual("pending"));
    expectTypeOf(pendingStatuses).toEqualTypeOf<Array<"pending">>();

    const counts = [1, 2, 3] as const;
    const twos = counts.filter(isEqual(2));
    expectTypeOf(twos).toEqualTypeOf<Array<2>>();
  });

  it("should narrow the type of an array when filtering, even if the array has a broder type", () => {
    const statuses = ["pending", "fulfilled", "rejected"] as Array<string>;
    const pendingStatuses = statuses.filter(isEqual("pending"));
    expectTypeOf(pendingStatuses).toEqualTypeOf<Array<"pending">>();

    const counts = [1, 2, 3] as Array<number>;
    const twos = counts.filter(isEqual(2));
    expectTypeOf(twos).toEqualTypeOf<Array<2>>();
  });

  describe("interactions", () => {
    it("should work together with hasPropSatisfying to narrow the types of object unions", () => {
      const obj = [{ type: "foo", foo: 1 }] as Array<
        { type: "bar"; bar: string } | { type: "foo"; foo: number }
      >;
      const foos = obj.filter(hasPropSatisfying("type", isEqual("foo")));
      expectTypeOf(foos).toEqualTypeOf<Array<{ type: "foo"; foo: number }>>();
    });
  });
});
