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
sampleSize(DATA);

// Remeda
sample(DATA, 1);
```

```ts
// Lodash
sampleSize(DATA, 2);

// Remeda
// ❌ The result isn't shuffled!
sample(DATA, 2);

// ✅ Add `shuffle` after `sample` (if order is important).
shuffle(sample(DATA, 2));

// Or with a pipe
pipe(DATA, sample(2), shuffle());
```
