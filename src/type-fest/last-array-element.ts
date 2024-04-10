/* eslint-disable @typescript-eslint/no-unused-vars */
// Returns the last element of an array or tuple
// Returns `undefined` for empty const tuples
// Does not add `| undefined` for non-empty const tuples
export type LastArrayElement<
  Elements extends ReadonlyArray<unknown>,
  ElementBeforeTailingSpreadElement = undefined,
> =
  // If the last element of an array is a spread element, the `LastArrayElement` result should be `'the type of the element before the spread element' | 'the type of the spread element'`.
  Elements extends readonly []
    ? ElementBeforeTailingSpreadElement
    : Elements extends readonly [...infer _U, infer V]
      ? V
      : Elements extends readonly [infer U, ...infer V]
        ? // If we return `V[number] | U` directly, it would be wrong for `[[string, boolean, object, ...number[]]`.
          // So we need to recurse type `V` and carry over the type of the element before the spread element.
          LastArrayElement<V, U>
        : Elements extends ReadonlyArray<infer U>
          ? ElementBeforeTailingSpreadElement | U
          : never;
