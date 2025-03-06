import { generate } from "./generate";

test("generate", () => {
  expectTypeOf(generate(String)).toEqualTypeOf<Iterable<string>>();
});
