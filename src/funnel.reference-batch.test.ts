/* eslint-disable unicorn/no-object-as-default-parameter, @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type, @typescript-eslint/use-unknown-in-catch-callback-variable, @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types */

import { funnel } from "./funnel";

type PromiseCallbacks<T> = Parameters<
  ConstructorParameters<typeof Promise<T>>[0]
>;

// @ts-expect-error [ts(6133)] -- soon...
function batch<Params extends Array<any>, Response, Result>(
  executor: (params: ReadonlyArray<Params>) => Promise<Response>,
  extractor: (result: Response, ...params: Params) => Result,
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
          for (const {
            params,
            promiseCallbacks: [resolve],
          } of batched) {
            const result = extractor(response, ...params);
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
