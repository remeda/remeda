---
category: List
remeda: map
---

_Not provided by Remeda._

- `pluck(data, k)` is equivalent to `map(data, prop(k))`.

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
R.pluck("val", DATA); //=> { a: "hello", b: "world" };

// Remeda
mapValues(DATA, prop("val"));
```
