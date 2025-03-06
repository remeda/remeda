# Removed

Replaced with the broader, more general purpose function: [`firstBy`](/docs/#firstBy).
Use it with a single sort function set to sort in descending order (see
example).

The return type of `firstBy` observes the input type and can ensure a defined
result if the input is non-empty.

## Examples

### firstBy (dataFirst)

```ts
// Was
maxBy(DATA, criteria);

// Now
firstBy(DATA, [criteria, "desc"]);
```

### firstBy (dataLast)

```ts
// Was
pipe(DATA, maxBy(criteria));

// Now
pipe(DATA, firstBy([criteria, "desc"]));
```

### Ensured return

```ts
const DATA = [1, 2, 3] as const;

// Was
const result = maxBy(DATA, identity());
//    ^? number | undefined

// Now
const result = firstBy(DATA, [identity(), "desc"]);
//    ^? number
```
