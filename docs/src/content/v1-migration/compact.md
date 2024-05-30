# Removed

Replaced with [`filter`](/docs/#filter) with [`isTruthy`](/docs/#isTruthy) as
the predicate.

## Examples

### dataFirst

```ts
// Was
compact([1, null, 3]);

// Now
filter([1, null, 3], isTruthy);
```

### dataLast

```ts
// Was
pipe([1, null, 3], compact);

// Now
pipe([1, null, 3], filter(isTruthy));
```
