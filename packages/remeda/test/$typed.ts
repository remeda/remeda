/**
 * Returns a value whose declared type is exactly `T`. Use in type tests
 * (`*.test-d.ts`) to feed a specific type into a generic parameter.
 *
 * ## When to use
 *
 * Type tests often need to feed a specific type into a generic parameter to
 * exercise an inference path. The natural way is a widening assertion:
 *
 *     constant(3 as number)        // T inferred as number
 *     constant({} as Record<...>)  // T inferred as Record<...>
 *
 * `@typescript-eslint/no-unnecessary-type-assertion` flags these with one of
 * two messages:
 *
 * - "This assertion is unnecessary since the receiver accepts the original type of the expression."
 * - "This assertion is unnecessary since it does not change the type of the expression."
 *
 * The rule is wrong about test intent — removing the assertion collapses `T` to
 * the literal type and changes what's being tested — but it's also right that
 * this assertion is redundant because it deals with a runtime object that we
 * don't actually use.
 *
 * `$typed` replaces both at once:
 *
 *     constant(3 as number)        →  constant($typed<number>())
 *     constant({} as Record<...>)  →  constant($typed<Record<...>>())
 *
 * ## When not to use
 *
 * `interface`s are surfaced as false positives because they *look* like they
 * are equivalent to their `type` version, but they aren't exactly, because they
 * don't extends `Record<PropertyKey, unknown>`. When testing interfaces prefer
 * suppressing the eslint rule and avoid using this helper!
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- Intentional, this is how we do it...
export declare function $typed<T>(): T;
