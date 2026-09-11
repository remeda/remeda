import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { endsWith } from "./endsWith";
import { filter } from "./filter";
import { isNot } from "./isNot";
import { partition } from "./partition";

describe("data-first", () => {
  test("doesn't narrow on 'string' suffix", () => {
    const data = "" as string;
    if (endsWith(data, "" as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow a literal union on 'string' suffix", () => {
    const data = "cat" as "cat" | "dog";
    if (endsWith(data, "" as string)) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("const data that matches", () => {
    const data = "foobar" as const;
    if (endsWith(data, "bar")) {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("primitive string data", () => {
    const data = "" as string;
    if (endsWith(data, "bar")) {
      expectTypeOf(data).toEqualTypeOf<`${string}bar`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("template literal data that matches", () => {
    const data = "1_bar" as `${number}_bar`;
    if (endsWith(data, "bar")) {
      expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("literal union", () => {
    const data = "cat" as "cat" | "dog";
    if (endsWith(data, "t")) {
      expectTypeOf(data).toEqualTypeOf<"cat">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"dog">();
    }
  });

  test("template union", () => {
    const data = "cat" as `${boolean}_dog` | `${number}_cat`;
    if (endsWith(data, "t")) {
      expectTypeOf(data).toEqualTypeOf<`${number}_cat`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`${boolean}_dog`>();
    }
  });

  test("generic suffix", () => {
    expectTypeOf(hasSuffix("foobar", "bar")).toEqualTypeOf<boolean>();
  });

  test("literal union suffix", () => {
    const data = "" as string;
    if (endsWith(data, "bar" as "bar" | "baz")) {
      expectTypeOf(data).toEqualTypeOf<`${string}bar` | `${string}baz`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow when the suffix union splits the data", () => {
    const data = "foobar" as "foobar" | "hello" | "world";
    if (endsWith(data, "bar" as "bar" | "lo")) {
      expectTypeOf(data).toEqualTypeOf<"foobar" | "hello" | "world">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"foobar" | "hello" | "world">();
    }
  });

  test("doesn't narrow when only some suffixes are disjoint", () => {
    const data = "cat" as "cat" | "dog";
    if (endsWith(data, "t" as "t" | "bird")) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("narrows a union when every data member matches all suffixes or none", () => {
    const data = "catcat" as "catcat" | "dog";
    if (endsWith(data, "cat" as "cat" | "t")) {
      expectTypeOf(data).toEqualTypeOf<"catcat">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"dog">();
    }
  });

  test("doesn't narrow a matching const to 'never' on a union suffix", () => {
    const data = "foobar" as const;
    if (endsWith(data, "bar" as "bar" | "lo")) {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"foobar">();
    }
  });

  test("template suffix", () => {
    const data = "" as string;
    if (endsWith(data, "1" as `${number}`)) {
      expectTypeOf(data).toEqualTypeOf<`${string}${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("doesn't narrow on a template suffix that splits the data", () => {
    const data = "cat_1" as "cat_1" | "dog";
    if (endsWith(data, "_1" as `_${number}`)) {
      expectTypeOf(data).toEqualTypeOf<"cat_1" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat_1" | "dog">();
    }
  });

  test("doesn't narrow on a template suffix on template data", () => {
    const data = "1_bar" as `${number}_bar`;
    if (endsWith(data, "_bar" as `_${string}`)) {
      expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
    }
  });

  test("doesn't narrow when a union suffix contains an empty string", () => {
    const data = "cat" as "cat" | "dog";
    if (endsWith(data, "" as "" | "z")) {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("template union suffix", () => {
    const data = "" as string;
    if (endsWith(data, "_1" as `_${number}` | `-${number}`)) {
      expectTypeOf(data).toEqualTypeOf<
        `${string}_${number}` | `${string}-${number}`
      >();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });
});

describe("data-last", () => {
  test("doesn't narrow on 'string' suffix", () => {
    const [yes, no] = partition([] as string[], endsWith("" as string));

    expectTypeOf(yes).toEqualTypeOf<string[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow a literal union on 'string' suffix", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      endsWith("" as string),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("const data that matches", () => {
    const [yes, no] = partition([] as "foobar"[], endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<"foobar"[]>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  test("primitive string data", () => {
    const [yes, no] = partition([] as string[], endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<`${string}bar`[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("template literal data that matches", () => {
    const [yes, no] = partition([] as `${number}_bar`[], endsWith("bar"));

    expectTypeOf(yes).branded.toEqualTypeOf<`${number}_bar`[]>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  test("literal union", () => {
    const [yes, no] = partition([] as ("cat" | "dog")[], endsWith("t"));

    expectTypeOf(yes).toEqualTypeOf<"cat"[]>();
    expectTypeOf(no).toEqualTypeOf<"dog"[]>();
  });

  test("template union", () => {
    const [yes, no] = partition(
      [] as (`${boolean}_dog` | `${number}_cat`)[],
      endsWith("t"),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<`${number}_cat`[]>();
    expectTypeOf(no).toEqualTypeOf<`${boolean}_dog`[]>();
  });

  test("type parameters inferred through composition", () => {
    expectTypeOf(
      filter([] as ("cat" | "dog")[], isNot(endsWith("t"))),
    ).toEqualTypeOf<"dog"[]>();
  });

  test("generic data", () => {
    expectTypeOf(endsWithBarAll([] as string[])).toEqualTypeOf<
      `${string}bar`[]
    >();
  });

  test("literal union suffix", () => {
    const [yes, no] = partition(
      [] as string[],
      endsWith("bar" as "bar" | "baz"),
    );

    expectTypeOf(yes).toEqualTypeOf<(`${string}bar` | `${string}baz`)[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow when the suffix union splits the data", () => {
    const [yes, no] = partition(
      [] as ("foobar" | "hello" | "world")[],
      endsWith("bar" as "bar" | "lo"),
    );

    expectTypeOf(yes).toEqualTypeOf<("foobar" | "hello" | "world")[]>();
    expectTypeOf(no).toEqualTypeOf<("foobar" | "hello" | "world")[]>();
  });

  test("doesn't narrow when only some suffixes are disjoint", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      endsWith("t" as "t" | "bird"),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("doesn't narrow a matching const to 'never' on a union suffix", () => {
    const [yes, no] = partition(
      [] as "foobar"[],
      endsWith("bar" as "bar" | "lo"),
    );

    expectTypeOf(yes).toEqualTypeOf<"foobar"[]>();
    expectTypeOf(no).toEqualTypeOf<"foobar"[]>();
  });

  test("template suffix", () => {
    const [yes, no] = partition([] as string[], endsWith("1" as `${number}`));

    expectTypeOf(yes).toEqualTypeOf<`${string}${number}`[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("doesn't narrow on a template suffix that splits the data", () => {
    const [yes, no] = partition(
      [] as ("cat_1" | "dog")[],
      endsWith("_1" as `_${number}`),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat_1" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat_1" | "dog")[]>();
  });

  test("doesn't narrow on a template suffix on template data", () => {
    const [yes, no] = partition(
      [] as `${number}_bar`[],
      endsWith("_bar" as `_${string}`),
    );

    expectTypeOf(yes).toEqualTypeOf<`${number}_bar`[]>();
    expectTypeOf(no).toEqualTypeOf<`${number}_bar`[]>();
  });

  test("doesn't narrow when a union suffix contains an empty string", () => {
    const [yes, no] = partition(
      [] as ("cat" | "dog")[],
      endsWith("" as "" | "z"),
    );

    expectTypeOf(yes).toEqualTypeOf<("cat" | "dog")[]>();
    expectTypeOf(no).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("template union suffix", () => {
    const [yes, no] = partition(
      [] as string[],
      endsWith("_1" as `_${number}` | `-${number}`),
    );

    expectTypeOf(yes).toEqualTypeOf<
      (`${string}_${number}` | `${string}-${number}`)[]
    >();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });
});

// @see https://github.com/remeda/remeda/issues/1432
describe("reject disjoint suffixes (#1432)", () => {
  test("const data that doesn't match", () => {
    endsWith(
      "helloworld" as const,
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "foo",
    );
  });

  test("literal union where no member matches", () => {
    endsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "bird",
    );
  });

  test("union suffix where no member matches", () => {
    endsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "bird" as "bird" | "fish",
    );
  });

  test("template suffix that no literal matches", () => {
    endsWith(
      "cat" as "cat" | "dog",
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      "_1" as `_${number}`,
    );
  });

  describe("data-last", () => {
    test("const data that doesn't match", () => {
      filter(
        [] as "helloworld"[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        endsWith("foo"),
      );
    });

    test("literal union where no member matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        endsWith("bird"),
      );
    });

    test("union suffix where no member matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        endsWith("bird" as "bird" | "fish"),
      );
    });

    test("template suffix that no literal matches", () => {
      filter(
        [] as ("cat" | "dog")[],
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        endsWith("_1" as `_${number}`),
      );
    });
  });
});

describe("known issues!", () => {
  describe("unresolved type parameters are rejected", () => {
    test("generic data", () => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping -- Intentional, we can only test how generic type-parameters are inferred through our type parameters via a function.
      const endsWithBar = <T extends string>(data: T) =>
        // @ts-expect-error [ts2769] -- The limitation being pinned.
        endsWith(data, "bar") ? data : undefined;

      // Only the definition is rejected, the type it infers is still correct.
      expectTypeOf(endsWithBar($typed<string>())).toEqualTypeOf<
        `${string}bar` | undefined
      >();
    });

    test("generic suffix, when data is narrower than `string`", () => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we can only test how generic type-parameters are inferred through our type parameters via a function.
      const hasSuffix = <Suffix extends string>(suffix: Suffix) =>
        // @ts-expect-error [ts2769] -- The limitation being pinned. Widening
        // `data` to `string` is what resolves the conditional, which is why the
        // "generic suffix" test under "data-first" passes.
        endsWith($typed<"cat" | "dog">(), suffix);

      expectTypeOf(hasSuffix("t")).toEqualTypeOf<boolean>();
    });
  });

  describe("template literals with an impossible suffix aren't rejected", () => {
    test("data-first", () => {
      const data = "1_bar" as `${number}_bar`;

      const isEndsWith = endsWith(data, "world");

      // If template literals worked the same as literals and union literals
      // the call itself would be rejected.
      expectTypeOf(isEndsWith).not.toEqualTypeOf<never>();

      if (isEndsWith) {
        // Rejecting an impossible suffix relies on TypeScript reducing the
        // intersection with the suffix template to `never`. It only does that
        // for bounded types; an intersection of two unbounded template
        // literals is left as-is even when they are disjoint, so the check is
        // accepted and the `true` branch is typed with an uninhabitable
        // intersection instead.
        // @see https://github.com/microsoft/TypeScript/issues/60446
        expectTypeOf(data).toEqualTypeOf<`${number}_bar` & `${string}world`>();

        // No strings satisfy this type, so it should be equivalent to `never`.
        expectTypeOf(data).not.toEqualTypeOf<never>();
      } else {
        expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
      }
    });

    test("data-last", () => {
      const [yes, no] = partition([] as `${number}_bar`[], endsWith("world"));

      expectTypeOf(yes).toEqualTypeOf<(`${number}_bar` & `${string}world`)[]>();
      // Once the intersection above correctly reduces to `never`, `yes` would
      // become `never[]`; until then this stays green as a canary.
      expectTypeOf(yes).not.toEqualTypeOf<never[]>();
      expectTypeOf(no).toEqualTypeOf<`${number}_bar`[]>();
    });
  });

  describe("consumers that don't reject a dead-code check", () => {
    test("native array methods", () => {
      // `Array.prototype.filter` accepts any callback returning `unknown`, so
      // it also accepts the error-returning predicate a dead-code check
      // resolves to. Remeda's own `filter` requires a `boolean` and does
      // reject it.
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- The dead-code check going unnoticed is the limitation being pinned.
      const result = ([] as ("cat" | "dog")[]).filter(endsWith("bird"));

      expectTypeOf(result).toEqualTypeOf<("cat" | "dog")[]>();
      // If native `.filter` ever rejected an error-returning predicate, this
      // dead-code check would resolve to an empty result instead.
      expectTypeOf(result).not.toEqualTypeOf<never[]>();
    });

    test("isNot", () => {
      // `isNot` requires a type predicate, which makes TypeScript resolve
      // `endsWith` through the guard overload; the rejection overload is
      // never a candidate, so the dead-code check goes unnoticed.
      const result = filter([] as ("cat" | "dog")[], isNot(endsWith("bird")));

      expectTypeOf(result).toEqualTypeOf<("cat" | "dog")[]>();
      // If `isNot` ever resolved this through the rejection overload instead,
      // the dead-code check would resolve to an empty result.
      expectTypeOf(result).not.toEqualTypeOf<never[]>();
    });
  });

  describe("isNot bypasses the unsound-narrowing guard", () => {
    test("union suffix where only some members are disjoint", () => {
      // For a direct call, an unsound union suffix falls through to the
      // plain-`boolean` overload and `partition` doesn't narrow at all (see
      // "doesn't narrow when only some suffixes are disjoint" above). `isNot`
      // requires a type predicate though, so it always resolves `endsWith`
      // through the (unconditionally sound-looking) guard overload; the
      // `boolean` overload built to reject this case is never a candidate for
      // a type-predicate parameter. The result narrows to `"dog"[]`, which is
      // unsound: at runtime the suffix could be `"bird"`, in which case
      // nothing ends with it, `isNot` is `true` for every element, and `"cat"`
      // survives the filter too.
      const result = filter(
        [] as ("cat" | "dog")[],
        isNot(endsWith("t" as "t" | "bird")),
      );

      expectTypeOf(result).toEqualTypeOf<"dog"[]>();
      // If `isNot` ever resolved this through the sound `boolean` overload,
      // it wouldn't narrow at all, matching the direct-call behavior above.
      expectTypeOf(result).not.toEqualTypeOf<("cat" | "dog")[]>();
    });
  });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const endsWithBarAll = <T extends string>(data: readonly T[]) =>
  filter(data, endsWith("bar"));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we need the types to be inferred "through" the type parameter.
const hasSuffix = <Suffix extends string>(data: string, suffix: Suffix) =>
  endsWith(data, suffix);
