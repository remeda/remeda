import { expectTypeOf, test } from "vitest";
import { concat } from "./concat";
import { pipe } from "./pipe";

test("array literals are inferred as tuples", () => {
  expectTypeOf(concat([1], ["a"])).toEqualTypeOf<[number, string]>();
});

test("array literal `other` is inferred as a tuple in data-last", () => {
  expectTypeOf(pipe([] as number[], concat(["a"]))).toEqualTypeOf<
    [...number[], string]
  >();
});
