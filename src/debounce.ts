type Debouncer<F extends (...args: any) => unknown> = {
  /**
   * Invoke the debounced function.
   * @param args - same as the args for the debounced function.
   * @returns - the last computed value of the debounced function with the
   * latest args provided to it. If `timing` does not include `leading` then the
   * the function would return `undefined` until the first cool-down period is
   * over, otherwise the function would always return the return type of the
   * debounced function.
   */
  readonly call: (...args: Parameters<F>) => ReturnType<F> | undefined;

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
  readonly timing?: 'leading' | 'trailing' | 'both';
};

const DEFAULT_TIMING: NonNullable<DebounceOptions['timing']> = 'trailing';

/**
 * Creates a debouncer object with a `call` function that delays invoking `func`
 * until after the cool-down period has elapsed since the last time the
 * debounced function was invoked.
 * Important: The cool-down period defines the minimum between two invocations,
 * and not the maximum. The period is extended while more calls are made until
 * a full cool-down period has elapsed without any additional calls.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 * @param func The function to debounce, the returned `call` function will have
 * the exact same signature.
 * @param waitMs The length in milliseconds of the cool-down period.
 * @param options An object allowing further customization of the debouncer. It
 * has a single optional property `timing` which can be either `'leading'`,
 * `'trailing'` or `'both'`. The default is `'trailing'`. `leading` would result
 * in the function being invoked at the start of the cool-down period;
 * `trailing` would result in the function being invoked at the end of the cool-
 * down period (using the args from the last call to the debouncer). When `both`
 * is selected the `trailing` invocation would only take place if there were
 * more than one call to the debouncer during the cool-down period.
 * @returns a debouncer object. The main function is `call`. In addition to it
 * the debouncer comes with the following additional functions and properties:
 * - `cancel` method to cancel delayed `func` invocations
 * - `flush` method to invoke them immediately
 * - `cachedValue` readonly property that returns the latest return value of an
 * invocation (if one occured).
 * - `isPending` flag to check if there are currently functions being debounced.
 * @signature
 *   R.debounce(func, waitMs, options);
 * @example
 *   const sum = (a: number, b: number) => a + b;
 *   const oneSumPerSecond = debounce(foo, 1000, { timing: 'trailing' });
 *   const debouncedSum = sumPerSecond.call(1, 2); // => undefined
 *   const debouncedSum2 = sumPerSecond.call(3, 4); // => undefined
 *   // after 1 second
 *   const debouncedSum3 = sumPerSecond.call(5, 6); // => 7
 *   // after 1 second
 *   sumPerSecond.cachedValue; // => 11
 * @dataFirst
 * @category Function
 */
export function debounce<F extends (...args: any) => any>(
  func: F,
  waitMs: number = 0,
  { timing = DEFAULT_TIMING }: DebounceOptions = {}
): Debouncer<F> {
  // All these are part of the debouncer runtime state:

  // The timeout is the main object we use to tell if there's an active cool-
  // down period or not.
  let timeoutId: NodeJS.Timeout | undefined;

  // JS doesn't provide a way to ask a timeout how much time is left so we need
  // to maintain this state ourselves. We use this to extend the timeout until
  // we reach the actual cool-down period end.
  let lastCallTimeMs: number | undefined;

  // For 'trailing' invocations we need to keep the args around until we
  // actually invoke the function.
  let invocationArgs: Parameters<F> | undefined;

  // To make any value of the debounced function we need to be able to return a
  // value. For any invocation except the first one when 'leading' is enabled we
  // will return this cached value.
  let result: ReturnType<F> | undefined;

  const handleCoolDownPeriodEnd = () => {
    if (timeoutId === undefined) {
      // If there's no active timeout it means there's no pending invocations.
      return;
    }

    // We are starting an invocation event, we first make sure there are no
    // future timers that would run.
    clearTimeout(timeoutId);
    timeoutId = undefined;

    if (timing === 'leading') {
      // When our invocation timing is 'leading' we don't invoke the function
      // again at the end of our cool-down period.
      return;
    }

    if (invocationArgs === undefined) {
      // We already called the function at the start of the cool-down, and since
      // then we haven't received any new calls that got debounced, so there's
      // nothing to do here.
      return;
    }

    // Call the function and store the results locally.
    result = func(...invocationArgs);

    // Make sure the args aren't accidentally used again, this is mainly
    // relevant for the check above where we'll fail a subsequent call to
    // 'trailingEdge'.
    invocationArgs = undefined;
  };

  const handleTimeout = () => {
    if (lastCallTimeMs === undefined) {
      throw new Error(
        'Something went wrong! we have a live timer without any calls to the debounced function'
      );
    }

    const remainingWaitMs = waitMs - (Date.now() - lastCallTimeMs);

    if (remainingWaitMs > 0) {
      // There were additional calls during the cool-down period so we need to
      // extend the timer further until we know that no calls have occurred
      // during the cool-down period.
      timeoutId = setTimeout(handleTimeout, remainingWaitMs);
    } else {
      // We can now call the actual invocation logic.
      handleCoolDownPeriodEnd();
    }
  };

  return {
    call: (...args) => {
      lastCallTimeMs = Date.now();

      if (timeoutId === undefined) {
        // This call is starting a new cool-down window!

        if (timing === 'trailing') {
          // If we aren't invoking the function at the start of the cool-down
          // period we need to store the args for later.
          invocationArgs = args;
        } else {
          // We invoke the function directly at the start of the cool-down
          // period.
          result = func(...args);
        }

        timeoutId = setTimeout(handleTimeout, waitMs);
      } else if (timing !== 'leading') {
        // This call is being debounced and would need to be called at the end
        // of the cool-down period so it's args need to be stored. Because we
        // might have several calls during the cool-down period we only store
        // the last call's args.
        invocationArgs = args;
      }

      // Return the last computed result while we "debounce" further calls.
      return result;
    },

    cancel: () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      if (timing === 'trailing') {
        invocationArgs = undefined;
      }

      lastCallTimeMs = undefined;
    },

    flush: () => {
      handleCoolDownPeriodEnd();
      return result;
    },

    get isPending() {
      return timeoutId !== undefined;
    },

    get cachedValue() {
      return result;
    },
  };
}
