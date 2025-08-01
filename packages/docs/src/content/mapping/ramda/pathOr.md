---
category: Object
remeda: prop
---

Compose [`prop`](/docs#prop) with [`defaultTo`](/docs#defaultTo).

```ts
// Ramda
R.pathOr("N/A", ["a", "b"], { a: { b: 2 } });

// Remeda
defaultTo(prop({ a: { b: 2 } }, "a", "b"), "N/A");
```
