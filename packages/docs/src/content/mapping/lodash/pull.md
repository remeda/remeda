---
category: Array
---

_Not provided by Remeda._

**CAUTION**: `pull` mutates the input array _in-place_! All functions in Remeda
are [_pure_](https://en.wikipedia.org/wiki/Pure_function) and never mutate the
input. These mutations might introduce side-effects and implicit dependencies in
your codebase that need to be handled before migrating to Remeda!

- `pull` is equivalent to Lodash's `difference` function. To migrate to Remeda
  first migrate calls to Lodash `_.difference` and then use the migration docs
  for [`difference`](/#difference) to complete the migration. **IMPORTANT**: The
  Remeda `difference` function **isn't** a drop-in replacement for the Lodash
  `_.difference` function, we do **not** recommend migrating directly from
  `pull` to Remeda's `difference`.

- `pull` takes a variadic array of items to remove; `difference` take an
  explicit array instead. You will need to wrap your items in an array when
  migrating.

- If the mutability of the input array is desired then make sure the variable is
  assignable (e.g., using `let` instead of `const`), and assign back the result
  of `difference` back to it. Note that if the input array is part of an object
  or nested array, you will need to manually reconstruct this _outer_ object
  with the updated array manually.

- If mutability wasn't desired, and instead the input was cloned (shallow)
  before calling `pull`, that cloning should now be skipped.

### Exclusion Items

```ts
// pull
_.pull(DATA, a, b, c, ...additional);

// difference
_.difference(DATA, [a, b, c, ...additional]);
```

### In-place mutation

```ts
// pull
const DATA = ["a", "b", "c", "d"];
_.pull(DATA, ...values);

// difference
let DATA = ["a", "b", "c", "d"];
DATA = _.difference(DATA, values);
```

### Non-mutating usage

```ts
// pull
const pulled = _.pull([...DATA], ...values);

// difference
const pulled = _.difference(DATA, values);
```

### Nested inside an object

```ts
// pull
const DATA = { a: ["a", "b", "c"], b: "hello, world" };
_.pull(DATA.a, ...values);

// difference
let DATA = { a: ["a", "b", "c"], b: "hello, world" };
DATA = { ...DATA, a: _.difference(DATA.a, values) };
```
