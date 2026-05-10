---
category: Object
remeda: hasKey
---

- Ramda's `hasIn` uses the `in` operator and walks the prototype chain;
  `hasKey` mirrors `Object.hasOwn` and only checks own properties.
- In modern code the distinction between own and inherited properties rarely
  matters — most objects users care about don't sit on a custom prototype, and
  edge cases like `toString` are usually unintentional matches anyway.

```ts
// Ramda
hasIn("a", obj);

// Remeda
hasKey(obj, "a");
```
