/* eslint-disable @typescript-eslint/no-unused-vars -- We just want to build types, we don't care about using the params... */

import { describe, expectTypeOf, test } from "vitest";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";

describe("'call' method args", () => {
  test("no args", () => {
    const foo = funnel(doNothing(), {
      reducer: (_: "test" | undefined) => "test" as const,
      triggerAt: "start",
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<[]>();
  });

  test("non-optional args", () => {
    const foo = funnel(doNothing(), {
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      reducer: (_: "test" | undefined, a: string, b: number, c: boolean) =>
        "test" as const,

      triggerAt: "start",
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<
      [a: string, b: number, c: boolean]
    >();
  });

  test("optional args", () => {
    const foo = funnel(doNothing(), {
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      reducer: (_: "test" | undefined, a?: string) => "test" as const,
      triggerAt: "start",
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<[a?: string | undefined]>();
  });

  test("rest args", () => {
    const foo = funnel(doNothing(), {
      reducer:
        // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- rest params can't be readonly, it breaks typing :(
        (_: "test" | undefined, ...as: Array<string>) => "test" as const,

      triggerAt: "start",
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<Array<string>>();
  });
});

describe("derive the reducer accumulator type from the executor param", () => {
  test("simple types", () => {
    funnel(
      (_: number) => {
        // do nothing
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<number | undefined>();

          return reduced!;
        },
        triggerAt: "start",
      },
    );
  });

  test("arrays", () => {
    funnel(
      (_: ReadonlyArray<number>) => {
        // do nothing,
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<
            ReadonlyArray<number> | undefined
          >();

          return reduced!;
        },
        triggerAt: "start",
      },
    );
  });

  test("objects", () => {
    funnel(
      (_: { readonly a: number }) => {
        // do nothing
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<
            { readonly a: number } | undefined
          >();

          return reduced!;
        },
        triggerAt: "start",
      },
    );
  });
});

describe("prevent bad options", () => {
  test("minGapMs cannot be the only option with timing: end", () => {
    funnel(
      doNothing(),
      // @ts-expect-error [ts(2345)] -- minGapMs cannot be set alone]
      { minGapMs: 100 },
    );

    funnel(
      doNothing(),
      // @ts-expect-error [ts(2345)] -- minGapMs cannot be set alone]
      { triggerAt: "end", minGapMs: 100 },
    );

    // But it works with "start" and "both"

    funnel(doNothing(), { triggerAt: "start", minGapMs: 100 });
    funnel(doNothing(), { triggerAt: "both", minGapMs: 100 });
  });
});
