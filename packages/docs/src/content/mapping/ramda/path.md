---
category: Object
remeda: prop
---

- Remeda's `prop` takes the path as variadic arguments instead of an array;
  spread a path array into it.
- Remeda doesn't take a type argument for the result. If you passed one to
  `R.path` (e.g., `R.path<number>(...)`), cast the result instead.

#### Literal paths

```ts
// Ramda
R.path(["a", "b"], DATA);

// Remeda
prop(DATA, "a", "b");
```

#### Path arrays

```ts
const PATH: string[];

// Ramda
R.path(PATH, DATA);

// Remeda
prop(DATA, ...PATH);
```

#### Type arguments

```ts
const PATH: string[];

// Ramda
R.path<number>(PATH, DATA);

// Remeda
prop(DATA, ...PATH) as number | undefined;
```
