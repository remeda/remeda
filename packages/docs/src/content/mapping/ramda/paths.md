---
category: Object
---

Compose `paths` using [`map`](/docs#map) and [`prop`](/docs#prop):

```ts
const DATA = { a: { b: 2 }, p: [{ q: 3 }] };

// Ramda
R.paths(
  [
    ["a", "b"],
    ["p", 0, "q"],
  ],
  DATA,
);

// Remeda
map(
  [
    ["a", "b"],
    ["p", 0, "q"],
  ] as const,
  (path) => prop(DATA, ...path),
);
```
