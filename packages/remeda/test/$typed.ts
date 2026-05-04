/**
 * A utility for type tests (and only type tests!) that allows us to feed a
 * specific type into a type parameter without relying on inference or needing
 * to explicitly annotate **all** type parameters of the function.
 *
 * The `$` prefix is used to signal this is an internal test-only tool and not
 * part of the library!
 *
 * @example
 *   // Bad (will cause eslint to surface '@typescript-eslint/no-unnecessary-type-assertion')
 *   constant(3 as number));
 *
 *   // Good
 *   constant($typed<number>());
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- Intentional, this is how we do it...
export declare function $typed<T>(): T;
