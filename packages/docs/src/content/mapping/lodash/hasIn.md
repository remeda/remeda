---
category: Object
remeda: hasKey
---

- Lodash's `hasIn` walks the prototype chain, so it returns `true` for
  inherited properties (e.g. `hasIn({}, "toString")`). `hasKey` mirrors
  `Object.hasOwn` and only considers own properties.
- In modern code, the distinction between own and inherited properties rarely
  matters — most objects users care about don't sit on a custom prototype, and
  edge cases like `toString` are usually unintentional matches anyway.
- `hasIn` accepts deep paths; `hasKey` only checks a single key.

```ts
// Lodash
hasIn(obj, "a");

// Remeda
hasKey(obj, "a");
```
