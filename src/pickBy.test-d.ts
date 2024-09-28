import { constant } from "./constant";
import { isDeepEqual } from "./isDeepEqual";
import { isDefined } from "./isDefined";
import { isNonNull } from "./isNonNull";
import { isNonNullish } from "./isNonNullish";
import { isString } from "./isString";
import { pickBy } from "./pickBy";
import { pipe } from "./pipe";

describe("data first", () => {
  test("it should pick props", () => {
    const data = { a: 1, b: 2, A: 3, B: 4 };
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
  });

  test("allow partial type", () => {
    const result = pickBy({} as { a?: string; b?: number }, constant(true));
    expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
  });
});

describe("data last", () => {
  test("it should pick props", () => {
    const data = { a: 1, b: 2, A: 3, B: 4 };
    const result = pipe(data, pickBy(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
  });

  test("allow partial type", () => {
    const result = pipe(
      {} as { a?: string; b?: number },
      pickBy(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
  });
});

test("symbols are filtered out", () => {
  const mySymbol = Symbol("mySymbol");
  const result = pickBy({ [mySymbol]: 1, a: 123 }, constant(true));
  expectTypeOf(result).toEqualTypeOf<{ a?: number }>();
});

test("symbols are not passed to the predicate", () => {
  pickBy({ [Symbol("mySymbol")]: 1, b: "hello", c: true }, (value, key) => {
    expectTypeOf(value).toEqualTypeOf<boolean | string>();
    expectTypeOf(key).toEqualTypeOf<"b" | "c">();
    return true;
  });
});

test("makes wide types partial", () => {
  const wide = pickBy({ a: 0 } as { a: number }, isDeepEqual(1 as const));
  expectTypeOf(wide).toEqualTypeOf<{ a?: 1 }>();

  const narrow = pickBy({ a: 1 } as const, (_x): _x is 1 => true);
  expectTypeOf(narrow).toEqualTypeOf<{ a: 1 }>();
});

test("works with type-guards", () => {
  const mySymbol = Symbol("test");
  const result = pickBy(
    {} as {
      a: number;
      b: string;
      [mySymbol]: string;
      literalUnion: "cat" | "dog";
      optionalA: number;
      optionalB?: string;
      optionalLiteralUnion?: "cat" | "dog";
      partialMatch: "cat" | "dog" | 3;
      partialOptionalMatch?: "cat" | "dog" | 3;
    },
    isString,
  );
  expectTypeOf(result).toEqualTypeOf<{
    b: string;
    literalUnion: "cat" | "dog";
    optionalB?: string;
    optionalLiteralUnion?: "cat" | "dog";
    partialMatch?: "cat" | "dog";
    partialOptionalMatch?: "cat" | "dog";
  }>();
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
  const resultDefined = pickBy(data, isDefined);
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

  const resultNonNull = pickBy(data, isNonNull);
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

  const resultNonNullish = pickBy(data, isNonNullish);
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
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf(data);
  });

  test("number keys", () => {
    const data = {} as Record<number, string>;
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Record<`${number}`, string>>();
  });

  test("combined numbers and strings", () => {
    const data = {} as Record<number | string, string>;
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
  });

  test("union of records", () => {
    const data = {} as Record<number, string> | Record<string, string>;
    const dataFirst = pickBy(data, constant(true));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();

    const dataLast = pipe(data, pickBy(constant(true)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();
  });
});
