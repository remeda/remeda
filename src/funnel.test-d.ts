/* eslint-disable @typescript-eslint/no-unused-vars -- We just want to build types, we don't care about using the params... */
/* eslint-disable vitest/valid-expect -- This rule isn't very good with annotated expect clauses :( */

import { constant } from "./constant";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";

describe("'call' method args", () => {
  test("no args", () => {
    const foo = funnel(
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _

      (accum: "test" | undefined) => "test" as const,
      doNothing(),
      { invokedAt: "start" },
    );
    expectTypeOf(foo.call).parameters.toEqualTypeOf<[]>();
  });

  test("non-optional args", () => {
    const foo = funnel(
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      (accum: "test" | undefined, a: string, b: number, c: boolean) =>
        "test" as const,
      doNothing(),
      { invokedAt: "start" },
    );
    expectTypeOf(foo.call).parameters.toEqualTypeOf<
      [a: string, b: number, c: boolean]
    >();
  });

  test("optional args", () => {
    const foo = funnel(
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      (accum: "test" | undefined, a?: string) => "test" as const,
      doNothing(),
      { invokedAt: "start" },
    );
    expectTypeOf(foo.call).parameters.toEqualTypeOf<[a?: string | undefined]>();
  });

  test("rest args", () => {
    const foo = funnel(
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- rest params can't be readonly, it breaks typing :(
      (accum: "test" | undefined, ...as: Array<string>) => "test" as const,
      doNothing(),
      { invokedAt: "start" },
    );
    expectTypeOf(foo.call).parameters.toEqualTypeOf<Array<string>>();
  });
});

describe("executor arg is taken from reducer", () => {
  test("simple types", () => {
    funnel(
      constant(123),
      (args) => {
        expectTypeOf(args).toEqualTypeOf<number>();
      },
      { invokedAt: "start" },
    );
  });

  test("arrays", () => {
    funnel(
      constant([] as ReadonlyArray<number>),
      (args) => {
        expectTypeOf(args).toEqualTypeOf<ReadonlyArray<number>>();
      },
      { invokedAt: "start" },
    );
  });

  test("objects", () => {
    funnel(
      constant({ a: 123 }),
      (args) => {
        expectTypeOf(args).toEqualTypeOf<{ a: number }>();
      },
      { invokedAt: "start" },
    );
  });
});

describe("derive the reducer accumulator type from the executor param", () => {
  test("simple types", () => {
    funnel(
      (accum) => {
        expectTypeOf(accum).toEqualTypeOf<number | undefined>();
        return accum!;
      },
      (_a: number): void => {
        // do nothing
      },
      { invokedAt: "start" },
    );
  });

  test("arrays", () => {
    funnel(
      (accum) => {
        expectTypeOf(accum).toEqualTypeOf<ReadonlyArray<number> | undefined>();
        return accum!;
      },
      (_a: ReadonlyArray<number>): void => {
        // do nothing
      },
      { invokedAt: "start" },
    );
  });

  test("objects", () => {
    funnel(
      (accum) => {
        expectTypeOf(accum).toEqualTypeOf<{ readonly a: number } | undefined>();
        return accum!;
      },
      (_a: { readonly a: number }): void => {
        // do nothing
      },
      { invokedAt: "start" },
    );
  });
});
