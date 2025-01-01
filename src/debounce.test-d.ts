/* eslint-disable @typescript-eslint/no-deprecated -- We know! */

import { debounce } from "./debounce";
import { identity } from "./identity";

it("returns undefined on 'trailing' timing", () => {
  const debouncer = debounce(() => "Hello, World!", {
    waitMs: 32,
    timing: "trailing",
  });
  const result = debouncer.call();

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});

it("doesn't return undefined on 'leading' timing", () => {
  const debouncer = debounce(() => "Hello, World!", {
    waitMs: 32,
    timing: "leading",
  });
  const result = debouncer.call();

  expectTypeOf(result).toEqualTypeOf<string>();
});

it("doesn't return undefined on 'both' timing", () => {
  const debouncer = debounce(() => "Hello, World!", {
    waitMs: 32,
    timing: "both",
  });
  const result = debouncer.call();

  expectTypeOf(result).toEqualTypeOf<string>();
});

test("argument typing to be good (all required)", () => {
  const debouncer = debounce(
    (a: string, b: number, c: boolean) => `${a}${b}${c ? "y" : "n"}`,
    {},
  );
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 0.
  debouncer.call();
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
  debouncer.call("a");
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 2.
  debouncer.call("a", 1);

  // @ts-expect-error [ts2354]: boolean instead of string
  debouncer.call(true, 1, true);

  // All good
  debouncer.call("a", 1, true);
});

test("argument typing to be good (with optional)", () => {
  const debouncer = debounce(
    (a: string, b?: number, c?: boolean) =>
      `${a}${b ?? "undefined"}${c === undefined ? "undefined" : c ? "y" : "n"}`,
    {},
  );
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
  debouncer.call();

  // @ts-expect-error [ts2354]: boolean instead of string
  debouncer.call(true, 1, true);

  // All good
  debouncer.call("a");
  debouncer.call("a", 1);
  debouncer.call("a", 1, true);
});

test("argument typing to be good (with defaults)", () => {
  const debouncer = debounce(
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types -- otherwise typing doesn't work for the test
    (a: string, b: number = 2, c: boolean = true) => `${a}${b}${c ? "y" : "n"}`,
    {},
  );
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
  debouncer.call();

  // @ts-expect-error [ts2354]: boolean instead of string
  debouncer.call(true, 1, true);

  // All good
  debouncer.call("a");
  debouncer.call("a", 1);
  debouncer.call("a", 1, true);
});

test("argument typing to be good (with rest param)", () => {
  const debouncer = debounce(
    (a: string, ...flags: ReadonlyArray<boolean>) =>
      `${a}${flags.map((flag) => (flag ? "y" : "n")).join(",")}`,
    { timing: "leading" },
  );
  // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
  debouncer.call();

  // @ts-expect-error [ts2354]: boolean instead of string
  debouncer.call(true);

  // @ts-expect-error [ts2354]: string instead of boolean
  debouncer.call("a", "b");

  // @ts-expect-error [ts2354]: boolean instead of string
  debouncer.call(true, "b");

  // All good
  debouncer.call("a");
  debouncer.call("a", true);
  debouncer.call("a", true, false);
});

it("doesn't accept maxWaitMs when timing is 'leading'", () => {
  debounce(identity(), { timing: "trailing", maxWaitMs: 32 });
  debounce(identity(), { timing: "both", maxWaitMs: 32 });
  // @ts-expect-error [ts2769]: maxWaitMs not supported!
  debounce(identity(), { timing: "leading", maxWaitMs: 32 });
});
