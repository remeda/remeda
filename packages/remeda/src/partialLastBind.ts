import type { IterableContainer } from "./internal/types/IterableContainer";
import type { RemedaTypeError } from "./internal/types/RemedaTypeError";
import type { StrictFunction } from "./internal/types/StrictFunction";
import type { TupleSplits } from "./internal/types/TupleSplits";

type PartialLastBindError<
  Message extends string,
  Metadata = never,
> = RemedaTypeError<"partialLastBind", Message, { metadata: Metadata }>;

type TupleSuffix<T extends IterableContainer> = TupleSplits<T>["right"];

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends TupleSuffix<T>,
> = Suffix extends readonly []
  ? T
  : T extends readonly [...infer TRest, infer TLast]
    ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast]
      ? // SuffixLast extends TLast.
        RemoveSuffix<TRest, SuffixRest>
      : // Suffix (as a whole) extends ReadonlyArray<TLast>.
        // Suffix could possibly be empty, so this has to be TLast?.
        [...RemoveSuffix<TRest, Suffix>, TLast?]
    : // T has an optional or rest parameter last. If T is a parameter list,
      // this can only happen if we have optional arguments or a rest param;
      // both cases are similar.
      T extends readonly [...infer TRest, (infer _TLast)?]
      ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast]
        ? // SuffixLast extends TLast.
          RemoveSuffix<TRest, SuffixRest>
        : // Suffix (as a whole) extends [...TRest, TLast?].
          TRest
      : // We got passed a parameter list that isn't what we expected; this
        // is an internal error.
        PartialLastBindError<"Function parameter list has unexpected shape", T>;

/**
 * Creates a function that calls `func` with `partial` put after the arguments
 * it receives. Note that this doesn't support functions with both optional
 * and rest parameters.
 *
 * Can be thought of as "freezing" some portion of a function's arguments,
 * resulting in a new function with a simplified signature.
 *
 * Useful for converting a data-first function to a data-last one.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put after.
 * @returns A partially bound function.
 * @signature
 *    R.partialLastBind(func, ...partial);
 * @example
 *    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
 *    const partialFn = R.partialLastBind(fn, 2, 3);
 *    partialFn(1); //=> 123
 *
 *    const parseBinary = R.partialLastBind(parseInt, "2");
 *    parseBinary("101"); //=> 5
 *
 *    R.pipe(
 *      { a: 1 },
 *      // instead of (arg) => JSON.stringify(arg, null, 2)
 *      R.partialLastBind(JSON.stringify, null, 2),
 *    ); //=> '{\n  "a": 1\n}'
 * @dataFirst
 * @category Function
 * @see partialBind
 */
export function partialLastBind<
  F extends StrictFunction,
  SuffixArgs extends TupleSuffix<Parameters<F>>,
  RemovedSuffix extends RemoveSuffix<Parameters<F>, SuffixArgs>,
>(
  func: F,
  ...partial: SuffixArgs
): (
  ...rest: RemovedSuffix extends IterableContainer ? RemovedSuffix : never
) => ReturnType<F> {
  // @ts-expect-error [ts2322] -- TypeScript is over-eager with translating
  // the return type of `func` to `unknown` instead of keeping it as
  // `ReturnType<F>` which would be stricter and work here. This is similar
  // to this issue: https://github.com/microsoft/TypeScript/issues/61750
  return (...rest) => func(...rest, ...partial);
}
