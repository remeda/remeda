# Typing

The return type was made stricter. If the 2 arrays have different types of
items, or the inputs are tuples, the new output type maintains more of the shape
of the input.

## Examples

```ts
const a = [1, 2, 3] as const;
const b = ["hello", "world"] as string[];

const concatenated = concat(a, b);
//    ^? [1, 2, 3, ...string[]], was: (string | 1 | 2 | 3)[]
```
