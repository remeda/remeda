# Typing

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The predicate function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have).

If you are using a function _reference_ for the predicate (and not an inline
arrow function), and that function accepts more than one param you might run
into compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Indexed variant removed

```ts
// Was
partition.indexed(array, predicate);

// Now
partition(array, predicate);
```

### Potential bug

```ts
function callback(value: number, index = 0): boolean {
  return (value + index) % 2 === 0;
}

// Bug
partition([1, 2, 3], callback); // => [[], [1, 2, 3]], Was: [[2], [1, 3]]

// Fix
partition([1, 2, 3], (item) => callback(item)); // => [[2], [1, 3]]
```
