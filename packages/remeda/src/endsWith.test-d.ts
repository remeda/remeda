import { describe, expectTypeOf, test } from "vitest";
import { endsWith } from "./endsWith";
import { partition } from "./partition";

describe("data-first", () => {
  test("doesn't narrow on 'string' prefix", () => {
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

  test("const data that doesn't match", () => {
    // @ts-expect-error [ts2769] -- This is what we are testing...
    endsWith("helloworld" as const, "bar");
  });

  test("literal union where no member matches", () => {
    // @ts-expect-error [ts2769] -- This is what we are testing...
    endsWith("cat" as "cat" | "dog", "bird");
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
});

describe("data-last", () => {
  test("doesn't narrow on 'string' prefix", () => {
    const [yes, no] = partition([] as string[], endsWith("bar" as string));

    expectTypeOf(yes).toEqualTypeOf<string[]>();
    expectTypeOf(no).toEqualTypeOf<string[]>();
  });

  test("const data that matches", () => {
    const [yes, no] = partition([] as "foobar"[], endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<"foobar"[]>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  test("const data that doesn't match", () => {
    partition(
      [] as "helloworld"[],
      // @ts-expect-error [ts2769] -- This is what we are testing...
      endsWith("bar"),
    );
  });

  test("literal union where no member matches", () => {
    partition(
      [] as ("cat" | "dog")[],
      // @ts-expect-error [ts2769] -- This is what we are testing...
      endsWith("bird"),
    );
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
});

describe("known issues!", () => {
  test("unbounded data with an impossible suffix", () => {
    const data = "1_bar" as `${number}_bar`;

    if (endsWith(data, "world")) {
      // Rejecting an impossible suffix relies on TypeScript reducing the
      // intersection with the template literal to `never`. It only does that
      // for bounded members; for unbounded ones it keeps the intersection
      // unreduced, so a suffix that no value could end with is still accepted
      // and the `true` branch stays inhabited by an impossible type instead.
      expectTypeOf(data).toEqualTypeOf<`${number}_bar` & `${string}world`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
    }
  });
});
