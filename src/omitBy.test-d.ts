import { constant } from "./constant";
import { isDeepEqual } from "./isDeepEqual";
import { isNullish } from "./isNullish";
import { isString } from "./isString";
import { omitBy } from "./omitBy";
import { pipe } from "./pipe";

describe("data first", () => {
  test("it should omit props", () => {
    const result = omitBy({ a: 1, b: 2, A: 3, B: 4 } as const, constant(true));

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

test("makes wide types partial", () => {
  const wide = omitBy({ a: 0 } as { a: number }, isDeepEqual(1 as const));

  expectTypeOf(wide).toEqualTypeOf<{ a?: number }>();

  const narrow = omitBy({ a: 1 } as const, (_x): _x is 1 => true);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  expectTypeOf(narrow).toEqualTypeOf<{}>();
});

test("works well with nullish type-guards", () => {
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

// @see https://github.com/remeda/remeda/issues/696
describe("records with non-narrowing predicates (Issue #696)", () => {
  test("string keys", () => {
    const data = {} as Record<string, string>;
    const result = omitBy(data, constant(true));

    expectTypeOf(result).toEqualTypeOf(data);
  });

  test("number keys", () => {
    const data = {} as Record<number, string>;
    const result = omitBy(data, constant(true));

    expectTypeOf(result).toEqualTypeOf<Record<`${number}`, string>>();
  });

  test("combined numbers and strings", () => {
    const data = {} as Record<number | string, string>;
    const result = omitBy(data, constant(true));

    expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
  });

  test("union of records", () => {
    const data = {} as Record<number, string> | Record<string, string>;

    const dataFirst = omitBy(data, constant(true));

    expectTypeOf(dataFirst).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();

    const dataLast = pipe(data, omitBy(constant(true)));

    expectTypeOf(dataLast).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();
  });
});

const isUndefined = (value: unknown): value is undefined => value === undefined;

const isNull = (value: unknown): value is null =>
  typeof value === "object" && value === null;
