import type { Tagged } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { isEmptyish } from "./isEmptyish";

describe("strings", () => {
  test("primitives", () => {
    const data = "test" as string;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("empty literal", () => {
    const data = "" as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("non-empty literals", () => {
    const data = "test" as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"test">();
    }
  });

  test("union of non-empty literals", () => {
    const data = "cat" as "cat" | "dog";
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("union with an empty literal", () => {
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

  test("empty-able string template", () => {
    const data = "" as `${"" | "cat"}${"" | "dog"}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog" | "catdog">();
    }
  });
});

describe("branded", () => {
  test("primitive", () => {
    const data = "" as Tagged<string, "brand">;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<"", "brand">>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<string, "brand">>();
    }
  });

  test("non-empty literal", () => {
    const data = "test" as Tagged<"test", "brand">;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<"test", "brand">>();
    }
  });

  test("empty literal", () => {
    const data = "" as Tagged<"", "brand">;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<"", "brand">>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("union of non-empty literals", () => {
    const data = "cat" as Tagged<"cat" | "dog", "brand">;
    // TODO: SOLVE THIS LAST, THE SOLUTION I FOUND IS TO JUST ADD READONLY TO THE FUNCTION DECLARATION, BUT THAT BREAKS OBJECT TYPES :(
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<"cat" | "dog", "brand">>();
    }
  });

  test("union of empty and non-empty literals", () => {
    const data = "" as Tagged<"test" | "", "brand">;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<"", "brand">>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<"test", "brand">>();
    }
  });
});

describe("nullish", () => {
  test("null", () => {
    const data = null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("undefined", () => {
    const data = undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("optional nullable", () => {
    const data = null as null | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("optional primitive", () => {
    const data = undefined as string | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("optional non-empty literal", () => {
    const data = "cat" as "cat" | "dog" | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  test("optional empty literal", () => {
    const data = "" as "" | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("nullable primitive", () => {
    const data = null as string | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  test("nullable non-empty literal", () => {
    const data = "cat" as "cat" | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat">();
    }
  });

  test("nullable empty literal", () => {
    const data = "" as "" | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("optional, nullable, empty, and non-empty", () => {
    const data = "" as "" | "cat" | null | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | null | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat">();
    }
  });
});

describe("all tuple shapes", () => {
  // See TupleParts for a description of all possible tuple shapes.

  test("empty tuple", () => {
    const data = [] as [];
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<[]>();
    } else {
      // Can never be non-empty
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("empty readonly tuple", () => {
    const data = [] as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      // Can never be non-empty
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("fixed tuple", () => {
    const data = [1, 2, 3] as [number, number, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, number, number]>();
    }
  });

  test("fixed readonly tuple", () => {
    const data = [1, 2, 3] as const;
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();
    }
  });

  test("array", () => {
    const data = [] as Array<"cat">;
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<Array<"cat">>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Array<"cat">>();
    }
  });

  test("readonly array", () => {
    const data = [] as ReadonlyArray<"cat">;
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<"cat">>();
    }
  });

  test("optional tuple", () => {
    const data = [] as [number?, number?, string?];
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<[number?, number?, string?]>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number?, number?, string?]>();
    }
  });

  test("readonly optional tuple", () => {
    const data = [] as readonly [number?, number?, string?];
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number?, number?, string?]>();
    }
  });

  test("fixed-prefix array", () => {
    const data = [1] as [number, ...Array<number>];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, ...Array<number>]>();
    }
  });

  test("readonly fixed-prefix array", () => {
    const data = [1] as readonly [number, ...Array<number>];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number, ...Array<number>]>();
    }
  });

  test("fixed-suffix array", () => {
    const data = [1] as [...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[...Array<number>, number]>();
    }
  });

  test("readonly fixed-suffix array", () => {
    const data = [1] as readonly [...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [...Array<number>, number]>();
    }
  });

  test("mixed tuples", () => {
    const data = [1] as [number, string?];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, string?]>();
    }
  });

  test("readonly mixed tuples", () => {
    const data = [1] as readonly [number, string?];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number, string?]>();
    }
  });

  test("optional prefix arrays", () => {
    const data = [] as [number?, ...Array<number>];
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<[number?, ...Array<number>]>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number?, ...Array<number>]>();
    }
  });

  test("readonly optional prefix arrays", () => {
    const data = [] as readonly [number?, ...Array<number>];
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toExtend<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number?, ...Array<number>]>();
    }
  });

  test("fixed-elements array", () => {
    const data = [1, 2] as [number, ...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, ...Array<number>, number]>();
    }
  });

  test("readonly fixed-elements array", () => {
    const data = [1, 2] as readonly [number, ...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<
        readonly [number, ...Array<number>, number]
      >();
    }
  });
});

describe("array-like", () => {
  test("typed arrays", () => {
    const data = new Int8Array();
    if (isEmptyish(data)) {
      // Typed arrays are either mutable via their underlying buffer, or they
      // do not track their length; in both cases we don't have a narrower type
      // to represent the emptiness.

      expectTypeOf(data).toExtend<Int8Array<ArrayBuffer>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Int8Array<ArrayBuffer>>();
    }
  });

  test("buffers", () => {
    const data = Buffer.alloc(0);
    if (isEmptyish(data)) {
      // There's no way to construct an empty Buffer at the type level.

      expectTypeOf(data).toExtend<Buffer<ArrayBuffer>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Buffer<ArrayBuffer>>();
    }
  });

  test("sets", () => {
    const data = new Set<number>();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Set<number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Set<number>>();
    }
  });

  test("readonly sets", () => {
    const data = new Set<number>() as ReadonlySet<number>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlySet<never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlySet<number>>();
    }
  });

  test("array-like (e.g., `arguments`)", () => {
    // @ts-expect-error [ts6133] -- This is the best way to initialize a proper
    // `arguments` array.
    // eslint-disable-next-line unicorn/consistent-function-scoping, @typescript-eslint/no-unused-vars
    function foo(): void {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      if (isEmptyish(args)) {
        expectTypeOf(args).toExtend<IArguments>();
      } else {
        expectTypeOf(args).toEqualTypeOf<IArguments>();
      }
    }
  });
});

describe("plain objects", () => {
  test("never record", () => {
    const data = {} as Record<PropertyKey, never>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Record<PropertyKey, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("readonly never record", () => {
    const data = {} as Readonly<Record<PropertyKey, never>>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<PropertyKey, never>>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("plain object", () => {
    const data = { a: 123, b: "hello" } as { a: number; b: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: number; b: string }>();
    }
  });

  test("readonly plain object", () => {
    const data = { a: 123, b: "hello" } as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a: 123;
        readonly b: "hello";
      }>();
    }
  });

  test("unbounded record", () => {
    const data = {} as Record<string, string>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Record<string, string>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<string, string>>();
    }
  });

  test("readonly unbounded record", () => {
    const data = {} as Readonly<Record<string, string>>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<string, never>>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<string, string>>>();
    }
  });

  test("partial bounded record", () => {
    const data = {} as { a?: number; b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ a?: number; b?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: number; b?: string }>();
    }
  });

  test("readonly partial bounded record", () => {
    const data = {} as { readonly a?: number; readonly b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: never;
        readonly b?: never;
      }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: number;
        readonly b?: string;
      }>();
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

  test("required interfaces", () => {
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

  test("optional interfaces", () => {
    interface MyInterface {
      a?: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<MyInterface>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });

  test("optional readonly interfaces", () => {
    interface MyInterface {
      readonly a?: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });

  test("required prop and index signature", () => {
    const data = { a: "hello" } as { a: string; [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: string; [key: string]: string }>();
    }
  });

  test("readonly required prop and index signature", () => {
    const data = { a: "hello" } as {
      readonly a: string;
      readonly [key: string]: string;
    };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a: string;
        readonly [key: string]: string;
      }>();
    }
  });

  test("optional prop and index signature", () => {
    const data = {} as { a?: string; [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ a?: string; [key: string]: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string; [key: string]: string }>();
    }
  });

  test("readonly optional prop and index signature", () => {
    const data = {} as { readonly a?: string; readonly [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: never;
        readonly [key: string]: never;
      }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: string;
        readonly [key: string]: string;
      }>();
    }
  });

  test("required symbol prop", () => {
    const mySymbol = Symbol("hello");
    const data = { [mySymbol]: "world" };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ [mySymbol]: string }>();
    }
  });

  test("optional symbol prop", () => {
    const mySymbol = Symbol("hello");
    const data = {} as { [mySymbol]?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ [mySymbol]?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ [mySymbol]?: string }>();
    }
  });

  test("readonly optional symbol prop", () => {
    const mySymbol = Symbol("hello");
    const data = {} as { readonly [mySymbol]?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly [mySymbol]?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ readonly [mySymbol]?: string }>();
    }
  });
});

describe("keyed collections", () => {
  test("maps", () => {
    const data = new Map<string, number>();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Map<string, number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Map<string, number>>();
    }
  });

  test("readonly maps", () => {
    const data: ReadonlyMap<string, number> = new Map();
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlyMap<string, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlyMap<string, number>>();
    }
  });

  test("search params", () => {
    const data = new URLSearchParams();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<URLSearchParams>();
    } else {
      expectTypeOf(data).toEqualTypeOf<URLSearchParams>();
    }
  });
});

describe("generic types", () => {
  test("non-nullable", () => {
    const data = {} as const;
    if (isEmptyish(data)) {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      expectTypeOf(data).toExtend<{}>();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      expectTypeOf(data).toEqualTypeOf<{}>();
    }
  });

  test("any", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const data = "" as any;
    if (isEmptyish(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expectTypeOf(data).toEqualTypeOf<any>();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expectTypeOf(data).toEqualTypeOf<any>();
    }
  });

  test("unknown", () => {
    const data = "" as unknown;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<unknown>();
    } else {
      expectTypeOf(data).toEqualTypeOf<unknown>();
    }
  });
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
