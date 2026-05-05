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
 * The rule misreads test intent: removing the assertion lets `T` infer from
 * the value's narrow type instead of the wider type the test wants to
 * exercise. It's also right, though, that the assertion is redundant — the
 * runtime object it casts is never used.
 *
 * `$typed` replaces both at once:
 *
 *     constant(3 as number)        →  constant($typed<number>())
 *     constant({} as Record<...>)  →  constant($typed<Record<...>>())
 *
 * ## When not to use
 *
 * - `interface` types: The rule fires on `value as SomeInterface` as a false
 * positive: the cast *is* doing real work, because TypeScript does not treat
 * an interface as extending `Record<PropertyKey, unknown>`, so an interface is
 * not equivalent to the type inferred from a value literal. Leave the cast in
 * place and add an `eslint-disable-next-line` with the suspected bug noted in
 * the reason.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T is supplied explicitly by the caller and surfaced as the return type; making T appear elsewhere would defeat the helper's purpose.
export declare function $typed<T = never>(): T;
