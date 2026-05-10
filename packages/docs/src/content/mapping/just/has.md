---
category: Objects
remeda: hasKey
---

- Just's `has` accepts deep paths (e.g. `["a", "b"]`). Remeda's `hasKey` only
  checks a single key — for nested paths, narrow step by step.
- Remeda's `hasKey` is also a type-predicate: it removes optionality from the
  matched key and drops union members that don't have the key.

```ts
// Just
has(obj, "a");

// Remeda
hasKey(obj, "a");
```
