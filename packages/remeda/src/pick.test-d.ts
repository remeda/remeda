import { keys } from "./keys";
import { pick } from "./pick";
import { pipe } from "./pipe";

describe("data first", () => {
  test("non existing prop", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"]);
  });

  test("complex type", () => {
    const obj = { a: 1 } as { a: number } | { a?: number; b: string };
    const result = pick(obj, ["a"]);

    expectTypeOf(result).toEqualTypeOf<
      Pick<{ a: number } | { a?: number; b: string }, "a">
    >();
  });

  it("infers the key types from the keys array (issue #886)", () => {
    const data = { foo: "hello", bar: "world" };

    const raw = pick(data, ["foo"]);

    expectTypeOf(raw).toEqualTypeOf<{ foo: string }>();

    const wrapped = keys(pick(data, ["foo"]));

    expectTypeOf(wrapped).toEqualTypeOf<Array<"foo">>();

    const withConstKeys = keys(pick(data, ["foo"] as const));

    expectTypeOf(withConstKeys).toEqualTypeOf<Array<"foo">>();
  });

  it("handles optional keys (issue #911)", () => {
    const data = { foo: "hello", bar: "world" } as const;
    const result = pick(data, [] as Array<keyof typeof data>);

    expectTypeOf(result).toEqualTypeOf<{
      readonly foo?: "hello";
      readonly bar?: "world";
    }>();
  });
});

describe("data last", () => {
  test("non existing prop", () => {
    pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      // @ts-expect-error [ts2345] -- should not allow non existing props
      pick(["not", "in"]),
    );
  });

  test("complex type", () => {
    const obj = { a: 1 } as { a: number } | { a?: number; b: string };
    const result = pipe(obj, pick(["a"]));

    expectTypeOf(result).toEqualTypeOf<
      Pick<{ a: number } | { a?: number; b: string }, "a">
    >();
  });
});

test("multiple keys", () => {
  type Data = { aProp: string; bProp: string };

  const obj: Data = {
    aProp: "p1",

    bProp: "p2",
  };

  const result = pipe(obj, pick(["aProp", "bProp"]));

  expectTypeOf(result).toEqualTypeOf<Pick<Data, "aProp" | "bProp">>();
});

test("support inherited properties", () => {
  class BaseClass {
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- This is fine...
    public testProp(): string {
      return "abc";
    }
  }
  class TestClass extends BaseClass {}
  const testClass = new TestClass();

  expectTypeOf(pick(testClass, ["testProp"])).toEqualTypeOf<{
    testProp: () => string;
  }>();
});
