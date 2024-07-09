import { isEmpty } from "./isEmpty";

test("does not accept invalid input types", () => {
  // @ts-expect-error [ts2769] number is not a valid input type
  isEmpty(2);

  // @ts-expect-error [ts2769] boolean is not a valid input type
  isEmpty(false);

  // @ts-expect-error [ts2769] null is not a valid input type
  isEmpty(null);

  // @ts-expect-error [ts2769] undefined is only allowed with strings
  isEmpty([] as ReadonlyArray<string> | undefined);

  // @ts-expect-error [ts2769] undefined is only allowed with strings
  isEmpty({} as Record<string, string> | undefined);
});

describe("strings are narrowed correctly", () => {
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
