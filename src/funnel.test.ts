import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run). The number is in milliseconds.
const UT = 16;

describe("edge-cases", () => {
  test("bursts that start late don't prevent delayed invocations", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      burstCoolDownMs: UT,
      delayMs: 2 * UT,
    });
    foo.call();
    foo.call();
    foo.call();

    // We expect the function to be called once because we invoke it both at
    // the start and end of the blackout periods.
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(1.5 * UT);

    // But because our delay time is still longer, we still expect that the
    // function hasn't been called yet again for the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call();
    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0.5 * UT);

    // After the delay is over we expect the function to be invoked again for
    // the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("delay timeouts don't cause an invocation in the middle of bursts", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "end",
      burstCoolDownMs: 2 * UT,
      delayMs: UT,
    });
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
