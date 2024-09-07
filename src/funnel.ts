import { type ArrayTail } from "type-fest";

type TimingPolicy = {
  readonly invokedAt?: "both" | "end" | "start";
  readonly burstCoolDownMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly delayMs?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript has some quirks with generic function types, and works best with `any` and not `unknown`. This follows the typing of built-in utilities like `ReturnType` and `Parameters`.
type ParametersReducer = <T>(accumulator: T | undefined, ...params: any) => T;

type Funnel<F extends ParametersReducer> = {
  /**
   * Call the function. This might result in the `execute` function being called
   * now or later, depending on it's configuration and it's current state.
   *
   * @param args - The args are defined by the `reduceArgs` function.
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- This is OK for here...
  readonly call: (...args: ArrayTail<Parameters<F>>) => void;

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
 * TODO.
 *
 * @param reduceArgs - Reduces the arguments from multiple calls into a single
 * argument that would then be used when `execute` is invoked. The first
 * argument is the previous value returned by `reduceArgs` (or `undefined` if
 * this is the first call). The rest of the arguments are the arguments passed
 * to `call`. This function defines the types for the arguments of `call`, and
 * should have explicit types. The function is only called when a later
 * invocation of `execute` is expected, when `policy.invokedAt` is `'start'` and
 * there is an active period the function is skipped.
 * @param execute - The main function that would be called based on the policy
 * set by the `options` object. The function would take the result of
 * `reduceArgs` called for each call to `call` since the last time it was
 * invoked. If no calls where made in this period it will not be called at all.
 * @param policy - The timing policy that defines when `execute` should be
 * called following the calls to `call`.
 * @param policy.invokedAt -
 * - `start` - The function is invoked at the start of each period. Any
 * subsequent calls while the funnel is active would be ignored.
 * - `end` - The function is invoked at the end of each period.
 * - `both` - The function is invoked both at the `start` and `end`
 * timings. @default 'end'.
 * @param policy.burstCoolDownMs - The maximum duration between calls that would
 * be considered as the same burst. If a call is made within this duration the
 * burst is extended to contain it. (aka "debounce" time).
 * @param policy.maxBurstDurationMs - A maximum duration for a burst. When this
 * is *not* defined the burst could last as long as there are `calls` being made
 * within the `burstCoolDownMs` period. To prevent starvation of the `execute`
 * function, the burst will be ended after this duration even if there are
 * calls being made.
 * @param policy.delayMs - A minimum duration between calls of `execute`. This
 * is maintained regardless of the shape of the burst and is ensured even if the
 * `maxBurstDurationMs` is reached before it. (aka "throttle" time).
 * @returns A funnel with a `call` function that is used to trigger invocations.
 * In addition to it the funnel also comes with the following functions and
 * properties:
 * - `cancel` - which resets the funnel to it's initial state, ignoring any
 * pending calls.
 * - `flush` - which triggers an invocation even if there are active timers, and
 * then resets the funnel to it's initial state.
 * - `isIdle` - which allows observing if there are any active timers.
 * @signature
 *   R.funnel(reduceArgs, execute, policy);
 * @example
 *   // TODO
 * @category Function
 */
export function funnel<R extends ParametersReducer>(
  reduceArgs: R,
  execute: (data: ReturnType<R>) => void,
  {
    invokedAt = "end",
    burstCoolDownMs,
    maxBurstDurationMs,
    delayMs,
  }: TimingPolicy,
): Funnel<R> {
  // We manage execution via 2 timeouts, one to track bursts of calls, and one
  // to track the delay between invocations. Together we refer to the period
  // where any of these are active as a "moratorium period".
  let burstTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let delayTimeoutId: ReturnType<typeof setTimeout> | undefined;

  // Until invoked, all calls are reduced into a single value that would be sent
  // to the executor on invocation.
  let preparedData: ReturnType<R> | undefined;

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

      burstStartTimestamp ??= Date.now();

      const burstRemainingMs =
        maxBurstDurationMs === undefined
          ? burstCoolDownMs
          : Math.min(
              burstCoolDownMs,
              // We need to account for the time already spent so that we
              // don't wait longer than the maxDelay.
              maxBurstDurationMs - (Date.now() - burstStartTimestamp),
            );

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
