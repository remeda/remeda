# Removed

Replaced with [`filter`](/docs/#filter) using the same predicate, followed by
either the [`Array.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)
prop, or using the [`length`](/docs/#length) utility function on the result.

## Examples

### dataFirst

```ts
// Was
R.countBy([1, 2, 3, 4], (item) => item % 2 === 0);

// Now
R.filter([1, 2, 3, 4], (item) => item % 2 === 0).length;

// or
R.length(R.filter([1, 2, 3, 4], (item) => item % 2 === 0));
```

### dataLast

```ts
// Was
R.pipe(
  [1, 2, 3, 4],
  R.countBy((item) => item % 2 === 0),
);

// Now
R.pipe(
  [1, 2, 3, 4],
  R.filter((item) => item % 2 === 0),
  R.length(),
);
```
