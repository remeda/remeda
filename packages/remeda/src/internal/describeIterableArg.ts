/* eslint-disable @typescript-eslint/unbound-method */
import { identity } from "../identity";
import { toBasicIterable } from "./toBasicIterable";
import { AsymmetricMatcher, equals } from "@vitest/expect";
import { isObjectWithProps } from "./isObjectWithProps";

class SameRefMatcher<T> extends AsymmetricMatcher<ReadonlyArray<T>> {
  public override asymmetricMatch(other: ReadonlyArray<T>): boolean {
    return this.sample === other;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toString(): string {
    return "SameRefMatcher";
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toAsymmetricMatcher(): string {
    return "SameRefMatcher.toAsymmetricMatcher";
  }

  public static for<T>(sample: ReadonlyArray<T>): SameRefMatcher<T> {
    return new SameRefMatcher<T>(sample);
  }
}

class ArrayContentMatcher<T> extends AsymmetricMatcher<ReadonlyArray<T>> {
  public constructor(
    sample: ReadonlyArray<T>,
    private readonly checkLength: boolean,
  ) {
    super([...sample]);
  }

  public override asymmetricMatch(other: unknown): boolean {
    if (!isObjectWithProps(other, Symbol.iterator)) {
      return false;
    }

    const otherArray = [...(other as Iterable<T>)];

    return (
      (!this.checkLength || this.sample.length === otherArray.length) &&
      otherArray.every((v, i) => equals(v, this.sample[i]))
    );
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toString(): string {
    return "ArrayContentMatcher";
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toAsymmetricMatcher(): string {
    return "ArrayContentMatcher.toAsymmetricMatcher";
  }

  public static exact<T>(sample: ReadonlyArray<T>): ArrayContentMatcher<T> {
    return new ArrayContentMatcher(sample, true);
  }

  public static prefix<T>(sample: ReadonlyArray<T>): ArrayContentMatcher<T> {
    return new ArrayContentMatcher(sample, false);
  }
}

/**
 * A function that either returns its argument unchanged or wraps it using {@link toBasicIterable}.
 */
type WrapperFn = typeof toBasicIterable;

type ExtraCases = Readonly<Record<string, WrapperFn>>;

/**
 * The body passed to `describeIterableArg`.
 */
type BodyFn = (info: IterableArgInfo) => void | PromiseLike<void>;

type IterableArgInfo = {
  /**
   * @see WrapperFn
   */
  readonly wrap: WrapperFn;
  /**
   * True iff `wrap` returns the original array.
   */
  readonly dataIsArray: boolean;
  /**
   * An asymmetric matcher that either checks if two arrays are the same
   * reference or checks that they have the same content.
   */
  readonly wrappedArray: <T>(
    a: ReadonlyArray<T>,
  ) => AsymmetricMatcher<ReadonlyArray<T>>;
  /**
   * An asymmetric matcher that either checks if an array method `data` parameter
   * is same array as another, or that it starts with the same elements as the other.
   */
  readonly arrayMethodDataParam: <T>(
    a: ReadonlyArray<T>,
  ) => AsymmetricMatcher<ReadonlyArray<T>>;
};

/**
 * A wrapper around `describe` that allows for testing functions with both
 * arrays and generic iterables.
 */
export function describeIterableArg(desc: string, body: BodyFn): void;
export function describeIterableArg(
  desc: string,
  extra: ExtraCases,
  body: BodyFn,
): void;
export function describeIterableArg(
  ...args:
    | readonly [desc: string, body: BodyFn]
    | readonly [desc: string, extra: ExtraCases, body: BodyFn]
): void {
  if (args.length === 2) {
    describeIterableArgImpl(args[0], {}, args[1]);
  } else {
    describeIterableArgImpl(args[0], args[1], args[2]);
  }
}

function describeIterableArgImpl(
  desc: string,
  extraCases: ExtraCases,
  body: BodyFn,
): void {
  if (/\$what\b/u.exec(desc) === null) {
    desc += " where type of data is $what";
  }

  function expandDesc(what: string): string {
    return desc.replace(/\$what\b/u, what);
  }

  describe(expandDesc("array"), () =>
    body({
      dataIsArray: true,
      wrappedArray: SameRefMatcher.for,
      arrayMethodDataParam: SameRefMatcher.for,
      wrap: identity(),
    }),
  );

  describe(expandDesc("array"), () =>
    body({
      dataIsArray: true,
      wrappedArray: SameRefMatcher.for,
      arrayMethodDataParam: SameRefMatcher.for,
      wrap: identity(),
    }),
  );

  for (const [key, wrap] of [
    ["generator", toBasicIterable] as const,
    ...Object.entries(extraCases),
  ]) {
    describe(expandDesc(key), () =>
      body({
        dataIsArray: true,
        wrappedArray: ArrayContentMatcher.exact,
        arrayMethodDataParam: ArrayContentMatcher.prefix,
        wrap,
      }),
    );
  }
}
