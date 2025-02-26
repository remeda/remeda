---
category: List
remeda: isIncludedIn
---

- In Ramda `includes` also works on strings; use the native JS
  [`String.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
  for strings instead.
- Ramda performs a deep equality check for the item, making `includes` useful
  for array and object items too. In Remeda the comparison is performed via the
  JS native [`Array.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).
  For deep equality use the native [`Array.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
  with Remeda's [`isDeepEqual`](/docs#isDeepEqual).

### Arrays

```ts
// Ramda
includes(1, [1, 2, 3]);

// Remeda
isIncludedIn(1, [1, 2, 3]);
```

### Strings

```ts
const DATA = "Hello, World!";

// Remeda
includes("lo", DATA);

// Native
DATA.includes("lo");
```

### Object items

```ts
const DATA = [{ name: "Fred" }];

// Ramda
includes({ name: "Fred" }, DATA);

// Remeda
DATA.some(isDeepEqual({ name: "Fred" }));
```

### Array items

```ts
const DATA = [[42]];

// Ramda
includes([42], DATA);

// Remeda
DATA.some(isDeepEqual([42]));
```
