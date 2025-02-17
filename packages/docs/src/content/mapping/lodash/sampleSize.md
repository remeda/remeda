---
category: Collection
remeda: sample
---

- Unlike Lodash, In Remeda the `sample` function returns items in the **same
  order** they appear in the input. Use the `shuffle` function if you also need
  to randomize their order.
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
