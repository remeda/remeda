import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { endsWith } from "./endsWith";
import { filter } from "./filter";
import { isNot } from "./isNot";
import { partition } from "./partition";

describe("data-first", () => {
  test("doesn't narrow on 'string' suffix", () => {
    const data = "foobar" as string;
    if (endsWith(data, "bar" as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
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
    const data = "foobar" as string;
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

  test("generic data", () => {
    expectTypeOf(endsWithBar($typed<string>())).toEqualTypeOf<
      `${string}bar` | undefined
    >();
  });

  test("generic suffix", () => {
    expectTypeOf(hasSuffix("foobar", "bar")).toEqualTypeOf<boolean>();
  });
});

describe("data-last", () => {
  test("doesn't narrow on 'string' suffix", () => {
    const [yes, no] = partition([] as string[], endsWith("bar" as string));

    expectTypeOf(yes).toEqualTypeOf<string[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
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
});

// @see https://github.com/remeda/remeda/issues/1432
describe("reject disjoint suffixes (#1432)", () => {
  test("const data that doesn't match", () => {
    // @ts-expect-error [ts1345] -- Intentional! we check that the result of `endsWith` cannot be coerced to a boolean value!
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/strict-boolean-expressions -- Intentional! this form is the most concise way to test what we need.
    !endsWith("helloworld" as const, "foo");
  });

  test("literal union where no member matches", () => {
    // @ts-expect-error [ts1345] -- Intentional! we check that the result of `endsWith` cannot be coerced to a boolean value!
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/strict-boolean-expressions -- Intentional! this form is the most concise way to test what we need.
    !endsWith("cat" as "cat" | "dog", "bird");
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
  });
});

describe("known issues!", () => {
  describe("template literals with an impossible suffix aren't rejected", () => {
    test("data-first", () => {
      const data = "1_bar" as `${number}_bar`;

      if (endsWith(data, "world")) {
        // Rejecting an impossible suffix relies on TypeScript reducing the
        // intersection with the suffix template to `never`. It only does that for
        // bounded types; an intersection of two unbounded template literals is
        // left as-is even when they are disjoint, so the check is accepted and
        // the `true` branch is typed with an uninhabitable intersection instead.
        // @see https://github.com/microsoft/TypeScript/issues/60446
        expectTypeOf(data).toEqualTypeOf<`${number}_bar` & `${string}world`>();
      } else {
        expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
      }
    });

    test("data-last", () => {
      const [yes, no] = partition([] as `${number}_bar`[], endsWith("world"));

      expectTypeOf(yes).toEqualTypeOf<(`${number}_bar` & `${string}world`)[]>();
      expectTypeOf(no).toEqualTypeOf<`${number}_bar`[]>();
    });
  });

  // TODO: Ask claude if changing the return value from void to never would work and would fix this known issue...
  test("native array methods don't reject a dead-code check", () => {
    // `Array.prototype.filter` accepts any callback returning `unknown`, so it
    // also accepts the `void`-returning predicate a dead-code check resolves
    // to. Remeda's own `filter` requires a `boolean` and does reject it.
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- The always-falsy predicate is the limitation being pinned.
      ([] as ("cat" | "dog")[]).filter(endsWith("bird")),
    ).toEqualTypeOf<("cat" | "dog")[]>();
  });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const endsWithBar = <T extends string>(data: T) =>
  endsWith(data, "bar") ? data : undefined;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional, we need the types to be inferred "through" the type parameter.
const endsWithBarAll = <T extends string>(data: readonly T[]) =>
  filter(data, endsWith("bar"));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters -- Intentional, we need the types to be inferred "through" the type parameter.
const hasSuffix = <Suffix extends string>(data: string, suffix: Suffix) =>
  endsWith(data, suffix);
