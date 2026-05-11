---
category: Object
remeda: hasProp
---

- Lodash's `has` accepts deep paths (`"a.b.c"` or `["a", "b", "c"]`). Remeda's
  `hasProp` only checks a single key.

```ts
// Lodash
has(obj, "a");

// Remeda
hasProp(obj, "a");
```
