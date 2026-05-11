---
category: Object
remeda: hasProp
---

- Ramda's `hasIn` uses [the `in` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
  which returns `true` for **inherited** properties. Remeda uses
  [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
  which ignores them.

```ts
// Ramda
hasIn("a", obj);

// Remeda
hasProp(obj, "a");

// Inherited properties
hasIn("toString", {}); //=> true
hasProp({}, "toString"); //=> false
```
