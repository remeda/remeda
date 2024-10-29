---
category: List
remeda: map
---

_Not provided by Remeda._

- The Ramda docs mention that `pluck(k, data)` is equivalent to
  `R.map(R.prop(k), data)`. `map` and `prop` are available in Remeda so the same
  conversion is viable using these functions.

- When data is an **object** (and not an _array_) use `mapValues` instead.

### Arrays

```ts
const DATA = [{ val: "hello" }, { val: "world" }];

// Ramda
R.pluck("val", DATA); //=> ["hello", "world"];

// Remeda
map(DATA, prop("val"));
```

### Objects

```ts
const DATA = { a: { val: "hello" }, b: { val: "world" } };

// Ramda
R.pluck("val", DATA); //=> { a: 3, b: 5 };

// Remeda
mapValues(DATA, prop("val"));
```
