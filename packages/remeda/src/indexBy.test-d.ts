import { describe, expectTypeOf, test } from "vitest";
import { identity } from "./identity";
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

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  indexBy([{ a: 1 }, { a: 2, b: "x" }], (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return item.a;
  });
});
