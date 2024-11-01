type TimingPolicy = {
  readonly invokedAt?: "both" | "end" | "start";
  readonly burstCoolDownMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly delayMs?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript has some quirks with generic function types, and works best with `any` and not `unknown`. This follows the typing of built-in utilities like `ReturnType` and `Parameters`.
type RestArguments = Array<any>;

type Funnel<Args extends RestArguments> = {
  /**
   * Call the function. This might result in the `execute` function being called
   * now or later, depending on it's configuration and it's current state.
   *
   * @param args - The args are defined by the `reduceArgs` function.
   */

  readonly call: (...args: Args) => void;

  /**
   * Resets the funnel to it's initial state. Any calls made since the last
   * invocation will be discarded.
   */
  readonly cancel: () => void;

  /**
   * Triggers an invocation regardless of the current state of the funnel.
   * Like any other invocation, The funnel will also be reset to it's initial
   * state afterwards.
   */
  readonly flush: () => void;

  /**
   * The funnel is in it's initial state (there are no active timeouts).
   */
  readonly isIdle: boolean;
};

/**
 * Creates a funnel that controls the timing and execution of a callback
 * function (`execute`). Its main purpose is to manage multiple consecutive
 * (usually fast-paced) calls, reshaping them according to a defined batching
 * strategy and timing policy. This is useful when handling uncontrolled call
 * rates, such as DOM events or network traffic. It can implement strategies
 * like debouncing, throttling, batching, and more.
 *
 * Typing is inferred from the type of the `reduceArgs` function. Use
 * **explicit** types for the parameters and return type to ensure that
 * everything _else_ is well-typed.
 *
 * Notice that this function constructs a funnel **object**, and does **not**
 * execute anything when called. The returned object should be used to execute
 * the funnel via the it's `call` method.
 *
 * For debouncing: use `burstCoolDownMs` and any `invokedAt`.
 * For throttling: use `delayMs` and `invokedAt: "start"`.
 * For batching: See the reference implementation in [`funnel.reference-batch.test.ts`](https://github.com/remeda/remeda/blob/main/src/funnel.reference-batch.test.ts).
 *
 * @param reduceArgs - Combines the arguments passed to `call` with the value
 * computed on the previous call (or `undefined` on the first time). The goal of
 * the function is to extract and summarize the data needed for `execute`,
 * reducing multiple argument values into a single value. It should be fast and
 * simple as it is called often. It should defer heavy operations to the
 * `execute` function. If it returns `undefined` the `execute` function will not
 * be called.
 * @param execute - The main function that would be invoked occasionally based
 * on `timingPolicy`. The function would take the latest result of
 * `reduceArgs`; if no calls where made since the last time it was invoked it
 * will not be invoked. If a return value is needed, it should be passed via a
 * reference or via closure to the outer scope of the funnel.
 * @param timingPolicy - An object that defines when `execute` should be
 * invoked, relative to the calls of `call`. A timer that isn't defined will
 * **not** be enabled, 0 is not used a default fallback.
 * @param timingPolicy.invokedAt - At what "edges" of the funnel's activity
 * window should `execute` be invoked. `start` means The function will be
 * invoked immediately (withing the **same** execution frame!), and any
 * subsequent calls would be ignored until the funnel is idle again. During
 * this period `reduceArgs` will also not be called. `end` The function will
 * **not** be invoked initially but the timer will be started. Any calls during
 * this time would be passed to the reducer, and when the timers are done, the
 * reduced result would trigger an invocation. When `both` is used The function
 * will be invoked immediately, and then the funnel would behave as if it was
 * in the 'end' state. @default 'end'.
 * @param timingPolicy.burstCoolDownMs - The burst timer prevents subsequent
 * calls in short succession to cause excessive invocations (aka "debounce").
 * This duration represents the **minimum** amount of time that needs to pass
 * between calls (the "quiet" part) in order for the subsequent call to **not**
 * be considered part of the burst. In other words, as long as calls are faster
 * than this, they are considered part of the burst.
 * @param timingPolicy.maxBurstDurationMs - Bursts are extended every time a
 * call is made within the burst period. This means that the burst period could
 * be extended indefinitely. To prevent such cases, a maximum burst duration
 * could be defined.
 * @param timingPolicy.delayMs - A minimum duration between calls of `execute`.
 * This is maintained regardless of the shape of the burst and is ensured even
 * if the `maxBurstDurationMs` is reached before it. (aka "throttle").
 * @returns A funnel with a `call` function that is used to trigger invocations.
 * In addition to it the funnel also comes with the following functions and
 * properties:
 * - `cancel` - Resets the funnel to it's initial state, discarding the current
 * `reducedArgs` result without calling `execute` on it.
 * - `flush` - Triggers an invocation even if there are active timeouts, and
 * then resets the funnel to it's initial state.
 * - `isIdle` - Checks if there are any active timeouts.
 * @signature
 *   R.funnel(reduceArgs, execute, policy);
 * @example
 *   const debouncer = R.funnel(
 *     (acc, value: string) => value,
 *     (value) => { console.log(value); },
 *     { burstCoolDownMs: 100 },
 *   );
 *
 *   debouncer.call("hello");
 *   debouncer.call("world");
 * @category Function
 */
export function funnel<Args extends RestArguments, R>(
  reduceArgs: (accumulator: R | undefined, ...params: Args) => R,
  execute: (data: R) => void,
  {
    invokedAt = "end",
    burstCoolDownMs,
    maxBurstDurationMs,
    delayMs,
  }: TimingPolicy,
): Funnel<Args> {
  // We manage execution via 2 timeouts, one to track bursts of calls, and one
  // to track the delay between invocations. Together we refer to the period
  // where any of these are active as a "moratorium period".
  let burstTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let delayTimeoutId: ReturnType<typeof setTimeout> | undefined;

  // Until invoked, all calls are reduced into a single value that would be sent
  // to the executor on invocation.
  let preparedData: R | undefined;

  // In order to be able to limit the total size of the burst (when
  // `maxBurstDurationMs` is used) we need to track when the burst started.
  let burstStartTimestamp: number | undefined;

  const invoke = (): void => {
    const param = preparedData;
    if (param === undefined) {
      // There were no calls during both moratoriums periods.
      return;
    }

    // Make sure the args aren't accidentally used again
    preparedData = undefined;

    execute(param);

    if (delayMs !== undefined) {
      delayTimeoutId = setTimeout(handleDelayEnd, delayMs);
    }
  };

  const handleDelayEnd = (): void => {
    // When called via a timeout the timeout is already cleared, but when called
    // via `flush` we need to manually clear it.
    clearTimeout(delayTimeoutId);
    delayTimeoutId = undefined;

    if (burstTimeoutId !== undefined) {
      // As long as one of the moratoriums is active we don't invoke the
      // function. Each moratorium end event handlers has a call to invoke, so
      // we are guaranteed to invoke the function eventually.
      return;
    }

    invoke();
  };

  const handleBurstEnd = (): void => {
    // When called via a timeout the timeout is already cleared, but when called
    // via `flush` we need to manually clear it.
    clearTimeout(burstTimeoutId);
    burstTimeoutId = undefined;
    burstStartTimestamp = undefined;

    if (delayTimeoutId !== undefined) {
      // As long as one of the moratoriums is active we don't invoke the
      // function. Each moratorium end event handlers has a call to invoke, so
      // we are guaranteed to invoke the function eventually.
      return;
    }

    invoke();
  };

  return {
    call: (...args) => {
      // We act based on the initial state of the timeouts before the call is
      // handled and causes the timeouts to change.
      const wasIdle =
        burstTimeoutId === undefined && delayTimeoutId === undefined;

      if (invokedAt !== "start" || wasIdle) {
        preparedData = reduceArgs(preparedData, ...args);
      }

      if (burstTimeoutId === undefined && !wasIdle) {
        // We are not in an active burst period but in a delay period. We
        // don't start a new burst window until the next invoke.
        return;
      }

      if (burstCoolDownMs !== undefined) {
        // The timeout tracking the burst period needs to be reset every time
        // another call is made so that it waits the full cool-down duration
        // before it is released.
        clearTimeout(burstTimeoutId);

        const now = Date.now();

        burstStartTimestamp ??= now;

        const burstRemainingMs =
          maxBurstDurationMs === undefined
            ? burstCoolDownMs
            : Math.min(
                burstCoolDownMs,
                // We need to account for the time already spent so that we
                // don't wait longer than the maxDelay.
                maxBurstDurationMs - (now - burstStartTimestamp),
              );

        burstTimeoutId = setTimeout(handleBurstEnd, burstRemainingMs);
      }

      if (invokedAt !== "end" && wasIdle) {
        invoke();
      }
    },

    cancel: () => {
      clearTimeout(burstTimeoutId);
      burstTimeoutId = undefined;
      burstStartTimestamp = undefined;

      clearTimeout(delayTimeoutId);
      delayTimeoutId = undefined;

      preparedData = undefined;
    },

    flush: () => {
      handleBurstEnd();
      handleDelayEnd();
    },

    get isIdle() {
      return burstTimeoutId === undefined && delayTimeoutId === undefined;
    },
  };
}
