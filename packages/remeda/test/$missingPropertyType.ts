/**
 * Under `exactOptionalPropertyTypes`, reading an optional property yields
 * TypeScript's internal `missing` type instead of the regular `undefined`.
 * To the end-user they both print as `undefined`, so hovers and error messages
 * show the result as `(T | undefined)[]`, but the compiler treats them
 * differently in some type relations (e.g., matching against tuples with
 * optional elements).
 *
 * The `missing` type can't be written in a type annotation, it only survives
 * inference.
 *
 *! IMPORTANT: **Never replace a call to this helper with the type it displays**
 * (e.g., `[] as (number | undefined)[]`): the test would still compile and pass
 * while no longer exercising the "missing" type at all. For the same reason
 * this function has no explicit return type.
 *
 * @see https://github.com/microsoft/TypeScript/pull/43947
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- Intentional! we need the inferred return type here so that TypeScript uses the `missing` type internally instead of an explicit `undefined`.
export const $missingPropertyType = () =>
  ([] as { optionalProp?: string }[]).map(({ optionalProp }) => optionalProp);
