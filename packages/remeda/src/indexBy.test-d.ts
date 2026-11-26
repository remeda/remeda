import { describe, expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("data-first", () => {
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

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(indexBy([] as number[] | string[], identity())).toEqualTypeOf<
      Record<number | string, number | string>
    >();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe([] as number[] | string[], indexBy(identity())),
    ).toEqualTypeOf<Record<number | string, number | string>>();
  });
});

describe("known issues!", () => {
  test("data-first repeats the item type of an inline array of objects", () => {
    // The inline array infers as a tuple, which gives each object its own type,
    // and `T[number]` doesn't merge structurally identical members.
    const result = indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      prop("code"),
    );

    expectTypeOf(result).not.toEqualTypeOf<
      Record<number, { dir: string; code: number }>
    >();

    // Actual
    expectTypeOf(result).toEqualTypeOf<
      Record<
        number,
        // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents -- TypeScript keeps separately written object types as distinct union members, as it does for the tuple's elements; merging them changes the asserted type.
        { dir: string; code: number } | { dir: string; code: number }
      >
    >();
  });
});
