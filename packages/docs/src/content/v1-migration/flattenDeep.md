# Removed

Replaced with [`flat`](/docs/#flat), with the "depth" param set to **>1**.

The typing of `flattenDeep` was broken after 4 levels of depth, while the
runtime logic was unlimited. We recommend setting the depth to **4** while
migrating if you aren't sure what value to use.

For the best typing for a fully flattened array (unlimited depth) use a big,
constant number (like 50), and not `Number.POSITIVE_INFINITY`.

## Examples

### dataFirst

```ts
// Was
flattenDeep([
  [1, 2],
  [[3], [4, 5]],
]);

// Now
flat([[1, 2], [3], [4, 5]], 4 /* depth */);
```

### dataLast

```ts
// Was
pipe(
  [
    [1, 2],
    [[3], [4, 5]],
  ],
  flattenDeep(),
);

// Now
pipe(
  [
    [1, 2],
    [[3], [4, 5]],
  ],
  flat(4 /* depth */),
);
```

### Unlimited depth

```ts
pipe(
  [
    [1, 2],
    [[3], [4, 5]],
  ],

  // Don't use:
  flat(Number.POSITIVE_INFINITY),

  // Use:
  flat(50 /* depth */),
);
```
