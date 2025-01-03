---
category: Objects
remeda: merge
---

- Just's `extend` performs an **in-place** merge which mutates the first
  argument. Remeda functions never mutate the arguments. Because of this extra
  care is needed when migrating.
- If you have the `deep` flag enabled use Remeda's [`mergeDeep`](/docs/#mergeDeep)
  instead. Arrays are **not** merged deeply in Remeda, unlike `extend` which
  clones arrays.
- There is no equivalent function for merging of arrays. Extending arrays is
  only relevant for [sparse arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#sparse_arrays)
  which are uncommon. For regular arrays `extend` is similar to [`splice`](/docs/#splice).
- If you are merging more than two objects, use [`mergeAll`](/docs/#mergeAll)
  which takes an array of objects to merge. Notice that this merge is shallow;
  there is no equivalent function in Remeda which would perform a deep merge of
  multiple objects.

### New object

```ts
// Just
const result = extend({}, a, b);

// Remeda
const result = merge(a, b);
```

### Replace

```ts
// Just
const DATA = { ... };
extend(DATA, b);

// Remeda
let DATA = { ... };
DATA = merge(DATA, b);
```

### Deep

```ts
// Just
extend(true /* deep */, a, b);

// Remeda
mergeDeep(a, b);
```

### Arrays

```ts
// Just
const DATA = [...];
extend(DATA, b);

// Remeda
let DATA = [...];
DATA = splice(DATA, 0 /* start */, b.length /* deleteCount */, b /* replacement */);
```

### Multiple objects

```ts
// Just
const DATA = { ... };
extend(DATA, b, c, d);

// Remeda
let DATA = { ... };
DATA = mergeDeep([DATA, b, c, d]);
```
