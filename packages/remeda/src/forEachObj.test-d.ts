import { expectTypeOf, test } from "vitest";
import { forEachObj } from "./forEachObj";
import { pipe } from "./pipe";

test("typing is sound when only symbol keys", () => {
  forEachObj({ [Symbol("a")]: 4 }, (value, key) => {
    expectTypeOf(key).toBeNever();
    expectTypeOf(value).toBeNever();
  });
});

test("symbol keys are ignored", () => {
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
