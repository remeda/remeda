---
category: Object
remeda: hasProp
---

- Lodash's `hasIn` uses [the `in` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
  which returns `true` for **inherited** properties. Remeda uses
  [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
  which ignores them.
- Lodash's `hasIn` accepts deep paths (`"a.b.c"` or `["a", "b", "c"]`).
  Remeda's `hasProp` only checks a single key.

#### Own properties

```ts
// Lodash
hasIn(obj, "a");

// Remeda
hasProp(obj, "a");
```

#### Inherited properties

```ts
// Lodash
hasIn({}, "toString"); //=> true

// Remeda
hasProp({}, "toString"); //=> false
```
