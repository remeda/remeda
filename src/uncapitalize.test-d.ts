import { pipe } from "./pipe";
import { uncapitalize } from "./uncapitalize";

describe("data-first", () => {
  test("on lower case", () => {
    const result = uncapitalize("hello world");

    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = uncapitalize("HELLO WORLD");

    expectTypeOf(result).toEqualTypeOf<"hELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = uncapitalize("HeLlO WoRlD");

    expectTypeOf(result).toEqualTypeOf<"heLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = uncapitalize("");

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = uncapitalize("hello world" as string);

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  test("on template literal type", () => {
    const result = uncapitalize("PREFIX_123" as `PREFIX_${number}`);

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    const result = pipe("hello world" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = pipe("HELLO WORLD" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"hELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = pipe("HeLlO WoRlD" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"heLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = pipe("" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = pipe("hello world" as string, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  test("on template literal type", () => {
    const result = pipe("PREFIX_123" as `PREFIX_${number}`, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});
