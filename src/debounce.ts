// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript requires args lists to be of type `any` to capture all possible functions; `unknown` is not enough. This type behaves differently than the built-in `Function` type (see `Parameters`, `ReturnType` etc...).
type AnyFunction = (...args: any) => any;

type DebounceOptions = {
  readonly coolDownMs?: number;
  readonly minGapMs?: number;
} & (
  | {
      readonly timing: "leading";
      // Leading timings don't have a maxWaitMs because nothing is kept
      // waiting...
      readonly maxDelayMs?: never;
    }
  | {
      readonly timing?: "both" | "trailing";
      readonly maxDelayMs?: number;
    }
);

type Debouncer<F extends AnyFunction> = {
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
  readonly call: (...args: Parameters<F>) => void;

  /**
   * Cancels any debounced functions without calling them, effectively resetting
   * the debouncer to the same state it is when initially created.
   */
  readonly cancel: () => void;

  /**
   * Similar to `cancel`, but would also trigger the `trailing` invocation if
   * the debouncer would run one at the end of the cool-down period.
   */
  readonly flush: () => void;

  /**
   * Is `true` when there is an active cool-down period currently debouncing
   * invocations.
   */
  readonly isIdle: boolean;
};

/**
 * Wraps `func` with a debouncer object that "debounces" (delays) invocations of
 * the function during a defined cool-down period (`waitMs`). It can be
 * configured to invoke the function either at the start of the cool-down
 * period, the end of it, or at both ends (`timing`).
 * It can also be configured to allow invocations during the cool-down period
 * (`maxWaitMs`).
 * It stores the latest call's arguments so they could be used at the end of the
 * cool-down period when invoking `func` (if configured to invoke the function
 * at the end of the cool-down period).
 * It stores the value returned by `func` whenever its invoked. This value is
 * returned on every call, and is accessible via the `cachedValue` property of
 * the debouncer. Its important to note that the value might be different from
 * the value that would be returned from running `func` with the current
 * arguments as it is a cached value from a previous invocation.
 * **Important**: The cool-down period defines the minimum between two
 * invocations, and not the maximum. The period will be **extended** each time a
 * call is made until a full cool-down period has elapsed without any additional
 * calls.
 *
 * _This implementation is based on the Lodash implementation and on this
 * [CSS Tricks article](https://css-tricks.com/debouncing-throttling-explained-examples/)._.
 *
 * @param func - The function to debounce, the returned `call` function will
 * have the exact same signature.
 * @param options - An object allowing further customization of the debouncer.
 * @param options.timing -
 * - `leading` - The function is invoked at the start of the cool-down period.
 * - `trailing` - The function is invoked at the end of the cool-down period
 * (using the args from the last call to the debouncer).
 * - `both` - When this is selected the `trailing` invocation would only take
 * place if there was more than one call to the debouncer during the cool-down
 * period. @default 'trailing'.
 * @param options.coolDownMs - The length of the cool-down period in
 * milliseconds. The debouncer would wait until this amount of time has passed
 * without **any** additional calls to the debouncer before triggering the end-
 * of-cool-down-period event. When this happens, the function would be invoked
 * (if `timing` isn't `'leading'`) and the debouncer state would be
 * reset. @default 0.
 * @param options.maxDelayMs - The length of time since a debounced call (a call
 * that the debouncer prevented from being invoked) was made until it would be
 * invoked. Because the debouncer can be continually triggered and thus never
 * reach the end of the cool-down period, this allows the function to still be
 * invoked occasionally. IMPORTANT: This param is ignored when `timing` is
 * `'leading'`.
 * @param options.minGapMs - TODO...
 * @returns A debouncer object. The main function is `call`. In addition to it
 * the debouncer comes with the following additional functions and properties:
 * - `cancel` method to cancel delayed `func` invocations
 * - `flush` method to end the cool-down period immediately.
 * - `cachedValue` the latest return value of an invocation (if one occurred).
 * - `isPending` flag to check if there is an inflight cool-down window.
 * @signature
 *   R.debounce(func, options);
 * @example
 *   const debouncer = debounce(
 *     identity(),
 *     { timing: 'trailing', waitMs: 1000 },
 *   );
 *   const result1 = debouncer.call(1); // => undefined
 *   const result2 = debouncer.call(2); // => undefined
 *   // after 1 second
 *   const result3 = debouncer.call(3); // => 2
 *   // after 1 second
 *   debouncer.cachedValue; // => 3
 * @dataFirst
 * @category Function
 */
