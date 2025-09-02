---
category: Array
remeda: difference
---

- Remeda's `difference` treats the inputs as multisets/bags which respect
  **item duplication**, whereas in Lodash all matching values are filtered out.
  This means Remeda removes **only one copy** of each matching item, while
  Lodash removes **all copies**.

- When the input arrays might contain duplicates and you want to filter all
  values use a composition of [`filter`](/docs#filter), [`isNot`](/docs#isNot),
  and [`isIncludedIn`](/docs#isIncludedIn) to replicate the Lodash semantics.

- Lodash's `difference` accepts multiple arrays as separate arguments and
  flattens them, while Remeda's `difference` takes exactly two arrays.

- Lodash supports calling `difference` trivially, with no exclusion array at
  all which results in a shallow clone of the input array. In Remeda the
  exclusion array is required.

- Lodash accepts `null` and `undefined` values for the array (and treats them as
  an empty array). In Remeda this nullish value needs to be handled explicitly
  either by skipping the call to `difference`, or by coalescing the input to an
  empty array.

### Without duplicate values (unique)

```ts
// Lodash
_.difference(uniqueData, uniqueValues);

// Remeda
difference(uniqueData, uniqueValues);
```

### With duplicate values

```ts
// Lodash
_.difference(dataWithDuplicates, uniqueValues);
_.difference(uniqueData, valuesWithDuplicates);
_.difference(dataWithDuplicates, valuesWithDuplicates);

// Remeda
filter(dataWithDuplicates, isNot(isIncludedIn(uniqueValues)));
filter(uniqueData, isNot(isIncludedIn(valuesWithDuplicates)));
filter(dataWithDuplicates, isNot(isIncludedIn(valuesWithDuplicates)));

// valuesWithDuplicates doesn't need to be deduped when used inside
// `isIncludedIn`, but can be for efficiency if needed via `unique`
filter(dataWithDuplicates, isNot(isIncludedIn(unique(valuesWithDuplicates))));
```

### Multiple exclusion arrays

```ts
// Lodash
_.difference(DATA, a, b, c);

// Remeda
difference(DATA, [...a, ...b, ...c]);
```

### Missing 2nd (exclusions) parameter

```ts
// Lodash
_.difference(DATA);

// Remeda
difference(DATA, []);

// Or directly via Native JS:
[...DATA];
```

### Nullish inputs

```ts
// Lodash
_.difference(DATA, values);

// Remeda
isNonNullish(DATA) ? difference(DATA, values) : [];

// Or
difference(DATA ?? [], values);
```
