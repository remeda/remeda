import { t as StrictFunction } from "./StrictFunction-BtcQmnG5.cjs";

//#region src/debounce.d.ts
type Debouncer<F extends StrictFunction, IsNullable extends boolean = true> = {
  /**
   * Invoke the debounced function.
   *
   * @param args - Same as the args for the debounced function.
   * @returns The last computed value of the debounced function with the
   * latest args provided to it. If `timing` does not include `leading` then the
   * the function would return `undefined` until the first cool-down period is
   * over, otherwise the function would always return the return type of the
   * debounced function.
   */
  readonly call: (...args: Parameters<F>) => ReturnType<F> | (true extends IsNullable ? undefined : never);
  /**
   * Cancels any debounced functions without calling them, effectively resetting
   * the debouncer to the same state it is when initially created.
   */
  readonly cancel: () => void;
  /**
   * Similar to `cancel`, but would also trigger the `trailing` invocation if
   * the debouncer would run one at the end of the cool-down period.
   */
  readonly flush: () => ReturnType<F> | undefined;
  /**
   * Is `true` when there is an active cool-down period currently debouncing
   * invocations.
   */
  readonly isPending: boolean;
  /**
   * The last computed value of the debounced function.
   */
  readonly cachedValue: ReturnType<F> | undefined;
};
type DebounceOptions = {
  readonly waitMs?: number;
  readonly maxWaitMs?: number;
};
/**
 * Wraps `func` with a debouncer object that "debounces" (delays) invocations of the function during a defined cool-down period (`waitMs`). It can be configured to invoke the function either at the start of the cool-down period, the end of it, or at both ends (`timing`).
 * It can also be configured to allow invocations during the cool-down period (`maxWaitMs`).
 * It stores the latest call's arguments so they could be used at the end of the cool-down period when invoking `func` (if configured to invoke the function at the end of the cool-down period).
 * It stores the value returned by `func` whenever its invoked. This value is returned on every call, and is accessible via the `cachedValue` property of the debouncer. Its important to note that the value might be different from the value that would be returned from running `func` with the current arguments as it is a cached value from a previous invocation.
 * **Important**: The cool-down period defines the minimum between two invocations, and not the maximum. The period will be **extended** each time a call is made until a full cool-down period has elapsed without any additional calls.
 *
 *! **DEPRECATED**: This implementation of debounce is known to have issues and might not behave as expected. It should be replaced with the `funnel` utility instead. The test file [funnel.remeda-debounce.test.ts](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.remeda-debounce.test.ts) offers a reference implementation that replicates `debounce` via `funnel`!
 *
 * @param func - The function to debounce, the returned `call` function will have
 * the exact same signature.
 * @param options - An object allowing further customization of the debouncer:
 * - `timing?: 'leading' | 'trailing' |'both'`. The default is `'trailing'`.
 *   `leading` would result in the function being invoked at the start of the
 *   cool-down period; `trailing` would result in the function being invoked at
 *   the end of the cool-down period (using the args from the last call to the
 *   debouncer). When `both` is selected the `trailing` invocation would only
 *   take place if there were more than one call to the debouncer during the
 *   cool-down period. **DEFAULT: 'trailing'**
 * - `waitMs?: number`. The length of the cool-down period in milliseconds. The
 *   debouncer would wait until this amount of time has passed without **any**
 *   additional calls to the debouncer before triggering the end-of-cool-down-
 *   period event. When this happens, the function would be invoked (if `timing`
 *   isn't `'leading'`) and the debouncer state would be reset. **DEFAULT: 0**
 * - `maxWaitMs?: number`. The length of time since a debounced call (a call
 *   that the debouncer prevented from being invoked) was made until it would be
 *   invoked. Because the debouncer can be continually triggered and thus never
 *   reach the end of the cool-down period, this allows the function to still
 *   be invoked occasionally. IMPORTANT: This param is ignored when `timing` is
 *   `'leading'`.
 * @returns A debouncer object. The main function is `call`. In addition to it
 * the debouncer comes with the following additional functions and properties:
 * - `cancel` method to cancel delayed `func` invocations
 * - `flush` method to end the cool-down period immediately.
 * - `cachedValue` the latest return value of an invocation (if one occurred).
 * - `isPending` flag to check if there is an inflight cool-down window.
 * @signature
 *   R.debounce(func, options);
 * @example
 *   const debouncer = debounce(identity(), { timing: 'trailing', waitMs: 1000 });
 *   const result1 = debouncer.call(1); // => undefined
 *   const result2 = debouncer.call(2); // => undefined
 *   // after 1 second
 *   const result3 = debouncer.call(3); // => 2
 *   // after 1 second
 *   debouncer.cachedValue; // => 3
 * @dataFirst
 * @category Function
 * @deprecated This implementation of debounce is known to have issues and might
 * not behave as expected. It should be replaced with the `funnel` utility
 * instead. The test file `funnel.remeda-debounce.test.ts` offers a reference
 * implementation that replicates `debounce` via `funnel`.
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/
 */
declare function debounce<F extends StrictFunction>(func: F, options: DebounceOptions & {
  readonly timing?: "trailing";
}): Debouncer<F>;
declare function debounce<F extends StrictFunction>(func: F, options: (DebounceOptions & {
  readonly timing: "both";
}) | (Omit<DebounceOptions, "maxWaitMs"> & {
  readonly timing: "leading";
})): Debouncer<F, false>;
//#endregion
export { debounce as t };
//# sourceMappingURL=debounce-Lrzz3eVE.d.cts.map