# Typing

If you weren't using the `strict` variant, the return type is now stricter when
called on a tuple; instead of just an array, the shape of the tuple would be
mirrored in the output (so if your input is a non-empty array, your output would
also be a non-empty array). If you are already using `strict` simply remove the
`.strict` suffix.

## Examples

### Strict variant removed

```ts
// Was
sortBy.strict([1, 2, 3], identity());

// Now
sortBy([1, 2, 3], identity());
```

### Preserves input shape

```ts
const DATA = [1, true, "hello"] as [number, boolean, ...string[]];

const result = sortBy(DATA, identity());
//    ^? [number | boolean | string, number | boolean | string, ...(number | boolean | string)[]]
//  Was: (number | boolean | string)[]
```
