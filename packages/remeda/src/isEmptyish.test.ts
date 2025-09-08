import { expect, test, describe } from "vitest";
import { isEmptyish } from "./isEmptyish";

describe("nullish", () => {
  test("null", () => {
    expect(isEmptyish(null)).toBe(true);
  });

  test("undefined", () => {
    expect(isEmptyish(undefined)).toBe(true);
  });
});

describe("strings", () => {
  test("literals", () => {
    expect(isEmptyish("")).toBe(true);
    expect(isEmptyish("test")).toBe(false);
  });

  test("boxed", () => {
    // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
    expect(isEmptyish(new String(""))).toBe(true);
    // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
    expect(isEmptyish(new String("test"))).toBe(false);
  });
});

describe("arrays", () => {
  test("simple", () => {
    expect(isEmptyish([])).toBe(true);
    expect(isEmptyish([1, 2, 3])).toBe(false);
  });

  test("sparse", () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(isEmptyish([, ,])).toBe(false);
  });

  test("via Array.from", () => {
    expect(isEmptyish(Array.from({ length: 0 }))).toBe(true);
    expect(isEmptyish(Array.from({ length: 10 }))).toBe(false);
  });

  test("typed arrays", () => {
    expect(isEmptyish(new Int8Array())).toBe(true);
    expect(isEmptyish(new Int8Array([1, 2, 3]))).toBe(false);
  });

  test("buffers", () => {
    expect(isEmptyish(Buffer.alloc(0))).toBe(true);
    expect(isEmptyish(Buffer.alloc(3))).toBe(false);
  });

  test("sets", () => {
    expect(isEmptyish(new Set())).toBe(true);
    expect(isEmptyish(new Set([1, 2, 3]))).toBe(false);
  });

  test("array-like (e.g., `arguments`)", () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function empty(): void {
      // eslint-disable-next-line prefer-rest-params
      expect(isEmptyish(arguments)).toBe(true);
    }
    empty();

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function nonEmpty(_p0: string, _p1: number, _p2: boolean): void {
      // eslint-disable-next-line prefer-rest-params
      expect(isEmptyish(arguments)).toBe(false);
    }
    nonEmpty("test", 123, true);
  });
});

describe("keyed collections", () => {
  test("plain objects", () => {
    expect(isEmptyish({})).toBe(true);
    expect(isEmptyish({ key: "value" })).toBe(false);
  });

  test("null-prototyped objects", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object: { key?: string } = Object.create(null);

    expect(isEmptyish(object)).toBe(true);

    object.key = "hello, world!";

    expect(isEmptyish(object)).toBe(false);
  });

  test("symbol props", () => {
    expect(isEmptyish({ [Symbol("hello")]: "world" })).toBe(false);
  });

  test("maps", () => {
    expect(isEmptyish(new Map())).toBe(true);
    expect(isEmptyish(new Map([["key", "value"]]))).toBe(false);
  });

  test("url search params", () => {
    expect(isEmptyish(new URLSearchParams())).toBe(true);
    expect(isEmptyish(new URLSearchParams(""))).toBe(true);
    expect(isEmptyish(new URLSearchParams("?"))).toBe(true);
    expect(isEmptyish(new URLSearchParams("hello"))).toBe(false);
    expect(isEmptyish(new URLSearchParams({ hello: "world " }))).toBe(false);
  });

  test("prototype chains", () => {
    // Verifying chained prototypes would add complexity the implementation and
    // incur performance costs, and the real-life practical use for such a chain
    // is minimal.

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(isEmptyish(Object.create(Object.create({})))).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(isEmptyish(Object.create(Object.create({ a: 123 })))).toBe(false);
  });
});

describe("self-declared sizes", () => {
  test("length", () => {
    expect(isEmptyish({ length: 0 })).toBe(true);
    expect(isEmptyish({ length: 1 })).toBe(false);
  });

  test("size", () => {
    expect(isEmptyish({ size: 0 })).toBe(true);
    expect(isEmptyish({ size: 1 })).toBe(false);
  });

  test("props are not coerced", () => {
    expect(isEmptyish({ length: "0" })).toBe(false);
    expect(isEmptyish({ size: null })).toBe(false);
  });

  test("length has precedence over size", () => {
    expect(isEmptyish({ length: 0, size: 5 })).toBe(true);
    expect(isEmptyish({ length: 1, size: 0 })).toBe(false);
  });
});

