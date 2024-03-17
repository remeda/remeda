/**
 * A function that returns always `undefined`.
 *
 * ! **DEPRECATED**: Use `R.constant(undefined)`, or `R.doNothing()` if the function doesn't need to return a value. Will be removed in V2!
 *
 * @signature
 *    R.noop()
 * @example
 *    onSomething(R.noop)
 * @category Function
 * @deprecated Use `R.constant(undefined)`, or `R.doNothing()` if the function doesn't need to return a value. Will be removed in V2!
 */
export const noop = (): undefined => undefined;
