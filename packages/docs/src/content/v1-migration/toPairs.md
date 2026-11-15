#### Renamed

Called [`entries`](/docs/#entries) instead. Also see the migration guide for
[`entries`](/v1/#entries).

Passing the function as a reference for dataLast calls is no longer supported,
call it with no arguments instead.

##### Examples

###### dataFirst

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
const result = toPairs(DATA);
//    ^? [string, "b" | "d"][]

// Now
const result = entries(DATA);
//    ^? (["a", "b"] | ["c", "d"])[]
```

###### dataLast

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
const result = pipe(DATA, toPairs);
//    ^? [string, "b" | "d"][]

// Now
const result = pipe(DATA, entries());
//    ^? (["a", "b"] | ["c", "d"])[]
```

###### Strict variant

```ts
const DATA = { a: "b", c: "d" } as const;

// Was
toPairs.strict(DATA);

// Now
entries(DATA);
```
