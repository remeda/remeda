---
category: Object
remeda: prop
---

- Remeda's `prop` takes the path as variadic arguments instead of an array;
  spread a path array into it.
- Remeda doesn't take a type argument for the result. If you passed one to
  `R.path` (e.g., `R.path<number>(...)`), cast the result instead.
- Ramda counts negative indices from the end of an array; `prop` doesn't
  support them. Read the array with `prop` and use the native
  [`Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
  on it, or [`last`](/docs#last) for `-1`.

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

#### Negative indices

```ts
const DATA = { a: { b: [1, 2, 3] } };

// Ramda
R.path(["a", "b", -2], DATA); //=> 2

// Remeda
prop(DATA, "a", "b").at(-2); //=> 2
```
