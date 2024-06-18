import { forEachObj } from "./forEachObj";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    };
    const cb = vi.fn();

    forEachObj(data, cb);

    expect(cb).toHaveBeenCalledWith(1, "a", data);
    expect(cb).toHaveBeenCalledWith(2, "b", data);
    expect(cb).toHaveBeenCalledWith(3, "c", data);
  });

  test("doesn't run on symbol keys", () => {
    const data = { [Symbol("a")]: 4 };
    const cb = vi.fn();

    forEachObj(data, cb);

    expect(cb).toHaveBeenCalledTimes(0);
  });

  test("number keys are translated to string", () => {
    const data = { 123: 456 };
    forEachObj(data, (value, key) => {
      expect(key).toBe("123");
      expect(value).toBe(456);
    });
  });

  test("dataLast", () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    };
    const cb = vi.fn<[number, string, typeof data]>();

    expect(pipe(data, forEachObj(cb))).toBe(data);
    expect(cb).toHaveBeenCalledWith(1, "a", data);
    expect(cb).toHaveBeenCalledWith(2, "b", data);
    expect(cb).toHaveBeenCalledWith(3, "c", data);
  });
});

describe("typing", () => {
  test("Typing is sound when only symbol keys", () => {
    forEachObj({ [Symbol("a")]: 4 }, (value, key) => {
      expectTypeOf(key).toBeNever();
      expectTypeOf(value).toBeNever();
    });
  });

  test("Symbol keys are ignored", () => {
    forEachObj({ [Symbol("a")]: 4, a: "hello", b: true }, (value, key) => {
      expectTypeOf(key).toEqualTypeOf<"a" | "b">();
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
    });
  });

  test("number keys are translated to strings", () => {
    forEachObj({ 123: "hello", 456: true }, (value, key) => {
      expectTypeOf(key).toEqualTypeOf<"123" | "456">();
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
    });
  });

  test("union of records", () => {
    const data = {} as Record<number, string> | Record<string, number>;

    forEachObj(data, (value, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
      expectTypeOf(value).toEqualTypeOf<number | string>();
    });

    pipe(
      data,
      forEachObj((value, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
        expectTypeOf(value).toEqualTypeOf<number | string>();
      }),
    );
  });
});
