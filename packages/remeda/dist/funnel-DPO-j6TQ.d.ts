import { RequireAtLeastOne } from "type-fest";

//#region src/funnel.d.ts
type FunnelOptions<Args extends RestArguments, R> = {
  readonly reducer?: (accumulator: R | undefined, ...params: Args) => R;
} & FunnelTimingOptions;
type FunnelTimingOptions = ({
  readonly triggerAt?: "end";
} & (({
  readonly minGapMs: number;
} & RequireAtLeastOne<{
  readonly minQuietPeriodMs: number;
  readonly maxBurstDurationMs: number;
}>) | {
  readonly minQuietPeriodMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly minGapMs?: never;
})) | {
  readonly triggerAt: "start" | "both";
  readonly minQuietPeriodMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly minGapMs?: number;
};
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
 * would behave as if it was in the 'end' state. Default: 'end'.
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
declare function funnel<Args extends RestArguments = [], R = never>(callback: (data: R) => void, {
  triggerAt,
  minQuietPeriodMs,
  maxBurstDurationMs,
  minGapMs,
  reducer
}: FunnelOptions<Args, R>): Funnel<Args>;
//#endregion
export { funnel as t };
//# sourceMappingURL=funnel-DPO-j6TQ.d.ts.map