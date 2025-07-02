import { describe, expectTypeOf, test } from "vitest";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("data-first", () => {
  test("simple array of objects", () => {
    const result = indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      prop("code"),
    );

    expectTypeOf(result).toEqualTypeOf<
      Record<number, { dir: string; code: number }>
    >();
  });

  test("tuple of readonly objects", () => {
    const result = indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ] as const,
      prop("code"),
    );

    expectTypeOf(result).toEqualTypeOf<
      Partial<
        Record<
          97 | 100,
          | { readonly dir: "left"; readonly code: 97 }
          | { readonly dir: "right"; readonly code: 100 }
        >
      >
    >();
  });
});

describe("data-last", () => {
  test("simple array of objects", () => {
    const result = pipe(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      indexBy(prop("code")),
    );

    expectTypeOf(result).toEqualTypeOf<
      Record<number, { dir: string; code: number }>
    >();
  });

  test("tuple of readonly objects", () => {
    const result = pipe(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ] as const,
      indexBy(prop("code")),
    );

    expectTypeOf(result).toEqualTypeOf<
      Partial<
        Record<
          97 | 100,
          | { readonly dir: "left"; readonly code: 97 }
          | { readonly dir: "right"; readonly code: 100 }
        >
      >
    >();
  });
});
