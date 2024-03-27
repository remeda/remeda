import { add } from "./add";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { times } from "./times";

describe("runtime", () => {
  test("works", () => {
    const id = identity();
    expect(id("hello")).toBe("hello");
  });

  test("works with more than one argument", () => {
    const id = identity();
    expect(id(1)).toBe(1);
    expect(id(1, 2)).toBe(1);
    expect(id(1, "a")).toBe(1);
    expect(id(undefined)).toBe(undefined);
  });

  test("works with variadic arguments", () => {
    const data = [1, 2, 3] as const;
    const id = identity();
    expect(id(...data)).toBe(data[0]);
  });

  test("can be put in a pipe", () => {
    expect(pipe([1, 2, 3], identity(), map(add(1)))).toEqual([3, 4, 5]);
  });

  test("can be used as a fill function (with times)", () => {
    expect(times(10, identity())).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
  });
});

describe("typing", () => {
  test("normal values", () => {
    const id = identity();
    expectTypeOf(id("hello")).toEqualTypeOf<string>();
    expectTypeOf(id(123)).toEqualTypeOf<number>();
    expectTypeOf(id(true)).toEqualTypeOf<boolean>();
    expectTypeOf(id({ a: 1, b: "hello" })).toEqualTypeOf<{
      a: number;
      b: string;
    }>();
  });

  test("literal values", () => {
    const id = identity();
    expectTypeOf(id("hello" as const)).toEqualTypeOf<"hello">();
    expectTypeOf(id(123 as const)).toEqualTypeOf<123>();
    expectTypeOf(id(true as const)).toEqualTypeOf<true>();
    expectTypeOf(id({ a: 1, b: "hello" } as const)).toEqualTypeOf<{
      readonly a: 1;
      readonly b: "hello";
    }>();
  });

  test("complex variadic invocations", () => {
    const data = ["a", true, 123] as const;
    const id = identity();
    expectTypeOf(id(...data)).toEqualTypeOf<"a">();
  });

  test("supported in any api", () => {
    mockApi({
      onMixOfParams: identity(),
      onVariadicParams: identity(),
    });
  });

  test("requires at least one argument", () => {
    mockApi({
      onMixOfParams: identity(),
      onVariadicParams: identity(),
      // @ts-expect-error [ts2322] - identity requires at least one param to be passed, it doesn't default to `undefined`
      onNoParams: identity(),
    });
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: number, isOptionalBoolean?: true) => number;
  readonly onVariadicParams: (...args: ReadonlyArray<"cat" | "dog">) => string;
  readonly onNoParams?: () => boolean;
}): void {
  /* do nothing */
}
