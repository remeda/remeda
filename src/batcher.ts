import { type ArrayTail } from "type-fest";

type Options = {
  readonly invokedAt?: "both" | "end" | "start";
  readonly burstCoolDownMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly delayMs?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript has some quirks with generic function types, and works best with `any` and not `unknown`. This follows the typing of built-in utilities like `ReturnType` and `Parameters`.
type Reducer = <T>(accumulator: T | undefined, ...params: any) => T;

type Batcher<F extends Reducer> = {
  /**
   * Call the function. This might result in the batcher `execute` function
   * being called now or later, depending on it's configuration and it's current
   * state.
   *
   * @param args - The args are defined by the `reduceArgs` function passed when
   * the batcher was created.
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- This is OK for here...
  readonly call: (...args: ArrayTail<Parameters<F>>) => void;

  /**
   * Resets the batcher to it's initial state. Any calls made since the last
   * invocation will be discarded.
   */
  readonly cancel: () => void;

  /**
   * Triggers an invocation regardless of the current state of the batcher.
   * Like any other invocation, the batcher will also be reset to it's initial
   * state afterwards.
   */
  readonly flush: () => void;

  /**
   * The batcher is in it's initial state and there are no active timers.
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
 * @param reduceArgs - TODO.
 * @param execute - The function to debounce, the returned `call` function will
 * have the exact same signature.
 * @param options - An object allowing further customization of the debouncer.
 * @param options.invokedAt -
 * - `start` - The function is invoked at the start of the cool-down period.
 * - `end` - The function is invoked at the end of the cool-down period
 * (using the args from the last call to the debouncer).
 * - `both` - When this is selected the `end` invocation would only take
 * place if there was more than one call to the debouncer during the cool-down
 * period. @default 'end'.
 * @param options.burstCoolDownMs - The length of the cool-down period in
 * milliseconds. The debouncer would wait until this amount of time has passed
 * without **any** additional calls to the debouncer before triggering the end-
 * of-cool-down-period event. When this happens, the function would be invoked
 * (if `timing` isn't `'start'`) and the debouncer state would be
 * reset. @default 0.
 * @param options.maxBurstDurationMs - The length of time since a debounced call (a call
 * that the debouncer prevented from being invoked) was made until it would be
 * invoked. Because the debouncer can be continually triggered and thus never
 * reach the end of the cool-down period, this allows the function to still be
 * invoked occasionally. IMPORTANT: This param is ignored when `timing` is
 * `'start'`.
 * @param options.delayMs - TODO.
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
 *     { timing: 'end', waitMs: 1000 },
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
export function batcher<R extends Reducer>(
  reduceArgs: R,
  execute: (data: ReturnType<R>) => void,
  { invokedAt = "end", burstCoolDownMs, maxBurstDurationMs, delayMs }: Options,
): Batcher<R> {
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
