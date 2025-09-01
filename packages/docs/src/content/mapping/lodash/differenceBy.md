---
category: Array
remeda: filter
---

_Not provided by Remeda._

- Use a composition based on [`filter`](/docs#filter), [`isNot`](/docs#isNot)
  [`isIncludedIn`](/docs#isIncludedIn), and [`map`](/docs#map) to recreate the
  logic for `differenceBy`.

- Additionally, when the iteratee parameter is defined as a _property name_, use
  [`prop`](/docs#prop) as the iteratee _function_ instead.

- Lodash accepts `null` and `undefined` values for the array (and treats them as
  an empty array). In Remeda this nullish value needs to be handled explicitly
  either by skipping the call to `differenceBy`, or by coalescing the input to
  an empty array.

- When the `iteratee` parameter is not provided to the Lodash `differenceBy`
  function (or is provided as `undefined`) it behaves like a call to
  [`difference`](/#difference).

### Function iteratee

```ts
// Lodash
_.differenceBy(DATA, values, iteratee);

// Remeda
filter(DATA, piped(iteratee, isNot(isIncludedIn(map(values, iteratee)))));

// the mapped values don't need to be deduped when used inside `isIncludedIn`,
// but could be for efficiency if needed via `unique`
filter(
  DATA,
  piped(iteratee, isNot(isIncludedIn(unique(map(values, iteratee))))),
);
```

### Property iteratee

```ts
// Lodash
_.differenceBy(DATA, values, "x");

// Remeda
filter(DATA, piped(prop("x"), isNot(isIncludedIn(map(values, prop("x"))))));

// the mapped values don't need to be deduped when used inside `isIncludedIn`,
// but could be for efficiency if needed via `unique`
filter(
  DATA,
  piped(prop("x"), isNot(isIncludedIn(unique(map(values, prop("x")))))),
);
```

### Multiple exclusion arrays

```ts
// Lodash
_.differenceBy(DATA, a, b, c, iteratee);

// Remeda
filter(
  DATA,
  piped(iteratee, isNot(isIncludedIn(map([...a, ...b, ...c], iteratee)))),
);

// the mapped values don't need to be deduped when used inside `isIncludedIn`,
// but could be for efficiency if needed via `unique`
filter(
  DATA,
  piped(
    iteratee,
    isNot(isIncludedIn(unique(map([...a, ...b, ...c], iteratee)))),
  ),
);
```

### Nullish inputs

```ts
// Lodash
_.differenceBy(DATA, values, iteratee);

// Remeda
isNonNullish(DATA)
  ? filter(DATA, piped(iteratee, isNot(isIncludedIn(map(values, iteratee)))))
  : [];

// Or
filter(DATA ?? [], piped(iteratee, isNot(isIncludedIn(map(values, iteratee)))));
```

### Missing iteratee function

```ts
// Lodash
_.differenceBy(DATA, values);

// Convert to Lodash's `difference` and then refer to the `difference` migration
// docs
_.difference(DATA, values);
```
