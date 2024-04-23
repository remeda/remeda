# Renamed

Called [`fromEntries`](/docs/#fromEntries) instead. Also see the migration guide
for [`fromEntries`](/v1/#fromEntries).

The "headless" dataLast form is no longer supported, use the functional style
instead.

## Examples

### dataFirst

```ts
const DATA = [
  ["a", "b"],
  ["c", "d"],
] as const;

// Was
fromPairs(DATA); // => { a: 'b', c: 'd' } (type: Record<string, string>)

// Now
fromEntries(DATA); // => { a: 'b', c: 'd' } (type: { a: 'b', c: 'd' })
```

### dataLast

```ts
const DATA = [
  ["a", "b"],
  ["c", "d"],
] as const;

// Was
pipe(DATA, fromPairs); // => { a: 'b', c: 'd' } (type: Record<string, string>)

// Now
pipe(DATA, fromEntries()); // => { a: 'b', c: 'd' } (type: { a: 'b', c: 'd' })
```

### Strict variant

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
