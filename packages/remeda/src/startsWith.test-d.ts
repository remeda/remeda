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
    const data = "helloworld" as const;
    if (startsWith(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"helloworld">();
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

  test("template literal data that doesn't match", () => {
    const data = "foo_1" as `foo_${number}`;
    if (startsWith(data, "hello")) {
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      expectTypeOf(data).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
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
    const [yes, no] = partition(
      [] as Array<string>,
      startsWith("foo" as string),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<string>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  test("const data that matches", () => {
    const [yes, no] = partition([] as Array<"foobar">, startsWith("foo"));

    expectTypeOf(yes).toEqualTypeOf<Array<"foobar">>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  test("const data that doesn't match", () => {
    const [yes, no] = partition([] as Array<"helloworld">, startsWith("foo"));

    expectTypeOf(yes).toEqualTypeOf<Array<never>>();
    expectTypeOf(no).toEqualTypeOf<Array<"helloworld">>();
  });

  test("primitive string data", () => {
    const [yes, no] = partition([] as Array<string>, startsWith("foo"));

    expectTypeOf(yes).toEqualTypeOf<Array<`foo${string}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  test("template literal data that matches", () => {
    const [yes, no] = partition(
      [] as Array<`foo_${number}`>,
      startsWith("foo"),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`foo_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  test("template literal data that doesn't match", () => {
    const [yes, no] = partition(
      [] as Array<`foo_${number}`>,
      startsWith("hello"),
    );

    expectTypeOf(yes).toEqualTypeOf<
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      Array<`foo_${number}` & `hello${string}`>
    >();
    expectTypeOf(no).toEqualTypeOf<Array<`foo_${number}`>>();
  });

  test("literal union", () => {
    const [yes, no] = partition([] as Array<"cat" | "dog">, startsWith("c"));

    expectTypeOf(yes).toEqualTypeOf<Array<"cat">>();
    expectTypeOf(no).toEqualTypeOf<Array<"dog">>();
  });

  test("template union", () => {
    const [yes, no] = partition(
      [] as Array<`cat_${number}` | `dog_${boolean}`>,
      startsWith("c"),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`cat_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<`dog_${boolean}`>>();
  });
});
