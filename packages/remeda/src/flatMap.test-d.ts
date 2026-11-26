import { describe, expectTypeOf, test } from "vitest";
import { flatMap } from "./flatMap";
import { pipe } from "./pipe";

describe("callback returning a readonly array", () => {
  test("data-first", () => {
    expectTypeOf(
      flatMap([1, 2], (x) => [x, x] as readonly number[]),
    ).toEqualTypeOf<number[]>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe(
        [1, 2],
        flatMap((x) => [x, x] as readonly number[]),
      ),
    ).toEqualTypeOf<number[]>();
  });
});

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(
      flatMap([] as number[] | string[], (value) => [value]),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe(
        [] as number[] | string[],
        flatMap((value) => [value]),
      ),
    ).toEqualTypeOf<(number | string)[]>();
  });
});

describe("callback data param", () => {
  test("complete in data-first", () => {
    flatMap([1, 2, 3], (_input, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<number[]>();

      return [0];
    });
  });

  test("complete in data-first on a const tuple", () => {
    flatMap([1, 2, 3] as const, (_input, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return [0];
    });
  });

  test("lazily reconstructed in data-last", () => {
    pipe(
      [1, 2, 3],
      flatMap((_input, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [number, ...number[]]>();

        return [0];
      }),
    );
  });

  test("lazily reconstructed in data-last on a union of arrays", () => {
    pipe(
      [] as number[] | string[],
      flatMap((_input, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<
          readonly [number, ...number[]] | readonly [string, ...string[]]
        >();

        return [0];
      }),
    );
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  flatMap([{ a: 1 }, { a: 2, b: "x" }], (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return [item];
  });
});
