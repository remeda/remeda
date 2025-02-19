# Renamed

Called [`entries`](/docs/#entries) instead. Also see the migration guide for
[`entries`](/v1/#entries).

The "headless" dataLast form is no longer supported, use the functional style
instead.

## Examples

### dataFirst

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
const result = toPairs(DATA);
//    ^? [string, "b" | "d"][]

// Now
const result = entries(DATA);
//    ^? (["a", "b"] | ["c", "d"])[]
```

### dataLast

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
const result = pipe(DATA, toPairs);
//    ^? [string, "b" | "d"][]

// Now
const result = pipe(DATA, entries());
//    ^? (["a", "b"] | ["c", "d"])[]
```

### Strict variant

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
toPairs.strict(DATA);

// Now
entries(DATA);
```
