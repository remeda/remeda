# Typing

The return type was changed so that the shape of input tuples and arrays is
maintained, and so the order of concatenation is maintained in the output.

## Examples

```ts
const a = [1, 2, 3] as const;
const b = ["hello", "world"] as string[];

const concatenated = R.concat(a, b);
//    ^? [1, 2, 3, ...string[]], was: (string | 1 | 2 | 3)[]
```
