/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */

import type { ConditionalExcept } from "type-fest";
import type { RemedaTypeError } from "./internal/types";

type PartialBindObjError<Message extends string> = RemedaTypeError<
  "partialBindObj",
  Message
>;

type RemoveProps<T, Props> = {
  [K in keyof T | keyof Props]: K extends keyof T
    ? K extends keyof Props
      ? Props[K] extends T[K]
        ? never
        : PartialBindObjError<"Property has wrong type">
      : T[K]
    : PartialBindObjError<"Key not in original object">;
};

type PartiallyBound<F extends (arg: any) => any, Obj> = (
  arg: ConditionalExcept<RemoveProps<Parameters<F>[0], Obj>, never>,
) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` merged with the arguments
 * it receives.
 *
 * @param data - The arguments to put before.
 * @param func - The function to wrap.
 * @returns A partially bound function.
 * @signature
 *    R.partialBindObj(data, func)
 * @example
 *    const fn = ({ x, y, z }) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialBindObj({ x: 1, z: 3 }, fn)
 *    partialFn({ y: 2 }) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialBind, partialRightBind
 */
export function partialBindObj<T, F extends (arg: any) => any>(
  data: T,
  func: F,
): PartiallyBound<F, T> {
  return (rest) => func({ ...data, ...rest });
}
