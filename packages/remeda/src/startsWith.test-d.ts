import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { filter } from "./filter";
import { isNot } from "./isNot";
import { partition } from "./partition";
import { startsWith } from "./startsWith";

describe("data-first", () => {
  test("doesn't narrow on 'string' prefix", () => {
    const data = "foobar" as string;
    if (startsWith(data, "foo" as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("const data that matches", () => {
    const data = "foobar" as const;
    if (startsWith(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("primitive string data", () => {
    const data = "foobar" as string;
    if (startsWith(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<`foo${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("template literal data that matches", () => {
    const data = "foo_1" as `foo_${number}`;
    if (startsWith(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("literal union", () => {
    const data = "cat" as "cat" | "dog";
    if (startsWith(data, "c")) {
      expectTypeOf(data).toEqualTypeOf<"cat">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"dog">();
    }
  });

  test("template union", () => {
    const data = "cat" as `cat_${number}` | `dog_${boolean}`;
    if (startsWith(data, "c")) {
      expectTypeOf(data).toEqualTypeOf<`cat_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`dog_${boolean}`>();
    }
  });

  test("generic data", () => {
    expectTypeOf(startsWithFoo($typed<string>())).toEqualTypeOf<
      `foo${string}` | undefined
    >();
  });

  test("generic prefix", () => {
    expectTypeOf(hasPrefix("foobar", "foo")).toEqualTypeOf<boolean>();
  });
});

describe("data-last", () => {
  test("doesn't narrow on 'string' prefix", () => {
    const [yes, no] = partition([] as string[], startsWith("foo" as string));

    expectTypeOf(yes).toEqualTypeOf<string[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("const data that matches", () => {
    const [yes, no] = partition([] as "foobar"[], startsWith("foo"));

    expectTypeOf(yes).toEqualTypeOf<"foobar"[]>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  test("primitive string data", () => {
    const [yes, no] = partition([] as string[], startsWith("foo"));

    expectTypeOf(yes).toEqualTypeOf<`foo${string}`[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("template literal data that matches", () => {
    const [yes, no] = partition([] as `foo_${number}`[], startsWith("foo"));

    expectTypeOf(yes).branded.toEqualTypeOf<`foo_${number}`[]>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  test("literal union", () => {
    const [yes, no] = partition([] as ("cat" | "dog")[], startsWith("c"));

    expectTypeOf(yes).toEqualTypeOf<"cat"[]>();
    expectTypeOf(no).toEqualTypeOf<"dog"[]>();
  });

  test("template union", () => {
    const [yes, no] = partition(
      [] as (`cat_${number}` | `dog_${boolean}`)[],
      startsWith("c"),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<`cat_${number}`[]>();
    expectTypeOf(no).toEqualTypeOf<`dog_${boolean}`[]>();
  });

  test("type parameters inferred through composition", () => {
    expectTypeOf(
      filter([] as ("cat" | "dog")[], isNot(startsWith("c"))),
    ).toEqualTypeOf<"dog"[]>();
  });

  test("generic data", () => {
    expectTypeOf(startsWithFooAll([] as string[])).toEqualTypeOf<
      `foo${string}`[]
    >();
  });
});

// @see https://github.com/remeda/remeda/issues/1432
describe("reject disjoint prefixes (#1432)", () => {
  test("const data that doesn't match", () => {
    // @ts-expect-error [ts1345] -- Intentional! we check that the result of `startsWith` cannot be coerced to a boolean value!
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/strict-boolean-expressions -- Intentional! this form is the most concise way to test what we need.
    !startsWith("helloworld" as const, "foo");
  });

  test("literal union where no member matches", () => {
    // @ts-expect-error [ts1345] -- Intentional! we check that the result of `startsWith` cannot be coerced to a boolean value!
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/strict-boolean-expressions -- Intentional! this form is the most concise way to test what we need.
    !startsWith("cat" as "cat" | "dog", "bird");
  });

  describe("data-last", () => {
    test("const data that doesn't match", () => {
      filter(
        [] as "helloworld"[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith("foo"),
      );
    });

    test("literal union where no member matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith("bird"),
      );
    });
  });
});

describe("known issues!", () => {
  describe("template literals with an impossible prefix aren't rejected", () => {
    test("data-first", () => {
      const data = "foo_1" as `foo_${number}`;

      const isStartsWith = startsWith(data, "hello");

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- If template literals worked the same as literals and union literals it would resolve to `void` here.
      expectTypeOf(isStartsWith).not.toEqualTypeOf<void>();

      if (isStartsWith) {
        // Rejecting an impossible prefix relies on TypeScript reducing the
        // intersection with the prefix template to `never`. It only does that
        // for bounded types; an intersection of two unbounded template
        // literals is left as-is even when they are disjoint, so the check is
        // accepted and the `true` branch is typed with an uninhabitable
        // intersection instead.
        // @see https://github.com/microsoft/TypeScript/issues/60446
        expectTypeOf(data).toEqualTypeOf<`foo_${number}` & `hello${string}`>();

        // No strings satisfy this type, so it should be equivalent to `never`.
        expectTypeOf(data).not.toEqualTypeOf<never>();
      } else {
        expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
      }
    });

    test("data-last", () => {
      const [yes, no] = partition([] as `foo_${number}`[], startsWith("hello"));

      expectTypeOf(yes).toEqualTypeOf<(`foo_${number}` & `hello${string}`)[]>();
      expectTypeOf(no).toEqualTypeOf<`foo_${number}`[]>();
    });
  });

  test("native array methods don't reject a dead-code check", () => {
    // `Array.prototype.filter` accepts any callback returning `unknown`, so it
    // also accepts the `void`-returning predicate a dead-code check resolves
    // to. Remeda's own `filter` requires a `boolean` and does reject it.
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- The always-falsy predicate is the limitation being pinned.
      ([] as ("cat" | "dog")[]).filter(startsWith("bird")),
    ).toEqualTypeOf<("cat" | "dog")[]>();
  });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const startsWithFoo = <T extends string>(data: T) =>
  startsWith(data, "foo") ? data : undefined;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const startsWithFooAll = <T extends string>(data: readonly T[]) =>
  filter(data, startsWith("foo"));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we need the types to be inferred "through" the type parameter.
const hasPrefix = <Prefix extends string>(data: string, prefix: Prefix) =>
  startsWith(data, prefix);
