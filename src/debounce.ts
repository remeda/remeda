type SimplifiedFunction<Params extends ReadonlyArray<any>, Return> = (
  ...args: Params
) => Return;

type Debounced<Params extends ReadonlyArray<any>, Return> = {
  readonly call: SimplifiedFunction<Params, Return>;
  readonly cancel: () => void;
  readonly flush: () => Return;
  readonly isPending: boolean;
};

export function debounce<Params extends ReadonlyArray<any>, Return>(
  func: SimplifiedFunction<Params, Return>,
  waitMs: number = 0
  // {
  //   direction = 'leading',
  //   maxWait,
  // }: {
  //   readonly direction?: 'leading' | 'trailing';
  //   readonly maxWait?: number;
  // } = {}
): Debounced<Params, Return> {
  let lastArgs: Params | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime: number | undefined;
  let timeoutId: NodeJS.Timeout | undefined;
  let result: Return | undefined;

  const timerExpired = () => {
    const nowMs = Date.now();

    const remainingWait =
      lastCallTime === undefined ? 0 : waitMs - (nowMs - lastCallTime);

    if (remainingWait <= 0) {
      trailingEdge(nowMs);
    } else {
      // Restart the timer.
      timeoutId = setTimeout(timerExpired, remainingWait);
    }
  };

  const leadingEdge = (nowMs: number) => {
    // Reset any `maxWait` timer.
    lastInvokeTime = nowMs;
    // Start the timer for the trailing edge.
    timeoutId = setTimeout(timerExpired, waitMs);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  };

  const call = (...args: Params): Return => {
    const nowMs = Date.now();
    const isInvoking =
      lastCallTime === undefined || nowMs - lastCallTime >= waitMs;

    lastArgs = args;
    lastCallTime = nowMs;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(nowMs);
      }
    }

    if (timeoutId === undefined) {
      timeoutId = startTimer(timerExpired, waitMs);
    }

    return result as Return;
  };

  return {
    call,
    cancel: () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      lastInvokeTime = 0;
      lastArgs = undefined;
      lastCallTime = undefined;
      timeoutId = undefined;
    },

    flush: () => (timeoutId === undefined ? result : trailingEdge(Date.now())),

    get isPending() {
      return timeoutId !== undefined;
    },
  };
}
