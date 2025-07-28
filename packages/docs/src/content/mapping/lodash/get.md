---
category: Object
remeda: prop
---

- In Lodash `get` takes an array where each element is a property in the path to
  a deeply-nested property (e.g. `['a', 'b', '0', 'c']`). In Remeda the path is
  provided directly as a variadic arguments list.
- In Lodash all property keys are `string`, even when accessing numbers. In
  Remeda the exact type of each prop should be used instead (e.g., `number` when
  accessing arrays).
- Lodash also supports a _string_ that defines the path to the deeply-nested
  property (e.g., `a.b[0].c`). In Remeda this isn't supported directly; instead,
  use the helper function [`stringToPath`](/docs#stringToPath) to convert the
  path string to a path array, which could then be _spread_ into `prop`.
- Lodash supports an optional last argument to `get` which defines a default
  fallback in cases where the prop being accessed does not exist on the input
  object. This could be replicated by using the built-in
  [Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
  on the result of `prop`.
- If you need stricter typing for the default fallback consider [`pathOr`](/docs#pathOr)
  though this function is being phased out and would be deprecated and removed
  in the near future.

### Shallow Access

```ts
const DATA = { a: 123 };

// Lodash
_.get(DATA, ["a"]);

// Remeda
prop(data, "a");
```

### Array indices

```ts
const DATA = [1, 2, 3];

// Lodash
_.get(DATA, ["0"]);

// Remeda
prop(DATA, 0);
```

### Path Arrays

```ts
const DATA = { a: [{ b: { c: 3 } }] };

// Lodash
_.get(DATA, ["a", "0", "b", "c"]);

// Remeda
prop(DATA, "a", 0, "b", "c");
```

### Path Strings

```ts
const DATA = { a: [{ b: { c: 3 } }] };

// Lodash
_.get(DATA, "a[0].b.c");

// Remeda
prop(DATA, ...stringToPath("a[0].b.c"));
```

### Default Fallback

```ts
const DATA = { a: [] as Array<{ b: number }> };

// Lodash
_.get(DATA, ["a", "0", "b"], "default");

// Remeda
prop(DATA, "a", 0, "b") ?? "default";
// When you need the provided default value to be typechecked use:
pathOr(DATA, ["a", 0, "b"], 123);
```
