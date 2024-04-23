# Typing

If you are already using `entries.strict` simply remove the `.strict` suffix.

The returned type is now stricter and more reflective of the input type. The
returned type supports more than just simple records of string and number keys,
allowing reconstructing complex object types. It does this by taking each
individual tuple in the input type to define a set of output props. If you want
to maintain the same output type cast your input array as `[string, T][]` or
`[number, T][]` (see examples).

## Examples

### Strict Variant

```ts
// Was
fromEntries.strict(["a", 1] as const);

// Now
fromEntries(["a", 1] as const);
```

### Legacy (string keys)

```ts
const DATA = [
  ["a", 123],
  ["b", 456],
] as const;

// Was
fromEntries(DATA);

// Now
fromEntries(DATA as [string, 123 | 456][]);
```

### Legacy (number keys)

```ts
const DATA = [
  [123, "a"],
  [456, "b"],
] as const;

// Was
fromEntries(DATA);

// Now
fromEntries(DATA as [number, "a" | "b"][]);
```
