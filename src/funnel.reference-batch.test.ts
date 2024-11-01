/* eslint-disable @typescript-eslint/explicit-function-return-type,  @typescript-eslint/no-explicit-any,  @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/require-await,  @typescript-eslint/use-unknown-in-catch-callback-variable, jsdoc/require-example, unicorn/no-object-as-default-parameter --
 * These aren't useful for a reference implementation!
 */

import { fromKeys } from "./fromKeys";
import { funnel } from "./funnel";

type PromiseCallbacks<T> = Parameters<
  ConstructorParameters<typeof Promise<T>>[0]
>;

/**
 * A reference implementation for a  batching utility function built on top of
 * the `funnel` general purpose execution utility function. It will accumulate
 * all params passed to an async `call` method within the defined timing policy
 * and then use an async executor to process them in one invocation. It then
 * extracts an individual result for each call which is used to resolve the
 * original call.
 *
 * This allows synchronizing multiple async calls while keeping each call site
 * isolated from the rest (for example, as react components).
 *
 * This reference implementation can be copied into your project as-is, or you
 * can use it as the basis for a more complex implementation with additional
 * features.
 *
 * @param executor - The main function that takes a batch and returns an
 * aggregated response. The typing for the it's parameters will derive the
 * typing for the extractor and the `call` method.
 * @param extractor - A function that takes the aggregated response and extracts
 * from it the result for each individual call. The function is called with both
 * the index in the batch, and the params passed to the `call` method. This
 * allows handling APIs that return batch results as both objects and arrays.
 * @param timingPolicy - Same as the param for `funnel`, it defines the
 * time frames where the batch will accumulate calls and when it would trigger.
 * @returns A Funnel object with the `call` method augmented to support async
 * response.
 */
function batch<Params extends Array<any>, BatchResponse, Result>(
  executor: (requests: ReadonlyArray<Params>) => Promise<BatchResponse>,
  extractor: (
    response: BatchResponse,
    index: number,
    ...params: Params
  ) => Result,
  timingPolicy: Parameters<typeof funnel>[2] = {
    invokedAt: "end",
    burstCoolDownMs: 0,
  },
) {
  const batchFunnel = funnel(
    // Reducer: Accumulates the parameters for each call, together with the
    // promise executor callbacks needed to resolve or reject the call.
    (
      batched,
      promiseCallbacks: PromiseCallbacks<Result>,
      ...params: Params
    ) => [...(batched ?? []), { promiseCallbacks, params }],

    // Executor: Passes all accumulated parameters to the executor and then
    // extracts the response for each individual call via the extractor.
    (
      batched: ReadonlyArray<{
        readonly params: Params;
        readonly promiseCallbacks: PromiseCallbacks<Result>;
      }>,
    ) => {
      executor(batched.map(({ params }) => params))
        // On success we iterate again over all calls and allow the extractor
        // to pull a value out of the aggregated response for each one.
        .then((response) => {
          for (const [
            index,
            {
              params,
              promiseCallbacks: [resolve],
            },
          ] of batched.entries()) {
            const result = extractor(response, index, ...params);
            resolve(result);
          }
        })

        // On error we simply pass the error along to all reject callbacks.
        .catch((error) => {
          for (const {
            promiseCallbacks: [, reject],
          } of batched) {
            reject(error);
          }
        });
    },

    timingPolicy,
  );

  return {
    ...batchFunnel,

    call: async (...params: Params) =>
      new Promise<Result>((...callbacks) => {
        batchFunnel.call(callbacks, ...params);
      }),
  };
}

describe("showcase", () => {
  test("results as object", async () => {
    const mockApi = vi.fn(
      async (words: ReadonlyArray<string>): Promise<Record<string, number>> =>
        fromKeys(words, (word) => word.length),
    );

    const countLettersApi = batch(
      // We only need to type the `requests` param of the `executor` callback.
      // All other types are derived from it.
      async (requests: ReadonlyArray<[word: string]>) =>
        await mockApi(requests.flat()),
      (response, _, word) => response[word],
    );

    const prepared = [
      countLettersApi.call("short"),
      countLettersApi.call("medium"),
      countLettersApi.call("loooooooooooooong"),
    ];

    expect(mockApi).toHaveBeenCalledTimes(0);

    const [shortResult, mediumResult, longResult] = await Promise.all(prepared);

    expect(mockApi).toHaveBeenCalledTimes(1);
    expect(mockApi).toHaveBeenLastCalledWith([
      "short",
      "medium",
      "loooooooooooooong",
    ]);
    expect(mockApi).toHaveLastResolvedWith({
      short: 5,
      medium: 6,
      loooooooooooooong: 17,
    });
    expect(shortResult).toBe(5);
    expect(mediumResult).toBe(6);
    expect(longResult).toBe(17);
  });

  test("results as array", async () => {
    const mockApi = vi.fn(
      async (words: ReadonlyArray<string>): Promise<ReadonlyArray<number>> =>
        words.map((word) => word.length),
    );

    const countLettersApi = batch(
      // We only need to type the `requests` param of the `executor` callback.
      // All other types are derived from it.
      async (requests: ReadonlyArray<[word: string]>) =>
        await mockApi(requests.flat()),
      (response, index) => response[index],
    );

    const prepared = [
      countLettersApi.call("short"),
      countLettersApi.call("medium"),
      countLettersApi.call("loooooooooooooong"),
    ];

    expect(mockApi).toHaveBeenCalledTimes(0);

    const [shortResult, mediumResult, longResult] = await Promise.all(prepared);

    expect(mockApi).toHaveBeenCalledTimes(1);
    expect(mockApi).toHaveBeenLastCalledWith([
      "short",
      "medium",
      "loooooooooooooong",
    ]);
    expect(mockApi).toHaveLastResolvedWith([5, 6, 17]);
    expect(shortResult).toBe(5);
    expect(mediumResult).toBe(6);
    expect(longResult).toBe(17);
  });
});
