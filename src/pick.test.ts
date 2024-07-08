import { concat } from "./concat";
import { pick } from "./pick";
import { pipe } from "./pipe";

test("dataFirst", () => {
  const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "d"]);
  expect(result).toStrictEqual({ a: 1, d: 4 });
});

test("support inherited properties", () => {
  class BaseClass {
    testProp(): string {
      return "abc";
    }
  }
  class TestClass extends BaseClass {}
  const testClass = new TestClass();
  expectTypeOf(pick(testClass, ["testProp"])).toEqualTypeOf<{
    testProp: () => string;
  }>();
});

test("dataLast", () => {
  const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(["a", "d"]));
  expect(result).toEqual({ a: 1, d: 4 });
});

test("read only", () => {
  concat([1, 2], [3, 4] as const);
  // or similar:
  // const props: ReadonlyArray<string> = ["prop1", "prop2"];
  // const getProps = <T extends string>(props: readonly T[]) => props;
  const someObject = { prop1: "a", prop2: 2, a: "b" };
  const props = ["prop1", "prop2"] as const;
  pick(someObject, props); // TS2345 compilation error
});

test("it can pick symbol keys", () => {
  const mySymbol = Symbol("mySymbol");
  expect(pick({ [mySymbol]: 3, a: 4 }, [mySymbol])).toStrictEqual({
    [mySymbol]: 3,
  });
});
