---
category: Function
remeda: funnel
---

- `debounce` can be implemented using the `funnel` utility. A reference
  implementation is provided below, and a more expanded version with inline
  documentation and tests is available in the test file [`funnel.lodash-debounce.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.lodash-debounce.test.ts).

- A more complete reference implementation that also maintains Lodash's
  capability to store the callback's return value is available below, and in [`funnel.lodash-debounce-with-cached-value.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.lodash-debounce-with-cached-value.test.ts).

- These implementations can be copied as-is into your project, but might contain
  redundant parts which are not relevant for your specific use cases. By
  inlining only the parts you need you can take advantage of capabilities not
  available in Lodash.

### Reference

```ts
function debounce<F extends (...args: any) => void>(
  func: F,
  wait = 0,
  {
    leading = false,
    trailing = true,
    maxWait,
  }: {
    readonly leading?: boolean;
    readonly trailing?: boolean;
    readonly maxWait?: number;
  } = {},
) {
  const {
    call,
    isIdle: _isIdle,
    ...rest
  } = funnel(
    () => {
      if (leading || trailing) {
        func();
      }
    },
    {
      minQuietPeriodMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      triggerAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );
  return Object.assign(call, rest);
}
```

### With call arguments

```ts
function debounce<F extends (...args: any) => void>(
  func: F,
  wait = 0,
  {
    leading = false,
    trailing = true,
    maxWait,
  }: {
    readonly leading?: boolean;
    readonly trailing?: boolean;
    readonly maxWait?: number;
  } = {},
) {
  const {
    call,
    isIdle: _isIdle,
    ...rest
  } = funnel(
    (args: Parameters<F>) => {
      if (leading || trailing) {
        func(...args);
      }
    },
    {
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      triggerAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );
  return Object.assign(call, rest);
}
```

### With cached value

```ts
function debounce<F extends (...args: any) => any>(
  func: F,
  wait = 0,
  {
    leading = false,
    trailing = true,
    maxWait,
  }: {
    readonly leading?: boolean;
    readonly trailing?: boolean;
    readonly maxWait?: number;
  } = {},
) {
  let cachedValue: ReturnType<F> | undefined;

  const { call, flush, cancel } = funnel(
    (args: Parameters<F>) => {
      if (leading || trailing) {
        cachedValue = func(...args) as ReturnType<F>;
      }
    },
    {
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      triggerAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );
  return Object.assign(
    (...args: Parameters<F>) => {
      call(...args);
      return cachedValue;
    },
    {
      flush: () => {
        flush();
        return cachedValue;
      },

      cancel,
    },
  );
}
```
