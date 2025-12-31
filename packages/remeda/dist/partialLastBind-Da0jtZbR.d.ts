import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as RemedaTypeError } from "./RemedaTypeError-D7wvGSrH.js";
import { t as StrictFunction } from "./StrictFunction-COi1SatR.js";
import { t as TupleSplits } from "./TupleSplits-BQfCJsGh.js";

//#region src/partialLastBind.d.ts
type PartialLastBindError<Message extends string, Metadata = never> = RemedaTypeError<"partialLastBind", Message, {
  metadata: Metadata;
}>;
type TupleSuffix<T extends IterableContainer> = TupleSplits<T>["right"];
type RemoveSuffix<T extends IterableContainer, Suffix extends TupleSuffix<T>> = Suffix extends readonly [] ? T : T extends readonly [...infer TRest, infer TLast] ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast] ? RemoveSuffix<TRest, SuffixRest> : [...RemoveSuffix<TRest, Suffix>, TLast?] : T extends readonly [...infer TRest, (infer _TLast)?] ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast] ? RemoveSuffix<TRest, SuffixRest> : TRest : PartialLastBindError<"Function parameter list has unexpected shape", T>;
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
declare function partialLastBind<F extends StrictFunction, SuffixArgs extends TupleSuffix<Parameters<F>>, RemovedSuffix extends RemoveSuffix<Parameters<F>, SuffixArgs>>(func: F, ...partial: SuffixArgs): (...rest: RemovedSuffix extends IterableContainer ? RemovedSuffix : never) => ReturnType<F>;
//#endregion
export { partialLastBind as t };
//# sourceMappingURL=partialLastBind-Da0jtZbR.d.ts.map