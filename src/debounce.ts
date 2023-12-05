type Debounced<F extends (...args: any) => unknown> = {
  readonly call: (...args: Parameters<F>) => ReturnType<F> | undefined;
  readonly cancel: () => void;
  readonly flush: () => ReturnType<F> | undefined;
  readonly isPending: boolean;
  readonly cachedValue: ReturnType<F> | undefined;
};

type DebounceOptions = {
  readonly timing?: 'leading' | 'trailing' | 'both';
};

const DEFAULT_TIMING: NonNullable<DebounceOptions['timing']> = 'trailing';

export function debounce<F extends (...args: any) => any>(
  func: F,
  waitMs: number = 0,
  { timing = DEFAULT_TIMING }: DebounceOptions = {}
): Debounced<F> {
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

        if (timing !== 'trailing') {
          // If we aren't only invoking the function at the end of the cool-down
          // period we now need to invoke it.
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
