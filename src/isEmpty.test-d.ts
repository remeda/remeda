import { isEmpty } from "./isEmpty";

describe("invalid types", () => {
  test("number", () => {
    // @ts-expect-error [ts2769] number is not a valid input type
    isEmpty(2);
  });

  test("boolean", () => {
    // @ts-expect-error [ts2769] boolean is not a valid input type
    isEmpty(false);
  });

  test("null", () => {
    // @ts-expect-error [ts2769] null is not a valid input type
    isEmpty(null);
  });

  test("optional arrays", () => {
    // @ts-expect-error [ts2769] undefined is only allowed with strings
    isEmpty([] as ReadonlyArray<string> | undefined);
  });

  test("optional objects", () => {
    // @ts-expect-error [ts2769] undefined is only allowed with strings
    isEmpty({} as Record<string, string> | undefined);
  });
});

describe("objects", () => {
  test("infinite record", () => {
    const data = {} as Record<string, string>;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<string, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<string, string>>();
    }
  });

  test("required record", () => {
    const data = { a: 123, b: 456 } as Record<"a" | "b", number>;
    if (isEmpty(data)) {
      // @ts-expect-error [ts2554] -- This is a mistake, the type should be
      // narrowed to never because the object can never be empty.
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<"a" | "b", number>>();
    }
  });

  test("partial record", () => {
    const data = {} as Partial<Record<"a" | "b", number>>;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<"a" | "b", never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Partial<Record<"a" | "b", number>>>();
    }
  });

  test("interfaces", () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Intentional
    interface MyInterface {
      a: number;
    }
    const data = { a: 123 } as MyInterface;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<"a", never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });
});

describe("strings", () => {
  test("just undefined", () => {
    const data = undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test("just string", () => {
    const data = "" as string;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    }
  });

  test("just EMPTY string", () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const data = "" as const;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    }
  });

  test("string or undefined", () => {
    const data = undefined as string | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    }
  });

  test("string literals that CANT be empty or undefined", () => {
    const data = "cat" as "cat" | "dog";
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("string literals that CAN be empty", () => {
    const data = "cat" as "" | "cat" | "dog";
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    }
  });

  test("string literals that CAN be undefined", () => {
    const data = "cat" as "cat" | "dog" | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test("string literals that CAN be undefined or empty", () => {
    const data = "cat" as "" | "cat" | "dog" | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    }
  });

  test("string templates that CANT be empty or undefined", () => {
    const data = "prefix_0" as `prefix_${number}`;
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("string templates that CAN be empty", () => {
    const data = "" as "" | `prefix_${number}`;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"">();
    }
  });

  test("string templates that CAN be undefined", () => {
    const data = "prefix_0" as `prefix_${number}` | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test("string templates that CAN be undefined or empty", () => {
    const data = "prefix_0" as "" | `prefix_${number}` | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<"" | undefined>();
    }
  });
});
