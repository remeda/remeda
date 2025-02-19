# Removed

Replaced by composing [`fromEntries`](/docs/#fromEntries) on [`flatMap`](/docs/#flatMap).

## Examples

### dataFirst

```ts
// Was
flatMapToObj([1, 2, 3], (x) => (x % 2 === 1 ? [[String(x), x]] : []));

// Now
fromEntries(flatMap([1, 2, 3], (x) => (x % 2 === 1 ? [[String(x), x]] : [])));
```

### dataFirst (indexed)

```ts
// Was
flatMapToObj.indexed(["a", "b"], (x, index) => [
  [x, index],
  [x + x, index + index],
]);

// Now
fromEntries(
  flatMap(["a", "b"], (x, index) => [
    [x, index],
    [x + x, index + index],
  ]),
);
```

### dataLast

```ts
// Was
pipe(
  [1, 2, 3],
  flatMapToObj((x) => (x % 2 === 1 ? [[String(x), x]] : [])),
);

// Now
pipe(
  [1, 2, 3],
  flatMap((x) => (x % 2 === 1 ? [[String(x), x]] : [])),
  fromEntries(),
);
```

### dataLast (indexed)

```ts
// Was
R.pipe(
  ["a", "b"],
  R.flatMapToObj.indexed((x, i) => [
    [x, i],
    [x + x, i + i],
  ]),
);

// Now
pipe(
  [1, 2, 3],
  flatMap((x, i) => [
    [x, i],
    [x + x, i + i],
  ]),
  fromEntries(),
);
```
