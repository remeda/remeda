---
title: "Renamed and Removed"
category: "Migrating to v2"
slug: "migration-removed"
priority: 40
---

# Renamed and Removed

## Removed

To offer the best possible functions, we deemed several functions as redundant
when they could be easily replaced with other existing functions, resulting in
code of the same length. In all these cases, the replacement is a composite of
at most three functions.

```ts
// Was
compact(DATA);

// Now
filter(DATA, isTruthy);
```

Other functions were removed because their logic was either split into several
other functions or merged into a more general-purpose tool to allow better code
reuse and improved typing.

```ts
// Was
flatten(DATA);
flattenDeep(DATA);

// Now
flat(DATA);
flat(DATA, 10);
```

## Renamed

Remeda took a lot of its early inspiration from Lodash and Ramda. Many functions
were named similarly to their equivalents in those libraries, but these names
don't always align with the names chosen by the ECMAScript standard. We chose to
prefer the standard names.

```ts
// Was
pipe(DATA, toPairs(), ..., fromPairs());

// Now
pipe(DATA, entries(), ..., fromEntries())
```

We also decided to improve some names by dropping abbreviations and partial
spellings in favor of proper English words.

```ts
// Was
uniq(DATA);

// Now
unique(DATA);
```

### Migration

The latest versions of Remeda v1 have all renamed and removed functions
deprecated with suggestions for how to migrate. Doing this while still in v1
would make it easier to replace them one-by-one. Otherwise, this document has a
deprecated section with migration instructions too.
