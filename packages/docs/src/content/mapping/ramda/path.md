---
category: Object
remeda: prop
---

- Remeda's `prop` takes the data first, and the path as variadic arguments
  instead of an array.
- A path only known at runtime (e.g., a `string[]`) can be spread into `prop`,
  but it can't be validated against the object's type, so the result is typed
  `unknown`.

#### Literal paths

```ts
// Ramda
R.path(["a", "b"], DATA);

// Remeda
prop(DATA, "a", "b");
```

#### Runtime paths

```ts
const PATH: string[];

// Ramda
R.path(PATH, DATA);

// Remeda
prop(DATA, ...PATH);
```
