import type { RequireAtLeastOne } from "type-fest";

// We use the value provided by the reducer to also determine if a call
// was done during a timeout period. This means that even when no reducer
// is provided, we still need a dummy reducer that would return something
// other than `undefined`. It is safe to cast this to R (which might be
// anything) because the callback would never use it as it would be typed
// as a zero-args function.
const VOID_REDUCER_SYMBOL = Symbol("funnel/voidReducer");
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- Intentional, so that it could be used as a default value above.
const voidReducer = <R>(): R => VOID_REDUCER_SYMBOL as R;

type FunnelOptions<Args extends RestArguments, R> = {
  readonly reducer?: (accumulator: R | undefined, ...params: Args) => R;
} & FunnelTimingOptions;

// Not all combinations of timing options are valid, there are dependencies
// between them to ensure users can't configure the funnel in a way which would
// cause it to never trigger.
type FunnelTimingOptions =
  | ({ readonly triggerAt?: "end" } & (
      | ({ readonly minGapMs: number } & RequireAtLeastOne<{
          readonly minQuietPeriodMs: number;
          readonly maxBurstDurationMs: number;
        }>)
      | {
          readonly minQuietPeriodMs?: number;
          readonly maxBurstDurationMs?: number;
          readonly minGapMs?: never;
        }
    ))
  | {
      readonly triggerAt: "start" | "both";
      readonly minQuietPeriodMs?: number;
      readonly maxBurstDurationMs?: number;
      readonly minGapMs?: number;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript has some quirks with generic function types, and works best with `any` and not `unknown`. This follows the typing of built-in utilities like `ReturnType` and `Parameters`.
type RestArguments = Array<any>;

type Funnel<Args extends RestArguments = []> = {
  /**
   * Call the function. This might result in the `execute` function being called
   * now or later, depending on it's configuration and it's current state.
   *
   * @param args - The args are defined by the `reducer` function.
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
 * Creates a funnel that controls the timing and execution of `callback`. Its
 * main purpose is to manage multiple consecutive (usually fast-paced) calls,
 * reshaping them according to a defined batching strategy and timing policy.
 * This is useful when handling uncontrolled call rates, such as DOM events or
 * network traffic. It can implement strategies like debouncing, throttling,
 * batching, and more.
 *
 * An optional `reducer` function can be provided to allow passing data to the
 * callback via calls to `call` (otherwise the signature of `call` takes no
 * arguments).
 *
 * Typing is inferred from `callback`s param, and from the rest params that
 * the optional `reducer` function accepts. Use **explicit** types for these
 * to ensure that everything _else_ is well-typed.
 *
 * Notice that this function constructs a funnel **object**, and does **not**
 * execute anything when called. The returned object should be used to execute
 * the funnel via the its `call` method.
 *
 * - Debouncing: use `minQuietPeriodMs` and any `triggerAt`.
 * - Throttling: use `minGapMs` and `triggerAt: "start"` or `"both"`.
 * - Batching: See the reference implementation in [`funnel.reference-batch.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.reference-batch.test.ts).
 *
 * @param callback - The main function that would be invoked periodically based
 * on `options`. The function would take the latest result of the `reducer`; if
 * no calls where made since the last time it was invoked it will not be
 * invoked. (If a return value is needed, it should be passed via a reference or
 * via closure to the outer scope of the funnel).
 * @param options - An object that defines when `execute` should be invoked,
 * relative to the calls of `call`. An empty/missing options object is
 * equivalent to setting `minQuietPeriodMs` to `0`.
 * @param options.reducer - Combines the arguments passed to `call` with the
 * value computed on the previous call (or `undefined` on the first time). The
 * goal of the function is to extract and summarize the data needed for
 * `callback`. It should be fast and simple as it is called often and should
 * defer heavy operations to the `execute` function. If the final value
 * is `undefined`, `callback` will not be called.
 * @param options.triggerAt - At what "edges" of the funnel's burst window
 * would `execute` invoke:
 * - `start` - the function will be invoked immediately (within the  **same**
 * execution frame!), and any subsequent calls would be ignored until the funnel
 * is idle again. During this period `reducer` will also not be called.
 * - `end` - the function will **not** be invoked initially but the timer will
 * be started. Any calls during this time would be passed to the reducer, and
 * when the timers are done, the reduced result would trigger an invocation.
 * - `both` - the function will be invoked immediately, and then the funnel
 * would behave as if it was in the 'end' state. @default 'end'.
 * @param options.minQuietPeriodMs - The burst timer prevents subsequent calls
 * in short succession to cause excessive invocations (aka "debounce"). This
 * duration represents the **minimum** amount of time that needs to pass
 * between calls (the "quiet" part) in order for the subsequent call to **not**
 * be considered part of the burst. In other words, as long as calls are faster
 * than this, they are considered part of the burst and the burst is extended.
 * @param options.maxBurstDurationMs - Bursts are extended every time a call is
 * made within the burst period. This means that the burst period could be
 * extended indefinitely. To prevent such cases, a maximum burst duration could
 * be defined. When `minQuietPeriodMs` is not defined and this option is, they
 * will both share the same value.
 * @param options.minGapMs - A minimum duration between calls of `execute`.
 * This is maintained regardless of the shape of the burst and is ensured even
 * if the `maxBurstDurationMs` is reached before it. (aka "throttle").
 * @returns A funnel with a `call` function that is used to trigger invocations.
 * In addition to it the funnel also comes with the following functions and
 * properties:
 * - `cancel` - Resets the funnel to it's initial state, discarding the current
 * `reducer` result without calling `execute` on it.
 * - `flush` - Triggers an invocation even if there are active timeouts, and
 * then resets the funnel to it's initial state.
 * - `isIdle` - Checks if there are any active timeouts.
 * @signature
 *   R.funnel(callback, options);
 * @example
 *   const debouncer = R.funnel(
 *     () => {
 *       console.log("Callback executed!");
 *     },
 *     { minQuietPeriodMs: 100 },
 *   );
 *   debouncer.call();
 *   debouncer.call();
 *
 *   const throttle = R.funnel(
 *     () => {
 *       console.log("Callback executed!");
 *     },
 *     { minGapMs: 100, triggerAt: "start" },
 *   );
 *   throttle.call();
 *   throttle.call();
 * @category Function
 */
export function funnel<Args extends RestArguments = [], R = never>(
  callback: (data: R) => void,
  {
    triggerAt = "end",
    minQuietPeriodMs,
    maxBurstDurationMs,
    minGapMs,
    reducer = voidReducer,
  }: FunnelOptions<Args, R>,
): Funnel<Args> {
  // We manage execution via 2 timeouts, one to track bursts of calls, and one
  // to track the interval between invocations. Together we refer to the period
  // where any of these are active as a "cool-down period".
  let burstTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let intervalTimeoutId: ReturnType<typeof setTimeout> | undefined;

  // Until invoked, all calls are reduced into a single value that would be sent
  // to the executor on invocation.
  let preparedData: R | undefined;

  // In order to be able to limit the total size of the burst (when
  // `maxBurstDurationMs` is used) we need to track when the burst started.
  let burstStartTimestamp: number | undefined;

  const invoke = (): void => {
    const param = preparedData;
    if (param === undefined) {
      // There were no calls during both cool-down periods.
      return;
    }

    // Make sure the args aren't accidentally used again
    preparedData = undefined;

    if (param === VOID_REDUCER_SYMBOL) {
      // @ts-expect-error [ts2554] -- R is typed as `never` because we hide the
      // symbol that `voidReducer` returns; there's no way to make TypeScript
      // aware of this.
      callback();
    } else {
      callback(param);
    }

    if (minGapMs !== undefined) {
      intervalTimeoutId = setTimeout(handleIntervalEnd, minGapMs);
    }
  };

  const handleIntervalEnd = (): void => {
    // When called via a timeout the timeout is already cleared, but when called
    // via `flush` we need to manually clear it.
    clearTimeout(intervalTimeoutId);
    intervalTimeoutId = undefined;

    if (burstTimeoutId !== undefined) {
      // As long as one of the timeouts is active we don't invoke the function.
      // Each timeout's end event handler has a call to invoke, so we are
      // guaranteed to invoke the function eventually.
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

    if (intervalTimeoutId !== undefined) {
      // As long as one of the timeouts is active we don't invoke the function.
      // Each timeout's end event handler has a call to invoke, so we are
      // guaranteed to invoke the function eventually.
      return;
    }

    invoke();
  };

  return {
    call: (...args) => {
      // We act based on the initial state of the timeouts before the call is
      // handled and causes the timeouts to change.
      const wasIdle =
        burstTimeoutId === undefined && intervalTimeoutId === undefined;

      if (triggerAt !== "start" || wasIdle) {
        preparedData = reducer(preparedData, ...args);
      }

      if (burstTimeoutId === undefined && !wasIdle) {
        // We are not in an active burst period but in an interval period. We
        // don't start a new burst window until the next invoke.
        return;
      }

      if (
        minQuietPeriodMs !== undefined ||
        maxBurstDurationMs !== undefined ||
        minGapMs === undefined
      ) {
        // The timeout tracking the burst period needs to be reset every time
        // another call is made so that it waits the full cool-down duration
        // before it is released.
        clearTimeout(burstTimeoutId);

        const now = Date.now();

        burstStartTimestamp ??= now;

        const burstRemainingMs =
          maxBurstDurationMs === undefined
            ? (minQuietPeriodMs ?? 0)
            : Math.min(
                minQuietPeriodMs ?? maxBurstDurationMs,
                // We need to account for the time already spent so that we
                // don't wait longer than the maxDelay.
                maxBurstDurationMs - (now - burstStartTimestamp),
              );

        burstTimeoutId = setTimeout(handleBurstEnd, burstRemainingMs);
      }

      if (triggerAt !== "end" && wasIdle) {
        invoke();
      }
    },

    cancel: () => {
      clearTimeout(burstTimeoutId);
      burstTimeoutId = undefined;
      burstStartTimestamp = undefined;

      clearTimeout(intervalTimeoutId);
      intervalTimeoutId = undefined;

      preparedData = undefined;
    },

    flush: () => {
      handleBurstEnd();
      handleIntervalEnd();
    },

    get isIdle() {
      return burstTimeoutId === undefined && intervalTimeoutId === undefined;
    },
  };
}
