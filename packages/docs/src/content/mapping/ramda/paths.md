---
category: Object
---

_Not provided by Remeda._

- Compose `paths` using [`map`](/docs#map) and [`prop`](/docs#prop).
- Remeda doesn't take a type argument for the results. If you passed one to
  `R.paths` (e.g., `R.paths<number>(...)`), cast each result instead.
- Ramda counts negative indices from the end of an array; `prop` doesn't
  support them. Spell out the paths that use one as separate calls, reading
  the array with `prop` and the item with the native
  [`Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).

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

#### Negative indices

```ts
const DATA = { a: { b: [1, 2, 3] } };

// Ramda
R.paths(
  [
    ["a", "b", -2],
    ["a", "b", 0],
  ],
  DATA,
); //=> [2, 1]

// Remeda
[prop(DATA, "a", "b").at(-2), prop(DATA, "a", "b", 0)]; //=> [2, 1]
```
