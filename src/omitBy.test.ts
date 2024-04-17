import { constant } from "./constant";
import { isDeepEqual } from "./isDeepEqual";
import { isNullish } from "./isNullish";
import { isString } from "./isString";
import { omitBy } from "./omitBy";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      omitBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        { a: 1, b: 2, A: 3, B: 4 },
        omitBy((_, key) => key.toUpperCase() === key),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("number keys are converted to strings in the mapper", () => {
    omitBy({ 123: "hello" }, (_, key) => {
      expect(key).toBe("123");
      return true;
    });
  });

  test("symbols are passed through", () => {
    const mySymbol = Symbol("mySymbol");
    expect(omitBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({
      [mySymbol]: 1,
    });
  });

  test("symbols are not passed to the predicate", () => {
    const mock = vi.fn();
    const data = { [Symbol("mySymbol")]: 1, a: "hello" };
    omitBy(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("hello", "a", data);
  });
});

describe("typing", () => {
  describe("data first", () => {
    test("it should omit props", () => {
      const result = omitBy(
        { a: 1, b: 2, A: 3, B: 4 } as const,
        constant(true),
      );
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; A?: 3; B?: 4 }>();
    });

    test("allow partial type", () => {
      const result = omitBy(
        {} as Partial<{ a: string; b: number }>,
        constant(true),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  describe("data last", () => {
    test("it should omit props", () => {
      const result = pipe(
        { a: 1, b: 2, A: 3, B: 4 } as const,
        omitBy(constant(true)),
      );
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; A?: 3; B?: 4 }>();
    });

    test("allow partial type", () => {
      const result = pipe(
        {} as Partial<{ a: string; b: number }>,
        omitBy(constant(true)),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  test("symbols are passed through", () => {
    const requiredSymbol = Symbol("required");
    const optionalSymbol = Symbol("optional");
    const result = omitBy(
      {} as { [requiredSymbol]: number; [optionalSymbol]?: boolean; a: string },
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<{
      [requiredSymbol]: number;
      [optionalSymbol]?: boolean;
      a?: string;
    }>();
  });

  test("symbols are not passed to the predicate", () => {
    omitBy({ [Symbol("mySymbol")]: 1, b: "hello", c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
      return true;
    });
  });

  test("number keys are passed as strings to the predicate", () => {
    omitBy({ 123: "hello" }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<"123">();
      return true;
    });
  });

  test("handles type-predicates", () => {
    const result = omitBy(
      {} as {
        a: string;
        b: number;
        optionalA?: string;
        optionalB?: number;
        union: number | string;
        optionalUnion?: number | string;
      },
      isString,
    );
    expectTypeOf(result).toEqualTypeOf<{
      b: number;
      optionalB?: number;
      union?: number;
      optionalUnion?: number;
    }>();
  });

  test("Makes wide types partial", () => {
    const wide = omitBy({ a: 0 } as { a: number }, isDeepEqual(1 as const));
    expectTypeOf(wide).toEqualTypeOf<{ a?: number }>();

    const narrow = omitBy({ a: 1 } as const, (_x): _x is 1 => true);
    // eslint-disable-next-line @typescript-eslint/ban-types -- Expected!
    expectTypeOf(narrow).toEqualTypeOf<{}>();
  });

  test("Works well with nullish type-guards", () => {
    const data = {} as {
      required: string;
      optional?: string;
      undefinable: string | undefined;
      nullable: string | null;
      nullish: string | null | undefined;
      optionalUndefinable?: string | undefined;
      optionalNullable?: string | null;
      optionalNullish?: string | null | undefined;
    };

    const resultDefined = omitBy(data, isUndefined);
    expectTypeOf(resultDefined).toEqualTypeOf<{
      required: string;
      optional?: string;
      undefinable?: string;
      nullable: string | null;
      nullish?: string | null;
      optionalUndefinable?: string;
      optionalNullable?: string | null;
      optionalNullish?: string | null;
    }>();

    const resultNonNull = omitBy(data, isNull);
    expectTypeOf(resultNonNull).toEqualTypeOf<{
      required: string;
      optional?: string;
      undefinable: string | undefined;
      nullable?: string;
      nullish?: string | undefined;
      optionalUndefinable?: string | undefined;
      optionalNullable?: string;
      optionalNullish?: string | undefined;
    }>();

    const resultNonNullish = omitBy(data, isNullish);
    expectTypeOf(resultNonNullish).toEqualTypeOf<{
      required: string;
      optional?: string;
      undefinable?: string;
      nullable?: string;
      nullish?: string;
      optionalUndefinable?: string;
      optionalNullable?: string;
      optionalNullish?: string;
    }>();
  });
});

const isUndefined = <T>(value: T | undefined): value is undefined =>
  value === undefined;

const isNull = <T>(value: T | null): value is null =>
  typeof value === "object" && value === null;
