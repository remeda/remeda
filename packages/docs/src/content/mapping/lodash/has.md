---
category: Object
remeda: hasKey
---

- Lodash's `has` accepts deep paths (`"a.b.c"` or `["a", "b", "c"]`). Remeda's
  `hasKey` only checks a single key — for nested paths, narrow step by step.
- `hasKey` is also a type-predicate: it removes optionality from the matched
  key and drops union members that don't have the key.

```ts
// Lodash
has(obj, "a");

// Remeda
hasKey(obj, "a");
```
