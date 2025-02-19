# Removed

Replaced with [`flat`](/docs/#flat), with the optional "depth" param either left
out, or set to **1**.

## Examples

### dataFirst

```ts
// Was
flatten([[1, 2], [3], [4, 5]]);

// Now
flat([[1, 2], [3], [4, 5]]);

// Or
flat([[1, 2], [3], [4, 5]], 1 /* depth */);
```

### dataLast

```ts
// Was
pipe([[1, 2], [3], [4, 5]], flatten());

// Now
pipe([[1, 2], [3], [4, 5]], flat());

// Or
pipe([[1, 2], [3], [4, 5]], flat(1 /* depth */));
```
