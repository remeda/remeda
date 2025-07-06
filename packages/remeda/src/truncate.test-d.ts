import { describe, expectTypeOf, test } from "vitest";
import { truncate } from "./truncate";

describe("default options", () => {
  test("literals, truncated", () => {
    expectTypeOf(truncate("Hello, world!", 8)).toEqualTypeOf<"Hello...">();
  });

  test("literals, untruncated", () => {
    expectTypeOf(
      truncate("Hello, world!", 20),
    ).toEqualTypeOf<"Hello, world!">();
  });

  test("literals, shorter than default omission", () => {
    expectTypeOf(truncate("Hello, world!", 2)).toEqualTypeOf<"..">();
  });

  test("primitive string", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 8),
    ).toEqualTypeOf<string>();
  });

  test("primitive number", () => {
    expectTypeOf(
      truncate("Hello, world!", 8 as number),
    ).toEqualTypeOf<string>();
  });

  test("both primitive", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 8 as number),
    ).toEqualTypeOf<string>();
  });
});
