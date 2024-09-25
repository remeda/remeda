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
