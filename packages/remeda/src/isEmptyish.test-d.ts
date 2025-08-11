import { describe, expectTypeOf, test } from "vitest";
import { isEmptyish } from "./isEmptyish";

describe("objects", () => {
  test("empty object", () => {
    const data = {} as const;
    if (isEmptyish(data)) {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      expectTypeOf(data).toEqualTypeOf<{}>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("unbounded record", () => {
    const data = {} as Record<string, string>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<string, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<string, string>>();
    }
  });

  test("bounded record", () => {
    const data = {} as Record<"a" | "b", number>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<"a" | "b", number>>();
    }
  });

  test("partial bounded record", () => {
    const data = {} as Partial<Record<"a" | "b", number>>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<"a" | "b", never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Partial<Record<"a" | "b", number>>>();
    }
  });

  test("partial and required props", () => {
    const data = {} as { a: number; b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: number; b?: string }>();
    }
  });

  test("interfaces", () => {
    interface MyInterface {
      a: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });
});

describe("strings", () => {
  test("primitive string", () => {
    const data = "" as string;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("empty string", () => {
    const data = "" as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("no-empty string", () => {
    const data = "test" as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"test">();
    }
  });

  test("union of non-empty string literals", () => {
    const data = "cat" as "cat" | "dog";
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("union of string literals (with empty)", () => {
    const data = "" as "" | "cat" | "dog";
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("non-empty string templates", () => {
    const data = "prefix_0" as `prefix_${number}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`prefix_${number}`>();
    }
  });

  test("string template (with empty)", () => {
    const data = "" as "" | `prefix_${number}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<`prefix_${number}`>();
    }
  });
});

describe("nullish", () => {
  test("undefined", () => {
    const data = undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("null", () => {
    const data = null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("optional string", () => {
    const data = undefined as string | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("nullable string", () => {
    const data = null as string | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("optional non-empty string literals", () => {
    const data = "cat" as "cat" | "dog" | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("optional string literals with empty", () => {
    const data = "" as "" | "cat" | "dog" | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("optional non-empty string templates", () => {
    const data = "prefix_0" as `prefix_${number}` | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`prefix_${number}`>();
    }
  });
});

describe("tuples", () => {
  test("empty tuple", () => {
    const data = [] as [];
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<[]>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("empty readonly tuple", () => {
    const data = [] as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("fixed tuple", () => {
    const data = [1, 2, 3] as [number, number, number];
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, number, number]>();
    }
  });

  test("fixed readonly tuple", () => {
    const data = [1, 2, 3] as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();
    }
  });

  test("array", () => {
    const data = [] as Array<"cat">;
    if (isEmptyish(data)) {
      // This is effectively the empty array, but because the input was mutable
      // the output is also mutable and we need to maintain the type of the
      // items in the array (for functions like `push`).
      expectTypeOf(data).toEqualTypeOf<Array<"cat"> & []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Array<"cat">>();
    }
  });

  test("readonly array", () => {
    const data = [] as ReadonlyArray<"cat">;
    if (isEmptyish(data)) {
      // This is effectively the empty array, but because the input was mutable
      // the output is also mutable and we need to maintain the type of the
      // items in the array (for functions like `push`).
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<"cat"> & readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<"cat">>();
    }
  });
});

test("maps", () => {
  expectTypeOf(isEmptyish(new Map())).toBe(true);
  expectTypeOf(isEmptyish(new Map([["key", "value"]]))).toBe(false);
});

test("sets", () => {
  expectTypeOf(isEmptyish(new Set())).toBe(true);
  expectTypeOf(isEmptyish(new Set([1, 2, 3]))).toBe(false);
});

test("typed arrays", () => {
  expectTypeOf(isEmptyish(new Uint8Array())).toBe(true);
  expectTypeOf(isEmptyish(new Uint8Array([1, 2, 3]))).toBe(false);
});

test("buffers", () => {
  expectTypeOf(isEmptyish(Buffer.alloc(0))).toBe(true);
  expectTypeOf(isEmptyish(Buffer.alloc(3))).toBe(false);
});

test("array-like (e.g., `arguments`)", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function empty(): void {
    // eslint-disable-next-line prefer-rest-params
    expectTypeOf(isEmptyish(arguments)).toBe(true);
  }
  empty();

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function nonEmpty(_p0: string, _p1: number, _p2: boolean): void {
    // eslint-disable-next-line prefer-rest-params
    expectTypeOf(isEmptyish(arguments)).toBe(false);
  }
  nonEmpty("test", 123, true);
});

test("url search params", () => {
  expectTypeOf(isEmptyish(new URLSearchParams())).toBe(true);
  expectTypeOf(isEmptyish(new URLSearchParams(""))).toBe(true);
  expectTypeOf(isEmptyish(new URLSearchParams("?"))).toBe(true);
  expectTypeOf(isEmptyish(new URLSearchParams("hello"))).toBe(false);
  expectTypeOf(isEmptyish(new URLSearchParams({ hello: "world " }))).toBe(
    false,
  );
});

test("arbitrary sized objects", () => {
  expectTypeOf(isEmptyish({ length: 0 })).toBe(true);
  expectTypeOf(isEmptyish({ length: 1 })).toBe(false);
  expectTypeOf(isEmptyish({ size: 0 })).toBe(true);
  expectTypeOf(isEmptyish({ size: 1 })).toBe(false);
});

test("self-declared props are not coerced", () => {
  expectTypeOf(isEmptyish({ length: "0" })).toBe(false);
  expectTypeOf(isEmptyish({ size: null })).toBe(false);
});

test("string objects", () => {
  expectTypeOf(isEmptyish(new String(""))).toEqualTypeOf<never>();
  expectTypeOf(isEmptyish(new String("test"))).toBe(false);
});
