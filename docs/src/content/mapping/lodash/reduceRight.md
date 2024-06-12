---
category: Collection
remeda: reduce
---

Use [`reverse`](/docs#reverse) on the input.

```ts
// Lodash
reduceRight(DATA, reducer, accumulator);

// Remeda
reduce(reverse(DATA), reducer, accumulator);

// Or with a pipe
pipe(DATA, reverse(), reduce(reducer, accumulator));
```
