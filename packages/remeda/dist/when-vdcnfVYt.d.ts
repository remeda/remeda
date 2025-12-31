import { t as GuardType } from "./GuardType-D21uLyKt.js";

//#region src/when.d.ts

/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - Function to run when the predicate returns `true`.
 * @signature
 *   when(predicate, onTrue)(data, ...extraArgs)
 *   when(predicate, { onTrue, onFalse })(data, ...extraArgs)
 * @example
 *   pipe(data, when(isNullish, constant(42)));
 *   pipe(data, when((x) => x > 3, { onTrue: add(1), onFalse: multiply(2) }));
 *   map(data, when(isNullish, (x, index) => x + index));
 * @dataLast
 * @category Function
 */
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown>(predicate: Predicate, onTrue: OnTrue): (data: T, ...extraArgs: ExtraArgs) => Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown, OnFalse extends (data: Exclude<T, GuardType<Predicate>>, ...extraArgs: ExtraArgs) => unknown>(predicate: Predicate, branches: {
  readonly onTrue: OnTrue;
  readonly onFalse: OnFalse;
}): (data: T, ...extraArgs: ExtraArgs) => ReturnType<OnFalse> | ReturnType<OnTrue>;
/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param data - The data to be passed to all functions, as the first param.
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - The function that would run when the predicate returns
 * `true`.
 * @param extraArgs - Additional arguments. These would be passed as is to the
 * `predicate`, `onTrue`, and `onFalse` functions.
 * @signature
 *   when(data, predicate, onTrue, ...extraArgs)
 *   when(data, predicate, { onTrue, onFalse }, ...extraArgs)
 * @example
 *   when(data, isNullish, constant(42));
 *   when(data, (x) => x > 3, { onTrue: add(1), onFalse: multiply(2) });
 *   when(data, isString, (x, radix) => parseInt(x, radix), 10);
 * @dataFirst
 * @category Function
 */
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown>(data: T, predicate: Predicate, onTrue: OnTrue, ...extraArgs: ExtraArgs): Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown, OnFalse extends (data: Exclude<T, GuardType<Predicate>>, ...extraArgs: ExtraArgs) => unknown>(data: T, predicate: Predicate, branches: {
  readonly onTrue: OnTrue;
  readonly onFalse: OnFalse;
}, ...extraArgs: ExtraArgs): ReturnType<OnFalse> | ReturnType<OnTrue>;
//#endregion
export { when as t };
//# sourceMappingURL=when-vdcnfVYt.d.ts.map