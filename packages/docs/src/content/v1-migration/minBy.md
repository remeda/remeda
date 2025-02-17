# Removed

Replaced with the broader, more general purpose function: [`firstBy`](/docs/#firstBy).
Use it with a single sort function set (see example).

The return type of `firstBy` observes the input type and can ensure a defined
result if the input is non-empty.

## Examples

### firstBy (dataFirst)

```ts
// Was
minBy(DATA, criteria);

// Now
firstBy(DATA, criteria);
```

### firstBy (dataLast)

```ts
// Was
pipe(DATA, minBy(criteria));

// Now
pipe(DATA, firstBy(criteria));
```

### Ensured return

```ts
const DATA = [1, 2, 3] as const;

// Was
const result = minBy(DATA, identity());
//    ^? number | undefined

// Now
const result = firstBy(DATA, identity());
//    ^? number
```
