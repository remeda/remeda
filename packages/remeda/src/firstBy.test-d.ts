import { expectTypeOf, test } from "vitest";
import { firstBy } from "./firstBy";
import { identity } from "./identity";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

test("can return undefined on arrays", () => {
  const data: ReadonlyArray<number> = [1, 2, 3];
  const result = firstBy(data, identity());

  expectTypeOf(result).toBeNullable();
});

test("can't return undefined on non-empty array", () => {
  const data: NonEmptyArray<number> = [1, 2, 3];
  const result = firstBy(data, identity());

  expectTypeOf(result).not.toBeNullable();
});

test("only returns null on the empty array", () => {
  const data = [] as const;
  const result = firstBy(data, identity());

  expectTypeOf(result).toBeUndefined();
});
