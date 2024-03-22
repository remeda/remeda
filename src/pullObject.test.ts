import { add } from "./add";
import { constant } from "./constant";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { pullObject } from "./pullObject";

describe("runtime", () => {
  describe("dataFirst", () => {
    test("empty array", () => {
      expect(pullObject([], constant("key"), constant("value"))).toStrictEqual(
        {},
      );
    });

    test("number items", () => {
      expect(
        pullObject([1, 2], (item) => `item_${item}`, add(2)),
      ).toStrictEqual({
        item_1: 3,
        item_2: 4,
      });
    });

    test("string items", () => {
      expect(
        pullObject(
          ["a", "b"],
          (item) => `item_${item}`,
          (item) => item.toUpperCase(),
        ),
      ).toStrictEqual({ item_a: "A", item_b: "B" });
    });

    test("object items", () => {
      expect(
        pullObject(
          [
            { key: "a", value: 1 },
            { key: "b", value: 2 },
          ],
          prop("key"),
          prop("value"),
        ),
      ).toStrictEqual({ a: 1, b: 2 });
    });

    test("number keys", () => {
      expect(
        pullObject(["a", "aa"], (item) => item.length, identity),
      ).toStrictEqual({
        1: "a",
        2: "aa",
      });
    });

    test("undefined values", () => {
      expect(pullObject(["a"], identity, constant(undefined))).toStrictEqual({
        a: undefined,
      });
    });

    test("last value wins", () => {
      expect(
        pullObject(
          [
            { id: "a", val: "hello" },
            { id: "a", val: "world" },
          ],
          prop("id"),
          prop("val"),
        ),
      ).toStrictEqual({ a: "world" });
    });

    test("Guaranteed to run on each item", () => {
      const data = ["a", "a", "a", "a", "a", "a"];

      const keyFn = vi.fn(identity);
      const valueFn = vi.fn(identity);

      pullObject(data, keyFn, valueFn);

      expect(keyFn).toHaveBeenCalledTimes(data.length);
      expect(valueFn).toHaveBeenCalledTimes(data.length);
    });
  });

  describe("dataLast", () => {
    test("empty array", () => {
      expect(
        pipe([], pullObject(constant("key"), constant("value"))),
      ).toStrictEqual({});
    });

    test("number items", () => {
      expect(
        pipe(
          [1, 2],
          pullObject((item) => `item_${item}`, add(2)),
        ),
      ).toStrictEqual({ item_1: 3, item_2: 4 });
    });

    test("string items", () => {
      expect(
        pipe(
          ["a", "b"],
          pullObject(
            (item) => `item_${item}`,
            (item) => item.toUpperCase(),
          ),
        ),
      ).toStrictEqual({ item_a: "A", item_b: "B" });
    });

    test("object items", () => {
      expect(
        pipe(
          [
            { key: "a", value: 1 },
            { key: "b", value: 2 },
          ],
          pullObject(prop("key"), prop("value")),
        ),
      ).toStrictEqual({ a: 1, b: 2 });
    });

    test("number keys", () => {
      expect(
        pipe(
          ["a", "aa"],
          pullObject((item) => item.length, identity),
        ),
      ).toStrictEqual({ 1: "a", 2: "aa" });
    });

    test("undefined values", () => {
      expect(
        pipe(["a"], pullObject(identity, constant(undefined))),
      ).toStrictEqual({
        a: undefined,
      });
    });

    test("last value wins", () => {
      expect(
        pipe(
          [
            { id: "a", val: "hello" },
            { id: "a", val: "world" },
          ],
          pullObject(prop("id"), prop("val")),
        ),
      ).toStrictEqual({ a: "world" });
    });

    test("Guaranteed to run on each item", () => {
      const data = ["a", "a", "a", "a", "a", "a"];

      const keyFn = vi.fn(identity);
      const valueFn = vi.fn(identity);

      pipe(data, pullObject(keyFn, valueFn));

      expect(keyFn).toHaveBeenCalledTimes(data.length);
      expect(valueFn).toHaveBeenCalledTimes(data.length);
    });
  });
});

describe("typing", () => {
  test("string keys", () => {
    const data = ["a", "b"];

    const dataFirst = pullObject(data, identity, constant("value"));
    expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<string, string>>>();

    const dataLast = pipe(data, pullObject(identity, constant("value")));
    expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<string, string>>>();
  });

  test("number keys", () => {
    const data = [1, 2];

    const dataFirst = pullObject(data, identity, constant(3));
    expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<number, number>>>();

    const dataLast = pipe(data, pullObject(identity, constant(3)));
    expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<number, number>>>();
  });

  test("symbol keys", () => {
    const data = [Symbol("a"), Symbol("b")];

    const dataFirst = pullObject(data, identity, constant(Symbol("c")));
    expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<symbol, symbol>>>();

    const dataLast = pipe(data, pullObject(identity, constant(Symbol("c"))));
    expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<symbol, symbol>>>();
  });

  test("number constants", () => {
    const data = [1, 2] as const;

    const dataFirst = pullObject(data, identity, constant(3 as const));
    expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<1 | 2, 3>>>();

    const dataLast = pipe(data, pullObject(identity, constant(3 as const)));
    expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<1 | 2, 3>>>();
  });

  test("string constants", () => {
    const data = ["a", "b"] as const;

    const dataFirst = pullObject(data, identity, constant("c" as const));
    expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<"a" | "b", "c">>>();

    const dataLast = pipe(data, pullObject(identity, constant("c" as const)));
    expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<"a" | "b", "c">>>();
  });

  test("literal unions keys", () => {
    const data = [1, 2];

    const dataFirst = pullObject(
      data,
      (item) => (item % 2 === 0 ? "odd" : "even"),
      constant("c"),
    );
    expectTypeOf(dataFirst).toEqualTypeOf<
      Partial<Record<"even" | "odd", string>>
    >();

    const dataLast = pipe(
      data,
      pullObject((item) => (item % 2 === 0 ? "odd" : "even"), constant("c")),
    );
    expectTypeOf(dataLast).toEqualTypeOf<
      Partial<Record<"even" | "odd", string>>
    >();
  });

  test("template string keys", () => {
    const data = [1, 2];

    const dataFirst = pullObject(
      data,
      (item) => `prefix_${item}`,
      constant("value"),
    );
    expectTypeOf(dataFirst).toEqualTypeOf<
      Partial<Record<`prefix_${number}`, string>>
    >();

    const dataLast = pipe(
      data,
      pullObject((item) => `prefix_${item}`, constant("value")),
    );
    expectTypeOf(dataLast).toEqualTypeOf<
      Partial<Record<`prefix_${number}`, string>>
    >();
  });
});
