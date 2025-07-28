---
category: Object
remeda: prop
---

Compose `paths` using [`map`](/docs#map) and [`prop`](/docs#prop):

```ts
const DATA = { a: { b: 2 }, p: [{ q: 3 }] };
const PATHS = [
  ["a", "b"],
  ["p", 0, "q"],
] as const;

// Ramda
R.paths(PATHS, DATA);

// Remeda
map(PATHS, (path) => prop(DATA, ...path));
```
