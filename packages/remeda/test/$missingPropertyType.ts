/**
 * Under `exactOptionalPropertyTypes`, reading an optional property (e.g., via
 * property access, destructuring, or a generic `T[K]`) yields TypeScript's
 * internal `missing` type instead of the regular `undefined`. Both print as
 * `undefined`, so hovers and error messages show this helper's result as
 * `(string | undefined)[]`, but the compiler doesn't always treat them the same
 * (e.g., when inferring an optional tuple element from an array's items).
 *
 * The `missing` type has no syntax of its own: spelling out the type it
 * displays yields a regular `undefined`.
 *
 *! IMPORTANT: **Never replace a call to this helper with the type it displays**
 * (e.g., `[] as (string | undefined)[]`): the test would still compile and pass
 * while no longer exercising the "missing" type at all. For the same reason
 * this function has no explicit return type.
 *
 * @see https://github.com/microsoft/TypeScript/pull/43947
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- Intentional! we need the inferred return type here so that TypeScript uses the `missing` type internally instead of an explicit `undefined`.
export const $missingPropertyType = () =>
  ([] as { optionalProp?: string }[]).map(({ optionalProp }) => optionalProp);
