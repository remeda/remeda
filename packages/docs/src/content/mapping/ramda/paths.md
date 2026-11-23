---
category: Object
---

_Not provided by Remeda._

- Compose `paths` using [`map`](/docs#map) and [`prop`](/docs#prop).
- As in Ramda, the keys in each path aren't checked against the object's type.
- As in Ramda, the results are typed `unknown`, not the types of the properties
  they reach. If you passed a type argument to `R.paths` (e.g.,
  `R.paths<number>(...)`), narrow the results yourself.

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
