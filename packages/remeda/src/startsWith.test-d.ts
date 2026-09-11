import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { filter } from "./filter";
import { isNot } from "./isNot";
import { partition } from "./partition";
import { startsWith } from "./startsWith";

describe("data-first", () => {
  test("doesn't narrow on 'string' prefix", () => {
    const data = "" as string;
    if (startsWith(data, "" as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow a literal union on 'string' prefix", () => {
    const data = "cat" as "cat" | "dog";
    if (startsWith(data, "" as string)) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
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
    const data = "" as string;
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

  test("generic prefix", () => {
    expectTypeOf(hasPrefix("foobar", "foo")).toEqualTypeOf<boolean>();
  });

  test("literal union prefix", () => {
    const data = "" as string;
    if (startsWith(data, "foo" as "foo" | "baz")) {
      expectTypeOf(data).toEqualTypeOf<`foo${string}` | `baz${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow when the prefix union splits the data", () => {
    const data = "foobar" as "foobar" | "hello" | "world";
    if (startsWith(data, "foo" as "foo" | "he")) {
      expectTypeOf(data).toEqualTypeOf<"foobar" | "hello" | "world">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"foobar" | "hello" | "world">();
    }
  });

  test("doesn't narrow when only some prefixes are disjoint", () => {
    const data = "cat" as "cat" | "dog";
    if (startsWith(data, "c" as "c" | "bird")) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("narrows a union when every data member matches all prefixes or none", () => {
    const data = "catcat" as "catcat" | "dog";
    if (startsWith(data, "cat" as "cat" | "c")) {
      expectTypeOf(data).toEqualTypeOf<"catcat">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"dog">();
    }
  });

  test("doesn't narrow a matching const to 'never' on a union prefix", () => {
    const data = "foobar" as const;
    if (startsWith(data, "foo" as "foo" | "he")) {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    }
  });

  test("template prefix", () => {
    const data = "" as string;
    if (startsWith(data, "1" as `${number}`)) {
      expectTypeOf(data).toEqualTypeOf<`${number}${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow on a template prefix that splits the data", () => {
    const data = "1_cat" as "1_cat" | "dog";
    if (startsWith(data, "1_" as `${number}_`)) {
      expectTypeOf(data).toEqualTypeOf<"1_cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"1_cat" | "dog">();
    }
  });

  test("doesn't narrow on a template prefix on template data", () => {
    const data = "bar_1" as `bar_${number}`;
    if (startsWith(data, "bar_" as `${string}_`)) {
      expectTypeOf(data).toEqualTypeOf<`bar_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`bar_${number}`>();
    }
  });

  test("doesn't narrow when a union prefix contains an empty string", () => {
    const data = "cat" as "cat" | "dog";
    if (startsWith(data, "" as "" | "z")) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("template union prefix", () => {
    const data = "" as string;
    if (startsWith(data, "1_" as `${number}_` | `${number}-`)) {
      expectTypeOf(data).toEqualTypeOf<
        `${number}_${string}` | `${number}-${string}`
      >();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });
});

describe("data-last", () => {
  test("doesn't narrow on 'string' prefix", () => {
    const [yes, no] = partition([] as string[], startsWith("" as string));

    expectTypeOf(yes).toEqualTypeOf<string[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow a literal union on 'string' prefix", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      startsWith("" as string),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
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

  test("literal union prefix", () => {
    const [yes, no] = partition(
      [] as string[],
      startsWith("foo" as "foo" | "baz"),
    );

    expectTypeOf(yes).toEqualTypeOf<(`foo${string}` | `baz${string}`)[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow when the prefix union splits the data", () => {
    const [yes, no] = partition(
      [] as ("foobar" | "hello" | "world")[],
      startsWith("foo" as "foo" | "he"),
    );

    expectTypeOf(yes).toEqualTypeOf<("foobar" | "hello" | "world")[]>();
    expectTypeOf(no).toEqualTypeOf<("foobar" | "hello" | "world")[]>();
  });

  test("doesn't narrow when only some prefixes are disjoint", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      startsWith("c" as "c" | "bird"),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("doesn't narrow a matching const to 'never' on a union prefix", () => {
    const [yes, no] = partition(
      [] as "foobar"[],
      startsWith("foo" as "foo" | "he"),
    );

    expectTypeOf(yes).toEqualTypeOf<"foobar"[]>();
    expectTypeOf(no).toEqualTypeOf<"foobar"[]>();
  });

  test("template prefix", () => {
    const [yes, no] = partition([] as string[], startsWith("1" as `${number}`));

    expectTypeOf(yes).toEqualTypeOf<`${number}${string}`[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow on a template prefix that splits the data", () => {
    const [yes, no] = partition(
      [] as ("1_cat" | "dog")[],
      startsWith("1_" as `${number}_`),
    );

    expectTypeOf(yes).toEqualTypeOf<("1_cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("1_cat" | "dog")[]>();
  });

  test("doesn't narrow on a template prefix on template data", () => {
    const [yes, no] = partition(
      [] as `bar_${number}`[],
      startsWith("bar_" as `${string}_`),
    );

    expectTypeOf(yes).toEqualTypeOf<`bar_${number}`[]>();
    expectTypeOf(no).toEqualTypeOf<`bar_${number}`[]>();
  });

  test("doesn't narrow when a union prefix contains an empty string", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      startsWith("" as "" | "z"),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("template union prefix", () => {
    const [yes, no] = partition(
      [] as string[],
      startsWith("1_" as `${number}_` | `${number}-`),
    );

    expectTypeOf(yes).toEqualTypeOf<
      (`${number}_${string}` | `${number}-${string}`)[]
    >();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });
});

// @see https://github.com/remeda/remeda/issues/1432
describe("reject disjoint prefixes (#1432)", () => {
  test("const data that doesn't match", () => {
    startsWith(
      "helloworld" as const,
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "foo",
    );
  });

  test("literal union where no member matches", () => {
    startsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "bird",
    );
  });

  test("union prefix where no member matches", () => {
    startsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "bird" as "bird" | "fish",
    );
  });

  test("template prefix that no literal matches", () => {
    startsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "1_" as `${number}_`,
    );
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

    test("union prefix where no member matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith("bird" as "bird" | "fish"),
      );
    });

    test("template prefix that no literal matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith("1_" as `${number}_`),
      );
    });
  });
});

describe("known issues!", () => {
  describe("unresolved type parameters are rejected", () => {
    test("generic data", () => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping -- Intentional, we can only test how generic type-parameters are inferred through our type parameters via a function.
      const startsWithFoo = <T extends string>(data: T) =>
        // @ts-expect-error [ts2769] -- The limitation being pinned.
        startsWith(data, "foo") ? data : undefined;

      // Only the definition is rejected, the type it infers is still correct.
      expectTypeOf(startsWithFoo($typed<string>())).toEqualTypeOf<
        `foo${string}` | undefined
      >();
    });

    test("generic prefix, when data is narrower than `string`", () => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we can only test how generic type-parameters are inferred through our type parameters via a function.
      const hasPrefix = <Prefix extends string>(prefix: Prefix) =>
        // @ts-expect-error [ts2769] -- The limitation being pinned. Widening
        // `data` to `string` is what resolves the conditional, which is why the
        // "generic prefix" test under "data-first" passes.
        startsWith($typed<"cat" | "dog">(), prefix);

      expectTypeOf(hasPrefix("c")).toEqualTypeOf<boolean>();
    });
  });

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
      // Once the intersection above correctly reduces to `never`, `yes` would
      // become `never[]`; until then this stays green as a canary.
      expectTypeOf(yes).not.toEqualTypeOf<never[]>();
      expectTypeOf(no).toEqualTypeOf<`foo_${number}`[]>();
    });
  });

  describe("consumers that don't reject a dead-code check", () => {
    test("native array methods", () => {
      // `Array.prototype.filter` accepts any callback returning `unknown`, so
      // it also accepts the error-returning predicate a dead-code check
      // resolves to. Remeda's own `filter` requires a `boolean` and does
      // reject it.
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- The dead-code check going unnoticed is the limitation being pinned.
      const result = ([] as ("cat" | "dog")[]).filter(startsWith("bird"));

      expectTypeOf(result).toEqualTypeOf<("cat" | "dog")[]>();
      // If native `.filter` ever rejected an error-returning predicate, this
      // dead-code check would resolve to an empty result instead.
      expectTypeOf(result).not.toEqualTypeOf<never[]>();
    });

    test("isNot", () => {
      // `isNot` requires a type predicate, which makes TypeScript resolve
      // `startsWith` through the guard overload; the rejection overload is
      // never a candidate, so the dead-code check goes unnoticed.
      const result = filter([] as ("cat" | "dog")[], isNot(startsWith("bird")));

      expectTypeOf(result).toEqualTypeOf<("cat" | "dog")[]>();
      // If `isNot` ever resolved this through the rejection overload instead,
      // the dead-code check would resolve to an empty result.
      expectTypeOf(result).not.toEqualTypeOf<never[]>();
    });
  });

  describe("isNot bypasses the unsound-narrowing guard", () => {
    test("union prefix where only some members are disjoint", () => {
      // For a direct call, an unsound union prefix falls through to the
      // plain-`boolean` overload and `partition` doesn't narrow at all (see
      // "doesn't narrow when only some prefixes are disjoint" above). `isNot`
      // requires a type predicate though, so it always resolves `startsWith`
      // through the (unconditionally sound-looking) guard overload; the
      // `boolean` overload built to reject this case is never a candidate for
      // a type-predicate parameter. The result narrows to `"dog"[]`, which is
      // unsound: at runtime the prefix could be `"bird"`, in which case
      // nothing starts with it, `isNot` is `true` for every element, and
      // `"cat"` survives the filter too.
      const result = filter(
        [] as ("cat" | "dog")[],
        isNot(startsWith("c" as "c" | "bird")),
      );

      expectTypeOf(result).toEqualTypeOf<"dog"[]>();
      // If `isNot` ever resolved this through the sound `boolean` overload,
      // it wouldn't narrow at all, matching the direct-call behavior above.
      expectTypeOf(result).not.toEqualTypeOf<("cat" | "dog")[]>();
    });
  });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const startsWithFooAll = <T extends string>(data: readonly T[]) =>
  filter(data, startsWith("foo"));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we need the types to be inferred "through" the type parameter.
const hasPrefix = <Prefix extends string>(data: string, prefix: Prefix) =>
  startsWith(data, prefix);
