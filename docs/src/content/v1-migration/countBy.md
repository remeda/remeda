# Removed

Replaced with [`filter`](/docs/#filter) using the same predicate, followed by
either the [`Array.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)
prop, or using the [`length`](/docs/#length) utility function on the result.

## Examples

### dataFirst

```ts
// Was
countBy([1, 2, 3, 4], (item) => item % 2 === 0);

// Now
filter([1, 2, 3, 4], (item) => item % 2 === 0).length;

// or
length(filter([1, 2, 3, 4], (item) => item % 2 === 0));
```

### dataLast

```ts
// Was
pipe(
  [1, 2, 3, 4],
  countBy((item) => item % 2 === 0),
);

// Now
pipe(
  [1, 2, 3, 4],
  filter((item) => item % 2 === 0),
  length(),
);
```
