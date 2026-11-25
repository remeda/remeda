import { describe, expectTypeOf, test } from "vitest";
import { flatMap } from "./flatMap";
import { pipe } from "./pipe";

test("data-last on a union of arrays", () => {
  expectTypeOf(
    pipe(
      [] as number[] | string[],
      flatMap((value) => [value]),
    ),
  ).toEqualTypeOf<(number | string)[]>();
});

describe("callback data param", () => {
  test("complete in data-first", () => {
    flatMap([1, 2, 3], (_input, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly number[]>();

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
