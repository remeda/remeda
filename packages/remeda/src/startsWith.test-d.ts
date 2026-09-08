import { describe, expectTypeOf, test } from "vitest";
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

  test("const data that doesn't match", () => {
    // @ts-expect-error [ts2769] -- This is what we are testing...
    startsWith("helloworld" as const, "foo");
  });

  test("literal union where no member matches", () => {
    // @ts-expect-error [ts2769] -- This is what we are testing...
    startsWith("cat" as "cat" | "dog", "bird");
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

  test("const data that doesn't match", () => {
    partition(
      [] as "helloworld"[],
      // @ts-expect-error [ts2769] -- This is what we are testing...
      startsWith("foo"),
    );
  });

  test("literal union where no member matches", () => {
    partition(
      [] as ("cat" | "dog")[],
      // @ts-expect-error [ts2769] -- This is what we are testing...
      startsWith("bird"),
    );
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
});

describe("known issues!", () => {
  test("unbounded data with an impossible prefix", () => {
    const data = "foo_1" as `foo_${number}`;

    if (startsWith(data, "hello")) {
      // Rejecting an impossible prefix relies on TypeScript reducing the
      // intersection with the template literal to `never`. It only does that
      // for bounded members; for unbounded ones it keeps the intersection
      // unreduced, so a prefix that no value could start with is still
      // accepted and the `true` branch stays inhabited by an impossible type
      // instead.
      expectTypeOf(data).not.toEqualTypeOf<never>();
      expectTypeOf(data).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
    }
  });
});
