---
category: Collection
remeda: forEach
---

- In Lodash `forEach` first checks if the data argument is array-like (by
  looking for a `length` prop). In Remeda the function only accepts arrays and
  calling it with an object would result in a TypeScript error. Use
  [`forEachObj`](/docs#forEachObj) instead for those cases.
- In Lodash `forEach` stops iterating early when the callback returns `false`.
  In Remeda the callback cannot return a value (it must return `void`) and this
  feature isn't available. You can build a [`pipe`](/docs#pipe) that would
  replicate this logic.

### Array

```ts
// Lodash
forEach([1, 2, 3], (item) => console.log(item));

// Remeda
forEach([1, 2, 3], (item) => {
  console.log(item);
});
```

### Object

```ts
// Lodash
forEach({ a: 1, b: 2, c: 3 }, (value) => console.log(value));

// Remeda
forEachObj({ a: 1, b: 2, c: 3 }, (value) => {
  console.log(value);
});
```

### Early exit

```ts
// Lodash
forEach([1, 2, 3], (item) => (item === 2 ? false : console.log(item)));

// Remeda
// ❌ You can't return a value in a forEach callback in Remeda:
forEach([1, 2, 3], (item) => (item === 2 ? false : console.log(item)));

// ✅ Instead you can rely on lazy evaluation of pipes:
pipe(
  [1, 2, 3],
  takeWhile((item) => item !== 2),
  forEach((item) => {
    console.log(item);
  }),
);
```
