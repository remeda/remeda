---
category: Collection
remeda: sample
---

- Unlike Lodash, In Remeda the `sample` function doesn't also randomize the
  **order** of the items in the result. Use the `shuffle` function to also
  randomize the result.
- The second parameter to `sampleSize` in Lodash is optional, and defaults to
  **1** when not provided. In Remeda this is a required param.

```ts
// Lodash
sampleSize([1, 2, 3]);
sampleSize([1, 2, 3], 2);

// Remeda
sample([1, 2, 3], 1);

// ❌ The result isn't shuffled, it will always maintain the order of the input.
sample([1, 2, 3], 2);

// ✅ Add the `shuffle` function after sample if the order is important.
shuffle(sample([1, 2, 3], 2));
```
