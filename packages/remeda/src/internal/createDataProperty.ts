/**
 * Defines `key` on `target` as an own property, as an object literal with a
 * computed key does. Assigning to `__proto__` would call the setter inherited
 * from `Object.prototype` instead, which sets the target's prototype to an
 * object or `null` value and ignores any other value. That setter is the only
 * accessor a plain object inherits, so assignment defines every other key the
 * same way, as long as `target` is a plain object and `Object.prototype` is
 * unmodified.
 */
export function createDataProperty<
  Target extends object,
  Key extends keyof Target,
>(target: Target, key: Key, value: Target[Key]): void {
  if (key === "__proto__") {
    Object.defineProperty(target, "__proto__", {
      value,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } else {
    target[key] = value;
  }
}
