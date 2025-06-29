import { keys } from "./keys";
import { pick } from "./pick";
import { pipe } from "./pipe";

describe("data first", () => {
  test("non existing prop", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"]);
  });

  test("union with common prop", () => {
    expectTypeOf(
      pick({ a: 1 } as { a: number } | { a?: number; b: string }, ["a"]),
    ).toEqualTypeOf<Pick<{ a: number } | { a?: number; b: string }, "a">>();
  });

  describe("infers the key types from the keys array (issue #886)", () => {
    test("base", () => {
      expectTypeOf(
        pick({ foo: "hello", bar: "world" }, ["foo"]),
      ).toEqualTypeOf<{ foo: string }>();
    });

    test("wrapped", () => {
      expectTypeOf(
        keys(pick({ foo: "hello", bar: "world" }, ["foo"])),
      ).toEqualTypeOf<Array<"foo">>();
    });

    test("with const key", () => {
      expectTypeOf(
        keys(pick({ foo: "hello", bar: "world" }, ["foo"] as const)),
      ).toEqualTypeOf<Array<"foo">>();
    });
  });
});

it("handles optional keys (issue #911)", () => {
  expectTypeOf(
    pick({ foo: "hello", bar: "world" }, [] as Array<"foo" | "bar">),
  ).toEqualTypeOf<{ foo?: string; bar?: string }>();
});

describe("data last", () => {
  test("non existing prop", () => {
    pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      // @ts-expect-error [ts2345] -- should not allow non existing props
      pick(["not", "in"]),
    );
  });

  test("union with common prop", () => {
    expectTypeOf(
      pipe({ a: 1 } as { a: number } | { a?: number; b: string }, pick(["a"])),
    ).toEqualTypeOf<Pick<{ a: number } | { a?: number; b: string }, "a">>();
  });
});

test("multiple keys", () => {
  expectTypeOf(pipe({ a: "p1", b: "p2" }, pick(["a", "b"]))).toEqualTypeOf<{
    a: string;
    b: string;
  }>();
});

test("support inherited properties", () => {
  class BaseClass {
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- This is fine...
    public testProp(): string {
      return "abc";
    }
  }
  class TestClass extends BaseClass {}

  expectTypeOf(pick(new TestClass(), ["testProp"])).toEqualTypeOf<{
    testProp: () => string;
  }>();
});
