#### Renamed

Called [`fromEntries`](/docs/#fromEntries) instead. Also see the migration guide
for [`fromEntries`](/v1/#fromEntries).

Passing the function as a reference for dataLast calls is no longer supported,
call it with no arguments instead.

##### Examples

###### dataFirst

```ts
const DATA = [
  ["a", "b"],
  ["c", "d"],
] as const;

// Was
const result = fromPairs(DATA);
//    ^? Record<string, string>

// Now
const result = fromEntries(DATA);
//    ^? { a: 'b', c: 'd' }
```

###### dataLast

```ts
const DATA = [
  ["a", "b"],
  ["c", "d"],
] as const;

// Was
const result = pipe(DATA, fromPairs);
//    ^? Record<string, string>

// Now
const result = pipe(DATA, fromEntries());
//    ^? { a: 'b', c: 'd' }
```

###### Strict variant

```ts
const DATA = [
  ["a", "b"],
  ["c", "d"],
] as const;

// Was
fromPairs.strict(DATA);

// Now
fromEntries(DATA);
```
