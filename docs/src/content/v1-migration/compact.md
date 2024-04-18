# Removed

Replaced with [`filter`](/docs/#filter) with [`isTruthy`](/docs/#isTruthy) as
the predicate.

## Examples

### dataFirst

```ts
// Was
R.compact([1, null, 3]);

// Now
R.filter([1, null, 3], R.isTruthy);
```

### dataLast

```ts
// Was
R.pipe([1, null, 3], R.compact);

// Now
R.pipe([1, null, 3], R.filter(R.isTruthy));
```
