import { forEachObj } from "./forEachObj";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    };
    const cb = vi.fn();

    forEachObj(data, cb);

    expect(cb).toHaveBeenCalledWith(1, "a", data);
    expect(cb).toHaveBeenCalledWith(2, "b", data);
    expect(cb).toHaveBeenCalledWith(3, "c", data);
  });

  test("doesn't run on symbol keys", () => {
    const data = { [Symbol("a")]: 4 };
    const cb = vi.fn();

    forEachObj(data, cb);

    expect(cb).toHaveBeenCalledTimes(0);
  });

  test("number keys are translated to string", () => {
    const data = { 123: 456 };
    forEachObj(data, (value, key) => {
      expect(key).toBe("123");
      expect(value).toBe(456);
    });
  });

  test("dataLast", () => {
    const data = { a: 1, b: 2, c: 3 };
    const cb = vi.fn();

    expect(pipe(data, forEachObj(cb))).toBe(data);
    expect(cb).toHaveBeenCalledWith(1, "a", data);
    expect(cb).toHaveBeenCalledWith(2, "b", data);
    expect(cb).toHaveBeenCalledWith(3, "c", data);
  });
});
