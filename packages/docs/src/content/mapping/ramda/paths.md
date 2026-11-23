---
category: Object
---

_Not provided by Remeda._

- Compose `paths` using [`map`](/docs#map) and [`prop`](/docs#prop).
- Remeda doesn't take a type argument for the results. If you passed one to
  `R.paths` (e.g., `R.paths<number>(...)`), cast each result instead.

#### Composition

```ts
const DATA = { a: { b: 2 }, p: [{ q: 3 }] };
const PATHS = [
  ["a", "b"],
  ["p", 0, "q"],
];

// Ramda
R.paths(PATHS, DATA);

// Remeda
map(PATHS, (path) => prop(DATA, ...path));
```

#### Type arguments

```ts
// Ramda
R.paths<number>(PATHS, DATA);

// Remeda
map(PATHS, (path) => prop(DATA, ...path) as number | undefined);
```
