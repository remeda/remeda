import type { IterableContainer } from "./internal/types/IterableContainer";
import type { RemedaTypeError } from "./internal/types/RemedaTypeError";
import type { StrictFunction } from "./internal/types/StrictFunction";
import type { TupleSplits } from "./internal/types/TupleSplits";

type PartialBindError<
  Message extends string,
  Metadata = never,
> = RemedaTypeError<"partialBind", Message, { metadata: Metadata }>;

type TuplePrefix<T extends IterableContainer> = TupleSplits<T>["left"];

type RemovePrefix<
  T extends IterableContainer,
  Prefix extends TuplePrefix<T>,
> = Prefix extends readonly []
  ? T
  : T extends readonly [infer THead, ...infer TRest]
    ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest]
      ? // PrefixHead extends THead.
        RemovePrefix<TRest, PrefixRest>
      : // Prefix (as a whole) extends ReadonlyArray<THead>.
        // Prefix could possibly be empty, so this has to be THead?.
        [THead?, ...RemovePrefix<TRest, Prefix>]
    : // T has an optional or rest parameter last. If T is a parameter list,
      // this can only happen if we have optional arguments or a rest param;
      // both cases are similar.
      T extends readonly [(infer _THead)?, ...infer TRest]
      ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest]
        ? // PrefixHead extends THead.
          RemovePrefix<TRest, PrefixRest>
        : // Prefix (as a whole) extends [THead?, ...TRest].
          TRest
      : // We got passed a parameter list that isn't what we expected; this is
        // an internal error.
        PartialBindError<"Function parameter list has unexpected shape", T>;

/**
 * Creates a function that calls `func` with `partial` put before the arguments
 * it receives.
 *
 * Can be thought of as "freezing" some portion of a function's arguments,
 * resulting in a new function with a simplified signature.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put before.
 * @returns A partially bound function.
 * @signature
 *    R.partialBind(func, ...partial);
 * @example
 *    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
 *    const partialFn = R.partialBind(fn, 1, 2);
 *    partialFn(3); //=> 123
 *
 *    const logWithPrefix = R.partialBind(console.log, "[prefix]");
 *    logWithPrefix("hello"); //=> "[prefix] hello"
 * @dataFirst
 * @category Function
 * @see partialLastBind
 */
export function partialBind<
  F extends StrictFunction,
  PrefixArgs extends TuplePrefix<Parameters<F>>,
  RemovedPrefix extends RemovePrefix<Parameters<F>, PrefixArgs>,
>(
  func: F,
  ...partial: PrefixArgs
): (
  ...rest: RemovedPrefix extends IterableContainer ? RemovedPrefix : never
) => ReturnType<F> {
  // @ts-expect-error [ts2345, ts2322] -- TypeScript infers the generic sub-
  // types too eagerly, making itself blind to the fact that the types match
  // here.
  return (...rest) => func(...partial, ...rest);
}
