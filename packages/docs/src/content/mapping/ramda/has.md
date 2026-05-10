---
category: Object
remeda: hasKey
---

- Both check for an own property using `Object.hasOwn` semantics, so the
  runtime behavior is identical.
- Remeda's `hasKey` is also a type-predicate: it removes optionality from the
  matched key and drops union members that don't have the key.

```ts
// Ramda
has("a", obj);
R.has("a")(obj);

// Remeda
hasKey(obj, "a");
pipe(obj, hasKey("a"));
```
