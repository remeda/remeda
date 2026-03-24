---
category: List
remeda: range
---

Ramda's `range` does not support a `step` parameter. Remeda's `range` supports
step via an options object.

```ts
// Ramda
R.range(1, 5);

// Remeda
range(1, 5);

// Remeda (with step)
range(1, { end: 5, step: 2 });
```
