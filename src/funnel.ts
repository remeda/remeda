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
   * The funnel is in it's initial state (there are no active timers).
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
 * invoked, relative to the calls of `call`.
 * @param timingPolicy.invokedAt - At what "edges" of the funnel's activity
 * window should `execute` be invoked. `start` means at the transition from
 * being idle to active, e.g. immediately when `call` is invoked; (this will be
 * invoked within the same execution frame!). `end` happens when the idle switch
 * _back_ from active to idle; (this will never be invoked within the same
 * execution frame, even if the timeouts are defined as 0ms). @default 'end'.
 * @param timingPolicy.burstCoolDownMs - The maximum duration (in milliseconds)
 * between calls that will be considered part of the same "burst". If a new call
 * is made within this duration, the burst is **extended** (aka "debounce"
 * time).
 * @param timingPolicy.maxBurstDurationMs - A maximum duration (in milliseconds)
 * for a "burst". Define this to prevent cases of starvation where a burst is
 * constantly extended because of incoming calls within the `burstCoolDownMs`.
 * @param timingPolicy.delayMs - A minimum duration between calls of `execute`.
 * This is maintained regardless of the shape of the burst and is ensured even
 * if the `maxBurstDurationMs` is reached before it. (aka "throttle" time).
 * @returns A funnel with a `call` function that is used to trigger invocations.
 * In addition to it the funnel also comes with the following functions and
 * properties:
 * - `cancel` - Resets the funnel to it's initial state, discarding the current
 * `reducedArgs` result without calling `execute` on it.
 * - `flush` - Triggers an invocation even if there are active timers, and then
 * resets the funnel to it's initial state.
 * - `isIdle` - Checks if there are any active timers.
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
      // Because `invoke` which might be called later modifies `delayTimeoutId`
      // we need to store this value ahead of time so we can act on it's
      // original value.
      const isIdle =
        burstTimeoutId === undefined && delayTimeoutId === undefined;

      if (invokedAt !== "start" || isIdle) {
        preparedData = reduceArgs(preparedData, ...args);
      }

      if (invokedAt !== "end" && isIdle) {
        invoke();
      }

      if (burstCoolDownMs === undefined) {
        // The burst mechanism isn't used.
        return;
      }

      if (burstTimeoutId === undefined && !isIdle) {
        // We are not in an active burst period but in a delay period. We
        // don't start a new burst window until the next invoke.
        return;
      }

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

      // console.log(
      //   now,
      //   burstStartTimestamp,
      //   burstRemainingMs,
      //   maxBurstDurationMs,
      //   now - burstStartTimestamp,
      //   (maxBurstDurationMs ?? 0) - (now - burstStartTimestamp),
      // );

      burstTimeoutId = setTimeout(handleBurstEnd, burstRemainingMs);
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
