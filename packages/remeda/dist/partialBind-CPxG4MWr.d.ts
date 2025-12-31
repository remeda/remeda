import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as RemedaTypeError } from "./RemedaTypeError-D7wvGSrH.js";
import { t as StrictFunction } from "./StrictFunction-COi1SatR.js";
import { t as TupleSplits } from "./TupleSplits-BQfCJsGh.js";

//#region src/partialBind.d.ts
type PartialBindError<Message extends string, Metadata = never> = RemedaTypeError<"partialBind", Message, {
  metadata: Metadata;
}>;
type TuplePrefix<T extends IterableContainer> = TupleSplits<T>["left"];
type RemovePrefix<T extends IterableContainer, Prefix extends TuplePrefix<T>> = Prefix extends readonly [] ? T : T extends readonly [infer THead, ...infer TRest] ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest] ? RemovePrefix<TRest, PrefixRest> : [THead?, ...RemovePrefix<TRest, Prefix>] : T extends readonly [(infer _THead)?, ...infer TRest] ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest] ? RemovePrefix<TRest, PrefixRest> : TRest : PartialBindError<"Function parameter list has unexpected shape", T>;
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
declare function partialBind<F extends StrictFunction, PrefixArgs extends TuplePrefix<Parameters<F>>, RemovedPrefix extends RemovePrefix<Parameters<F>, PrefixArgs>>(func: F, ...partial: PrefixArgs): (...rest: RemovedPrefix extends IterableContainer ? RemovedPrefix : never) => ReturnType<F>;
//#endregion
export { partialBind as t };
//# sourceMappingURL=partialBind-CPxG4MWr.d.ts.map