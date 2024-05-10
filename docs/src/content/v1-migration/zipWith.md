# Runtime

The order of parameters in the dataLast invocation has been flipped so that the
second array to zip with is now the first parameter, and the zipping function is
now the second param.

The zipping function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `datum` - A 2-tuple of arrays
the function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have).

If you are using a function reference for the zipping function (and not an
inline arrow function), and that function accepts more than one param you might
run into compile-time (or run-time!) issues because of the extra params being
sent on each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Param reordered

```ts
// Was
pipe(
  [1, 2, 3],
  zipWith((a, b) => a + b, [4, 5, 6]),
);

// Now
pipe(
  [1, 2, 3],
  zipWith([4, 5, 6], (a, b) => a + b),
);
```

### New Params

```ts
// This was previously unavailable
zipWith([1, 2, 3], [4, 5, 6], (itemA, itemB, index) => itemA + itemB - index);
```

### Potential bug

```ts
const DATA_A = [1, 2, 3] as const;
const DATA_B = [4, 5, 6] as const;

function callback(itemA: number, itemB: number, index = 0): boolean {
  return itemA + itemB - index;
}

// Bug
zipWith(A, B, callback); // => [5, 6, 7], Was: [5, 7, 9]

// Fix
zipWith(A, B, (itemA, itemB) => callback(itemA, itemB)); // => [5, 6, 7]
```
