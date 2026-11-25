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
