---
category: Collection
remeda: isIncludedIn
---

- In Lodash `includes` also works on strings and objects; In Remeda only arrays
  are supported. For objects, use [`values`](/docs#values) first. For strings
  prefer the native JS [`String.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes).
- The 3rd optional parameter `fromIndex` isn't supported in Remeda. You can
  replicate it's usage with [`drop`](/docs#drop) (for non-negative indices), or
  [`takeLast`](/docs#takeLast) (for non-positive indices).
- The order of the parameters is flipped in Remeda, the item is first, and then
  the array.

### Arrays

```ts
// Lodash
includes([1, 2, 3], 1);

// Remeda
isIncludedIn(1, [1, 2, 3]);
```

### Objects

```ts
// Lodash
includes({ a: 1, b: 2 }, 1);

// Remeda
isIncludedIn(1, values({ a: 1, b: 2 }));
```

### Strings

```ts
// Lodash
const DATA = "Hello, World!";

// Lodash
includes(DATA, "lo");

// Native
DATA.includes("lo");
```

### fromIndex: non-negative

```ts
// Lodash
includes([1, 2, 3], 1, 2);

// Remeda
isIncludedIn(1, drop([1, 2, 3], 2));
```

### fromIndex: non-positive

```ts
// Lodash
includes([1, 2, 3], 1, -2);

// Remeda
isIncludedIn(1, takeLast([1, 2, 3], 2));
```
