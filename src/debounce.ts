/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */

type Debouncer<
  F extends (...args: any) => unknown,
  IsNullable extends boolean = true,
> = {
  /**
   * Invoke the debounced function.
   * @param args - same as the args for the debounced function.
   * @returns - the last computed value of the debounced function with the
   * latest args provided to it. If `timing` does not include `leading` then the
   * the function would return `undefined` until the first cool-down period is
   * over, otherwise the function would always return the return type of the
   * debounced function.
   */
  readonly call: (
    ...args: Parameters<F>
  ) => ReturnType<F> | (true extends IsNullable ? undefined : never);

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
 * @param func The function to debounce, the returned `call` function will have
 * the exact same signature.
 * @param options An object allowing further customization of the debouncer:
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
 * @returns a debouncer object. The main function is `call`. In addition to it
 * the debouncer comes with the following additional functions and properties:
 * - `cancel` method to cancel delayed `func` invocations
 * - `flush` method to end the cool-down period immediately.
 * - `cachedValue` the latest return value of an invocation (if one occurred).
 * - `isPending` flag to check if there is an inflight cool-down window.
 * @signature
 *   R.debounce(func, options);
 * @example
 *   const debouncer = debounce(identity, { timing: 'trailing', waitMs: 1000 });
 *   const result1 = debouncer.call(1); // => undefined
 *   const result2 = debouncer.call(2); // => undefined
 *   // after 1 second
 *   const result3 = debouncer.call(3); // => 2
 *   // after 1 second
 *   debouncer.cachedValue; // => 3
 * @dataFirst
 * @category Function
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/
 */
export function debounce<F extends (...args: any) => any>(
  func: F,
  options: DebounceOptions & { readonly timing?: "trailing" },
): Debouncer<F>;
export function debounce<F extends (...args: any) => any>(
  func: F,
  options:
    | (DebounceOptions & { readonly timing: "both" })
    | (Omit<DebounceOptions, "maxWaitMs"> & { readonly timing: "leading" }),
): Debouncer<F, false /* call CAN'T return null */>;

export function debounce<F extends (...args: any) => any>(
  func: F,
  {
    waitMs,
    timing = "trailing",
    maxWaitMs,
  }: DebounceOptions & {
    readonly timing?: "both" | "leading" | "trailing";
  },
): Debouncer<F> {
  if (maxWaitMs !== undefined && waitMs !== undefined && maxWaitMs < waitMs) {
    throw new Error(
      `debounce: maxWaitMs (${maxWaitMs}) cannot be less than waitMs (${waitMs})`,
    );
  }

  // All these are part of the debouncer runtime state:

  // The timeout is the main object we use to tell if there's an active cool-
  // down period or not.
  let coolDownTimeoutId: number | undefined;

  // We use an additional timeout to track how long the last debounced call is
  // waiting.
  let maxWaitTimeoutId: number | undefined;

  // For 'trailing' invocations we need to keep the args around until we
  // actually invoke the function.
  let latestCallArgs: Parameters<F> | undefined;

  // To make any value of the debounced function we need to be able to return a
  // value. For any invocation except the first one when 'leading' is enabled we
  // will return this cached value.
  let result: ReturnType<F> | undefined;

  const handleInvoke = (): void => {
    if (latestCallArgs === undefined) {
      // This should never happen! It means we forgot to clear a timeout!
      return;
    }

    if (maxWaitTimeoutId !== undefined) {
      // We are invoking the function so the wait is over...
      const timeoutId = maxWaitTimeoutId;
      maxWaitTimeoutId = undefined;
      clearTimeout(timeoutId);
    }

    const args = latestCallArgs;
    // Make sure the args aren't accidentally used again, this is mainly
    // relevant for the check above where we'll fail a subsequent call to
    // 'trailingEdge'.
    latestCallArgs = undefined;

    // Invoke the function and store the results locally.
    result = func(...args);
  };

  const handleCoolDownEnd = (): void => {
    if (coolDownTimeoutId === undefined) {
      // It's rare to get here, it should only happen when `flush` is called
      // when the cool-down window isn't active.
      return;
    }

    // Make sure there are no more timers running.
    const timeoutId = coolDownTimeoutId;
    coolDownTimeoutId = undefined;
    clearTimeout(timeoutId);
    // Then reset state so a new cool-down window can begin on the next call.

    if (latestCallArgs !== undefined) {
      // If we have a debounced call waiting to be invoked at the end of the
      // cool-down period we need to invoke it now.
      handleInvoke();
    }
  };

  const handleDebouncedCall = (args: Parameters<F>): void => {
    // We save the latest call args so that (if and) when we invoke the function
    // in the future, we have args to invoke it with.
    latestCallArgs = args;

    if (maxWaitMs !== undefined && maxWaitTimeoutId === undefined) {
      // We only need to start the maxWait timeout once, on the first debounced
      // call that is now being delayed.
      maxWaitTimeoutId = setTimeout(handleInvoke, maxWaitMs);
    }
  };

  return {
    call: (...args) => {
      if (coolDownTimeoutId === undefined) {
        // This call is starting a new cool-down window!

        if (timing === "trailing") {
          // Only when the timing is "trailing" is the first call "debounced".
          handleDebouncedCall(args);
        } else {
          // Otherwise for "leading" and "both" the first call is actually
          // called directly and not via a timeout.
          result = func(...args);
        }
      } else {
        // There's an inflight cool-down window.

        if (timing !== "leading") {
          // When the timing is 'leading' all following calls are just ignored
          // until the cool-down period ends. But for the other timings the call
          // is "debounced".
          handleDebouncedCall(args);
        }

        // The current timeout is no longer relevant because we need to wait the
        // full `waitMs` time from this call.
        const timeoutId = coolDownTimeoutId;
        coolDownTimeoutId = undefined;
        clearTimeout(timeoutId);
      }

      coolDownTimeoutId = setTimeout(
        handleCoolDownEnd,
        // If waitMs is not defined but maxWaitMs *is* it means the user is only
        // interested in the leaky-bucket nature of the debouncer which is
        // achieved by setting waitMs === maxWaitMs. If both are not defined we
        // default to 0 which would wait until the end of the execution frame.
        waitMs ?? maxWaitMs ?? 0,
      );

      // Return the last computed result while we "debounce" further calls.
      return result;
    },

    cancel: () => {
      // Reset all "in-flight" state of the debouncer. Notice that we keep the
      // cached value!

      if (coolDownTimeoutId !== undefined) {
        const timeoutId = coolDownTimeoutId;
        coolDownTimeoutId = undefined;
        clearTimeout(timeoutId);
      }

      if (maxWaitTimeoutId !== undefined) {
        const timeoutId = maxWaitTimeoutId;
        maxWaitTimeoutId = undefined;
        clearTimeout(timeoutId);
      }

      latestCallArgs = undefined;
    },

    flush: () => {
      // Flush is just a manual way to trigger the end of the cool-down window.
      handleCoolDownEnd();
      return result;
    },

    get isPending() {
      return coolDownTimeoutId !== undefined;
    },

    get cachedValue() {
      return result;
    },
  };
}
