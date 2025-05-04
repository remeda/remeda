import { partition } from "./partition";
import { endsWith } from "./endsWith";

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
    const data = "helloworld" as const;
    if (endsWith(data, "bar")) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"helloworld">();
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

  test("template literal data that doesn't match", () => {
    const data = "1_bar" as `${number}_bar`;
    if (endsWith(data, "world")) {
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      expectTypeOf(data).toEqualTypeOf<`${number}_bar` & `${string}world`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`${number}_bar`>();
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
    const [yes, no] = partition([] as Array<string>, endsWith("bar" as string));

    expectTypeOf(yes).toEqualTypeOf<Array<string>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  test("const data that matches", () => {
    const [yes, no] = partition([] as Array<"foobar">, endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<Array<"foobar">>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  test("const data that doesn't match", () => {
    const [yes, no] = partition([] as Array<"helloworld">, endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<Array<never>>();
    expectTypeOf(no).toEqualTypeOf<Array<"helloworld">>();
  });

  test("primitive string data", () => {
    const [yes, no] = partition([] as Array<string>, endsWith("bar"));

    expectTypeOf(yes).toEqualTypeOf<Array<`${string}bar`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  test("template literal data that matches", () => {
    const [yes, no] = partition([] as Array<`${number}_bar`>, endsWith("bar"));

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`${number}_bar`>>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  test("template literal data that doesn't match", () => {
    const [yes, no] = partition(
      [] as Array<`${number}_bar`>,
      endsWith("world"),
    );

    expectTypeOf(yes).toEqualTypeOf<
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      Array<`${number}_bar` & `${string}world`>
    >();
    expectTypeOf(no).toEqualTypeOf<Array<`${number}_bar`>>();
  });

  test("literal union", () => {
    const [yes, no] = partition([] as Array<"cat" | "dog">, endsWith("t"));

    expectTypeOf(yes).toEqualTypeOf<Array<"cat">>();
    expectTypeOf(no).toEqualTypeOf<Array<"dog">>();
  });

  test("template union", () => {
    const [yes, no] = partition(
      [] as Array<`${boolean}_dog` | `${number}_cat`>,
      endsWith("t"),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`${number}_cat`>>();
    expectTypeOf(no).toEqualTypeOf<Array<`${boolean}_dog`>>();
  });
});
