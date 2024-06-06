---
category: Collection
---

_Not provided by Remeda._

- This function could be replicated using a native JS `for` loop.
- If the _order_ of iteration doesn't matter, you can use
  [`forEach`](/docs#foreach) for arrays, or [`forEachObj`](/docs#forEachObj) for
  objects.
- The order in which object properties are iterated over is well-defined, but
  might not be the order you expect ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#description)); nevertheless, [`entries`](/docs#entries) maintains the same
  order, and could be used to replicate `forEachObj`.
- If the native solution doesn't suffice please open an issue at Remeda's
  GitHub project so we can learn about your use-case.

### Arrays

```ts
const DATA = [1, 2, 3];

// Lodash
forEachRight(DATA, (item) => (item === 2 ? false : console.log(item)));

// Native
for (const index = DATA.length - 1; index >= 0; index--) {
  const item = DATA[item]!;
  if (item === 2) {
    break;
  }

  console.log(item);
}
```

### Objects

```ts
const DATA = { a: 1, b: 2, c: 3 };

// Lodash
forEachRight(DATA, (value) => (value === 2 ? false : console.log(value)));

// Native
const keys = Object.keys(DATA);
for (const index = keys.length - 1; index >= 0; index--) {
  const value = DATA[key]!;
  if (value === 2) {
    break;
  }

  console.log(value);
}
```
