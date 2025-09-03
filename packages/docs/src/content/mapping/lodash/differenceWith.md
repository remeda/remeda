---
category: Array
remeda: differenceWith
---

- Lodash's `differenceWith` accepts a variadic list of values arrays which are
  then effectively flattened, but Remeda only accepts a single values array;
  Multiple arrays need to be spread manually instead.

- Lodash accepts `null` and `undefined` values for the array (and treats them as
  an empty array). In Remeda this nullish value needs to be handled explicitly
  either by skipping the call to `differenceWith`, or by coalescing the input to
  an empty array.

- When the `comparator` parameter is not provided to the Lodash `differenceWith`
  function (or is provided as `undefined`) it behaves like a call to
  [`difference`](/migrate/lodash#difference).

### Single exclusion array

```ts
// Lodash
_.differenceWith(DATA, values, comparator);

// Remeda
differenceWith(DATA, values, comparator);
```

### Multiple exclusion arrays

```ts
// Lodash
_.differenceWith(DATA, a, b, c, comparator);

// Remeda
differenceWith(DATA, [...a, ...b, ...c], comparator);
```

### Nullish inputs

```ts
// Lodash
_.differenceWith(DATA, values, comparator);

// Remeda
isNonNullish(DATA) ? differenceWith(DATA, values, comparator) : [];

// Or
differenceWith(DATA ?? [], values, comparator);
```

### Missing iteratee function

```ts
// Lodash
_.differenceWith(DATA, values);

// Convert to Lodash's `difference` and then refer to the `difference` migration
// docs
_.difference(DATA, values);
```
