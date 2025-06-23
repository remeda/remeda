---
category: Array
remeda: filter
---

_Not provided by Remeda._

- `without` is implemented in Remeda, for the general case, via a composition of
  [`filter`](/docs#filter), [`isNot`](/docs#isNot), and
  [`isIncludedIn`](/docs#isIncludedIn).

- For cases where the input data is unique (no duplicate values)
  [`difference`](/docs#difference) could also be used as a replacement; but it's
  important to note that `difference` in Remeda is implemented differently than
  in Lodash and behaves differently when the input data does have duplicate
  values.

- Notice that `without` takes a variadic array of items to remove. In Remeda all
  functions take an explicit array instead. You will need to wrap your items in
  an array when migrating, or remove the `...` spread operator if they are
  already in an array.

- For very simple cases where the type of items being removed is easily
  distinguishable from those that remain, simple type-guards like
  [`isDefined`](/docs#isDefined), [`isTruthy`](/docs#isTruthy),
  [isString](/docs#isString) could be used instead.

### General Case

```ts
const DATA = [2, 1, 2, 3];

// Lodash
_.without(DATA, 1, 2);

// Remeda
filter(DATA, isNot(isIncludedIn([1, 2])));
```

### Unique Values

```ts
const DATA = [1, 2, 3, 4, 5, 6];

// Lodash
_.without(DATA, 1, 3, 5);

// Remeda
difference(DATA, [1, 3, 5]);
```

### Distinguishable Types

```ts
const DATA = ["hello", null, "", "world"];

// Lodash
_.without(DATA, null, "");

// Remeda
filter(DATA, isTruthy);
```
