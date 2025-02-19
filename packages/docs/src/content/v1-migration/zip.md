# Typing

If you weren't using the `strict` variant, The returned type is now stricter by
taking the positional type of each item in tuples correctly, allowing the
**types** themselves to be zipped together, creating a combined tuple as output.
If you are zipping simple arrays the result is unchanged. If you are already
using the `strict` variant simply remove the `.strict` suffix.

## Examples

### Strict

```ts
// Was
zip.strict(a, b);

// Now
zip(a, b);
```

### Better typing

```ts
const A = [1, 2, 3] as const;
const B = ["a", "b", "c"] as const;

// Was
const result = zip(A, B);
//    ^? [1 | 2 | 3, "a" | "b" | "c"][]

// Now
const result = zip(A, B);
//    ^? [[1, "a"], [2, "b"], [3, "c"]]
```
