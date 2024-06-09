import { ALL_TYPES_DATA_PROVIDER } from "../test/typesDataProvider";
import { isNullish } from "./isNullish";

describe("runtime", () => {
  it("accepts nulls", () => {
    expect(isNullish(null)).toBe(true);
  });

  it("accepts undefined", () => {
    expect(isNullish(undefined)).toBe(true);
  });

  it("doesn't accept anything else", () => {
    for (const data of ALL_TYPES_DATA_PROVIDER) {
      if (data === null || data === undefined) {
        continue;
      }
      expect(isNullish(data)).toBe(false);
    }
  });
});

describe("typing", () => {
  it("narrows nulls", () => {
    const data = 123 as number | null;
    if (isNullish(data)) {
      expectTypeOf(data).toBeNull();
    } else {
      expectTypeOf(data).toBeNumber();
    }
  });

  it("narrows undefined", () => {
    const data = 123 as number | undefined;
    if (isNullish(data)) {
      expectTypeOf(data).toBeUndefined();
    } else {
      expectTypeOf(data).toBeNumber();
    }
  });

  it("narrows on both", () => {
    const data = 123 as number | null | undefined;
    if (isNullish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toBeNumber();
    }
  });

  it("doesn't narrow non-nullables", () => {
    const data = 123;
    if (isNullish(data)) {
      expectTypeOf(data).toBeNever();
    } else {
      expectTypeOf(data).toBeNumber();
    }
  });

  it("narrows unknowns", () => {
    const data = 123 as unknown;
    if (isNullish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toBeUnknown();
    }
  });

  it("narrows any", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const data = 123 as any;
    if (isNullish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toBeAny();
    }
  });

  it("doesn't expand narrow types", () => {
    const data = "cat" as "cat" | "dog" | null | undefined;
    if (isNullish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<"cat" | "dog">();
    }
  });

  it("should work as type guard in filter", () => {
    const result = ALL_TYPES_DATA_PROVIDER.filter(isNullish);
    expectTypeOf(result).toEqualTypeOf<Array<null | undefined>>();
  });
});