export function debounce<F extends AnyFunction>(
  func: F,
  { timing = "trailing", coolDownMs, maxDelayMs, minGapMs }: DebounceOptions,
): Debouncer<F> {
  // All these are part of the debouncer runtime state:

  // The timeout is the main object we use to tell if there's an active cool-
  // down period or not.
  let coolDownTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let coolDownStartTimestamp: number | undefined;

  let gapTimeoutId: ReturnType<typeof setTimeout> | undefined;

  // For 'trailing' invocations we need to keep the args around until we
  // actually invoke the function.
  let latestCallArgs: Parameters<F> | undefined;

  const invoke = (): void => {
    const args = latestCallArgs;
    if (args === undefined) {
      // There are no debounced calls to invoke.
      return;
    }
    // Make sure the args aren't accidentally used again
    latestCallArgs = undefined;

    // Invoke the function and store the results locally.
    func(...args);

    // The gap starts when we invoke, and should run to completion without being
    // reset.
    if (minGapMs !== undefined) {
      gapTimeoutId = setTimeout(handleGapEnd, minGapMs);
    }
  };

  const handleGapEnd = (): void => {
    // Reset the gap period state so it could be started again.
    clearTimeout(gapTimeoutId);
    gapTimeoutId = undefined;

    if (coolDownTimeoutId !== undefined) {
      // As long as one of the moratoriums is active we don't invoke the
      // function. Each moratorium end event handlers has a call to invoke, so
      // we are guaranteed to invoke the function eventually.
      return;
    }

    // If we have a debounced call waiting to be invoked at the end of the
    // gap period we need to invoke it now.
    invoke();
  };

  const handleCoolDownEnd = (): void => {
    // Reset the cool-down period state so it could be started again.
    clearTimeout(coolDownTimeoutId);
    coolDownTimeoutId = undefined;
    coolDownStartTimestamp = undefined;

    if (gapTimeoutId !== undefined) {
      // As long as one of the moratoriums is active we don't invoke the
      // function. Each moratorium end event handlers has a call to invoke, so
      // we are guaranteed to invoke the function eventually.
      return;
    }

    // If we have a debounced call waiting to be invoked at the end of the
    // cool-down period we need to invoke it now.
    invoke();
  };

  const handleStart = (): void => {
    if (timing === "trailing") {
      return;
    }

    invoke();
  };

  const handleDebounce = (args: Parameters<F>): void => {
    if (
      timing === "leading" &&
      (coolDownTimeoutId !== undefined || gapTimeoutId !== undefined)
    ) {
      return;
    }

    // We save the latest call args so that (if and) when we invoke the function
    // in the future, we have args to invoke it with.
    latestCallArgs = args;
  };

  return {
    call: (...args) => {
      handleDebounce(args);

      if (coolDownTimeoutId === undefined && gapTimeoutId === undefined) {
        // For the timings that require us to fire an event at the start o
        setTimeout(handleStart, 0 /* immediate */);
      }

      if (coolDownMs === undefined) {
        // We don't use the cool-down mechanism.
        return;
      }

      if (coolDownTimeoutId === undefined && gapTimeoutId !== undefined) {
        // We are not in an active cool-down window but in a gap window. We
        // don't start a new cool-down window until we invoke the function
        // again.
        return;
      }

      // The timeout tracking the cool-down period needs to be reset every
      // time another call is made, so that it waits the full cool-down period
      // before releasing the debounced call.
      clearTimeout(coolDownTimeoutId);

      coolDownStartTimestamp ??= Date.now();

      const delayMs =
        maxDelayMs === undefined
          ? coolDownMs
          : Math.min(
              coolDownMs,
              // We need to account for the time already spent so that we
              // don't wait longer than the maxDelay.
              maxDelayMs - (Date.now() - coolDownStartTimestamp),
            );

      coolDownTimeoutId = setTimeout(handleCoolDownEnd, delayMs);
    },

    cancel: () => {
      // Reset all "in-flight" state of the debouncer. Notice that we keep the
      // cached value!

      clearTimeout(coolDownTimeoutId);
      coolDownTimeoutId = undefined;
      coolDownStartTimestamp = undefined;

      clearTimeout(gapTimeoutId);
      gapTimeoutId = undefined;

      latestCallArgs = undefined;
    },

    flush: () => {
      handleCoolDownEnd();
      handleGapEnd();
    },

    get isIdle() {
      return coolDownTimeoutId === undefined && gapTimeoutId === undefined;
    },
  };
}
