/**
 * Defines `key` on `target` as an own property, as an object literal with a
 * computed key does. Assigning to `__proto__` would call the setter inherited
 * from `Object.prototype` instead, which ignores primitive values and replaces
 * the target's prototype with object values.
 */
export function createDataProperty<
  Target extends object,
  Key extends keyof Target,
>(target: Target, key: Key, value: Target[Key]): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    target[key] = value;
  }
}
