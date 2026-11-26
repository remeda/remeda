import { describe, expectTypeOf, test } from "vitest";
import { findIndex } from "./findIndex";
import { pipe } from "./pipe";

describe("union of arrays", () => {
  test("data-first", () => {
    findIndex([] as number[] | string[], (value) => {
      expectTypeOf(value).toEqualTypeOf<number | string>();

      return true;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      findIndex((value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();

        return true;
      }),
    );
  });
});

describe("callback data param on a union of arrays", () => {
  test("data-first", () => {
    findIndex([] as number[] | string[], (_value, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<number[] | string[]>();

      return true;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      findIndex((_value, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<number[] | string[]>();

        return true;
      }),
    );
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  findIndex([{ a: 1 }, { a: 2, b: "x" }], (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return true;
  });
});
