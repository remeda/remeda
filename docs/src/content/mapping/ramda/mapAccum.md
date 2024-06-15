---
category: List
remeda: mapWithFeedback
---

Remeda's `mapWithFeedback` has some differences from Ramda's `mapAccum`, but
could be used to achieve the same results:

- The mapper function only returns a single value for both the accumulator and
  the value (like `reduce` does). `mapWithFeedback` would not work if you need
  these to have different values.
- Only the accumulated array is returned instead of a tuple. The final result of
  the computation would always be the last element in this list, and could be
  retrieved using [`last`](/docs#last).

```ts
// Ramda
const result = mapAccum((a, b) => [a + b, a + b], 0, ["1", "2", "3", "4"]);

// Remeda
const temp = mapWithFeedback(["1", "2", "3", "4"], (a, b) => a + b, 0);
const result = [last(temp), temp];
```