describe("unsupported types", () => {
  // Most assertions in this section return the wrong value semantically and are
  // here to document the expected outputs in those cases for the current
  // implementation. If any of these break due to a change in the runtime
  // implementation they should be fixed and possibly extracted out of this
  // section!

  describe("always false", () => {
    // Empty !== Falsy...

    test("numbers", () => {
      expect(isEmptyish(0)).toBe(false);
      expect(isEmptyish(-0)).toBe(false);
      expect(isEmptyish(Number.NaN)).toBe(false);
      expect(isEmptyish(Infinity)).toBe(false);
      expect(isEmptyish(100)).toBe(false);
      expect(isEmptyish(12.34)).toBe(false);
    });

    test("bigints", () => {
      expect(isEmptyish(0n)).toBe(false);
      expect(isEmptyish(1n)).toBe(false);
    });

    test("booleans", () => {
      expect(isEmptyish(false)).toBe(false);
      expect(isEmptyish(true)).toBe(false);
    });

    test("symbols", () => {
      // Using an empty string in a symbol results in the same "kind" of
      // symbol as ones created with a non-empty string. It's unlikely that the
      // actual value of a symbol would be checked (and not its identity), and
      // that that value would be checked for emptiness explicitly.

      expect(isEmptyish(Symbol(""))).toBe(false);
      expect(isEmptyish(Symbol("something"))).toBe(false);
    });

    test("functions", () => {
      // It's not possible to check the contents of a function at runtime, and
      // even if it were, there's a semantic difference between a purely empty
      // function and one that doesn't do anything useful (but can still log,
      // for example).

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isEmptyish(() => {})).toBe(false);
      expect(
        isEmptyish(() => {
          // eslint-disable-next-line no-console
          console.log("hello");
        }),
      ).toBe(false);
    });
  });

  test("classes", () => {
    // It's hard to define what an empty class is; does it have private members?
    // are we considering it empty if one of it's fields is empty?

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class Empty {}
    class NonEmpty {
      public a = "hello";
    }
    class NonEmptyButPrivate {
      readonly #a = "hello";

      public get a(): string {
        return this.#a;
      }
    }
    class ContainerWrapper {
      public data: Array<unknown> = [];
    }

    expect(isEmptyish(new Empty())).toBe(true);
    expect(isEmptyish(new NonEmpty())).toBe(false);
    expect(isEmptyish(new NonEmptyButPrivate())).toBe(true);
    expect(isEmptyish(new ContainerWrapper())).toBe(false);
  });

  test("errors", () => {
    // Errors are just classes! We don't special-case errors to check the length
    // of the message because errors could be designed so that the message is
    // not important and they hold information in other properties, and they
    // wouldn't be semantically empty because of that.

    class MyError extends Error {
      // eslint-disable-next-line unicorn/custom-error-definition
      public constructor(public data = "hello") {
        super();
      }
    }

    // eslint-disable-next-line unicorn/error-message
    expect(isEmptyish(new Error())).toBe(true);
    expect(isEmptyish(new Error("hello world!"))).toBe(true);
    expect(isEmptyish(new MyError())).toBe(false);
  });

  describe("always true", () => {
    // These are built-in classes that would be assessed the same way we
    // assess objects; for the most part they come up as empty because they
    // don't have any public properties. We don't special-case them for
    // performance reasons (they would add redundant checks).

    test("regexp", () => {
      // There is no value in an empty regexp because it catches nothing so it's
      // unlikely that this would be needed.

      // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
      expect(isEmptyish(new RegExp(""))).toBe(true);
      expect(isEmptyish(/abc/u)).toBe(true);
    });

    test("dates", () => {
      // Dates are wrapped numbers, even if we special-case them there is no
      // clear semantic for what an "empty" date would be.

      expect(isEmptyish(new Date(0))).toBe(true);
      expect(isEmptyish(new Date())).toBe(true);
    });

    test("weak collections", () => {
      // Weak collections don't have a mechanism that allows tracking its size
      // or enumerating its entries.

      expect(isEmptyish(new WeakMap())).toBe(true);
      expect(isEmptyish(new WeakSet())).toBe(true);
    });
  });
});
