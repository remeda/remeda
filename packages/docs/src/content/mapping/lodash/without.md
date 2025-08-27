---
category: Array
remeda: difference
---

_Not provided by Remeda._

- For cases where the input data is **unique** (no duplicate values)
  [`difference`](/docs#difference) could be used as a replacement.

- For the general case, when the input might contain _duplicates_, use the
  composition of [`filter`](/docs#filter), [`isNot`](/docs#isNot), and [`isIncludedIn`](/docs#isIncludedIn)
  instead.

- Notice that `without` takes a variadic array of items to remove. In Remeda all
  functions take an explicit array instead. You will need to wrap your items in
  an array when migrating.

- For very simple cases where the type of items being removed is easily
  distinguishable from those that remain, simple type-guards like
  [`isDefined`](/docs#isDefined), [`isTruthy`](/docs#isTruthy), or
  [`isString`](/docs#isString) could be used instead.

### No duplicates

```ts
const DATA = [1, 2, 3, 4, 5, 6];

// Lodash
_.without(DATA, 1, 3, 5);

// Remeda
difference(DATA, [1, 3, 5]);
```

### With duplicates

```ts
const DATA = [2, 1, 2, 3];

// Lodash
_.without(DATA, 1, 2);

// Remeda
filter(DATA, isNot(isIncludedIn([1, 2])));
```

### Distinguishable Types

```ts
const DATA = ["hello", null, "", "world"];

// Lodash
_.without(DATA, null, "");

// Remeda
filter(DATA, isTruthy);
```
