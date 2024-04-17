# Renamed

Called [`piped`](/docs/#piped) instead.

## Example

```ts
// Was
R.createPipe(map(mapper), filter(predicate));

// Now
R.piped(map(mapper), filter(predicate));
```
