# Runtime

The function no longer tries to use a `clone` function of the cloned object. It
will only clone based on our own cloning logic. If you want to use an
object's exported `clone` function you will need to call it directly.

We no longer support "headless" invocations. In dataLast invocations call the
function with an empty args list (e.g. `clone()`).

## Examples

### clone function

```ts
type MyType = {
  readonly clone: () => MyType;
}

declare DATA: MyType;

// Was
const cloned = clone(DATA);

// Now
const cloned DATA.clone();
```

### Headless

```ts
// Was
const cloned = map(DATA, clone);

// Now
const cloned = map(DATA, clone());
```
