---
category: Array
---

_Not provided by Remeda._

**CAUTION**: `pullAllWith` mutates the input array _in-place_! All functions in
Remeda are [_pure_](https://en.wikipedia.org/wiki/Pure_function) and never
mutate the input. These mutations might introduce side-effects and implicit
dependencies in your codebase that need to be handled before migrating to
Remeda!

- `pullAllWith` is equivalent to Lodash's `differenceWith` function. To migrate
  to Remeda first migrate calls to Lodash `_.differenceWith` and then use the
  migration docs for [`differenceWith`](/migrate/lodash#differenceWith) to
  complete the migration. **IMPORTANT**: The Remeda `differenceWith` function
  **isn't** a drop-in replacement for the Lodash `_.differenceWith` function, we
  do **not** recommend migrating directly from `pullAllWith` to Remeda's
  `differenceWith`.

- If the mutability of the input array is desired then make sure the variable is
  assignable (e.g., using `let` instead of `const`), and assign back the result
  of `differenceWith` back to it. Note that if the input array is part of an
  object or nested array, you will need to manually reconstruct this _outer_
  object with the updated array manually.

- If mutability wasn't desired, and instead the input was cloned (shallow)
  before calling `pullAllWith`, that cloning should now be skipped.

### In-place mutation

```ts
// pullAllWith
const DATA = [{ x: 1 }, { x: 2 }, { x: 3 }];
_.pullAllWith(DATA, values, comparator);

// differenceWith
let DATA = [{ x: 1 }, { x: 2 }, { x: 3 }];
DATA = _.differenceWith(DATA, values, comparator);
```

### Non-mutating usage

```ts
// pullAllWith
const pulled = _.pullAllWith([...DATA], values, comparator);

// differenceWith
const pulled = _.differenceWith(DATA, values, comparator);
```

### Nested inside an object

```ts
// pullAllWith
const DATA = { items: [{ x: 1 }, { x: 2 }], meta: "info" };
_.pullAllWith(DATA.items, values, comparator);

// differenceWith
let DATA = { items: [{ x: 1 }, { x: 2 }], meta: "info" };
DATA = { ...DATA, items: _.differenceWith(DATA.items, values, comparator) };
```
