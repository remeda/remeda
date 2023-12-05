type SimplifiedFunction<Params extends ReadonlyArray<any>, Return> = (
  ...args: Params
) => Return;

type Debounced<Params extends ReadonlyArray<any>, Return> = {
  readonly call: SimplifiedFunction<Params, Return | undefined>;
  readonly cancel: () => void;
  readonly flush: () => Return | undefined;
  readonly isPending: boolean;
};

type DebounceOptions = {
  readonly timing?: 'leading' | 'trailing';
};

const DEFAULT_TIMING: NonNullable<DebounceOptions['timing']> = 'trailing';

export function debounce<Params extends ReadonlyArray<any>, Return>(
  func: SimplifiedFunction<Params, Return>,
  waitMs: number = 0,
  { timing = DEFAULT_TIMING }: DebounceOptions = {}
): Debounced<Params, Return> {
  let invocationArgs: Params | undefined;
  let lastCallTimeMs: number | undefined;
  let timeoutId: NodeJS.Timeout | undefined;
  let result: Return | undefined;

  const handleCoolDownPeriodEnd = () => {
    if (timeoutId === undefined) {
      // If there's no active timeout it means there's no pending invocations.
      return;
    }

    // We are starting an invocation event, we first make sure there are no
    // future timers that would run.
    clearTimeout(timeoutId);
    timeoutId = undefined;

    if (timing !== 'trailing') {
      return;
    }

    // When our invocation timing is 'trailing' we want to invoke the function
    // at the end of our cool-down period, otherwise we simply do cleanup at
    // the end of the cool-down period to allow subsequent calls to start a
    // new cool-down period.

    if (invocationArgs === undefined) {
      throw new Error(
        "Something went wrong! we don't have arguments to invoke the debounced call with"
      );
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

      if (timing === 'trailing') {
        // For trailing invocations we want to use the last args that we got
        // before invocation.
        invocationArgs = args;
      }

      if (timeoutId === undefined) {
        // This is the first call (since the previous cool-down period) so we
        // start a new one.

        if (timing === 'leading') {
          // If we're leading we invoke the function immediately.
          result = func(...args);
        }

        timeoutId = setTimeout(handleTimeout, waitMs);
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
  };
}
