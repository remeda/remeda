---
category: Collection
remeda: map
---

- `map` can be used instead of `invokeMap` by using **functions** instead of
  (string) function _names_.
- If you need to invoke functions dynamically via a provided function name,
  narrow the name first (so you can handle errors explicitly), and then use the
  name to access the object.

### No arguments

```ts
// Lodash
invokeMap(
  [
    [5, 1, 7],
    [3, 2, 1],
  ],
  "sort",
);

// Remeda
map(
  [
    [5, 1, 7],
    [3, 2, 1],
  ],
  (array) => array.sort(),
);
```

### With arguments

```ts
// Lodash
invokeMap([123, 456], String.prototype.split, "");

// Remeda
map([123, 456], (num) => num.toString().split(""));
```

### Dynamic

```ts
const DATA = [
  { foo: (x: number) => x + 1, bar: (x: number) => x - 1 },
  { foo: (x: number) => x * 2, bar: (x: number) => x / 2 },
] as const;

// Lodash
invokeMap(DATA, funcName, 3);

// Remeda
if (funcName === "foo" || funcName === "bar") {
  map(DATA, ({ [funcName]: func }) => func(3));
} else {
  // Error!
}

// Or
map(DATA, (obj) => {
  if (funcName === "foo" || funcName === "bar") {
    return obj[funcName](3);
  } else {
    // Error
  }
});
```
