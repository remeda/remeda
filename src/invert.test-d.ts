import { invert } from "./invert";

test("simple string records", () => {
  const result = invert({} as Record<string, string>);
  expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
});

test("simple number records", () => {
  const result = invert({} as Record<number, number>);
  expectTypeOf(result).toEqualTypeOf<Record<number, `${number}`>>();
});

test("mixed const objects", () => {
  const result = invert({ a: 123, b: "hello", 3: 456, 4: "world" } as const);
  expectTypeOf(result).toEqualTypeOf<{
    123: "a";
    hello: "b";
    456: "3";
    world: "4";
  }>();
});

test("optional props", () => {
  const result = invert({} as { a?: "hello"; b?: 123; 3?: "world"; 4?: 456 });
  expectTypeOf(result).toEqualTypeOf<{
    hello?: "a";
    123?: "b";
    world?: "3";
    456?: "4";
  }>();
});

test("partial record", () => {
  const result = invert({} as Partial<Record<123 | 456, "cat" | "dog">>);
  expectTypeOf(result).toEqualTypeOf<
    Partial<Record<"cat" | "dog", "123" | "456">>
  >();
});

test("symbol keys are filtered out", () => {
  const result = invert({ [Symbol("a")]: 4, a: "hello" } as const);
  expectTypeOf(result).toEqualTypeOf<{ hello: "a" }>();
});

test("number keys are converted to strings", () => {
  const result = invert({ 1: "a", 2: "b" });
  expectTypeOf(result).toEqualTypeOf<Record<string, "1" | "2">>();
});

test("symbol values are fine", () => {
  const mySymbol = Symbol("my");
  const result = invert({ a: mySymbol } as const);
  expectTypeOf(result).toEqualTypeOf<{ [mySymbol]: "a" }>();
});

test("only symbol keys", () => {
  const mySymbol = Symbol("my");
  const result = invert({ [mySymbol]: 4 });
  // eslint-disable-next-line @typescript-eslint/ban-types
  expectTypeOf(result).toEqualTypeOf<{}>();
});
