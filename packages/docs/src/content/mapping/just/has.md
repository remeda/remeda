---
category: Objects
remeda: hasProp
---

- Just's `has` accepts deep paths (e.g. `["a", "b"]`, `"a.b"`). Remeda's `hasProp` only
  checks a single key.

```ts
// Just
has(obj, "a");

// Remeda
hasProp(obj, "a");
```
