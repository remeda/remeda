---
title: "Headless Invocation"
category: "Migrating to v2"
slug: "migration-headless"
priority: 30
---

# Headless Invocation

A few single-parameter functions in v1 did not offer a properly curried
"dataLast" implementation and instead suggested using a "headless" version for
"dataLast" cases (e.g., `keys`). This created problems with more advanced types
not being inferred correctly, requiring a properly curried version instead
(e.g., `first`). We felt that this case-by-case difference made your code more
error-prone and confusing. In v2, all single-parameter functions should now be
called with no parameters to get their dataLast implementation.

The only headless functions remaining are type-guards (e.g., `isString`,
`isDefined`).

```ts
// Was
pipe(DATA, keys);
map(DATA, identity);
filter(DATA, isString);

// Now
pipe(DATA, keys());
map(DATA, identity());
filter(DATA, isString); // Not changed!
```

### Migration

Most call sites should now show an error when using the headless function
because TypeScript wouldn't be able to infer the type correctly. However,
because there is no way to deprecate the "headless" nature of a function (it's
just a function-object), you will have to manually search for them. The
functions are: `clone`, `identity`, ~~`fromPairs`~~\*, `keys`, `randomString`,
~~`toPairs`~~\*, and `values`.

_\* These functions have been renamed and their renamed versions already don't
support headless invocation in v1._
