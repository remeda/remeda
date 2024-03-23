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

  test("dataLast", () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    };
    const cb = vi.fn<[number, string, typeof data]>();

    expect(pipe(data, forEachObj(cb))).toBe(data);
    expect(cb).toHaveBeenCalledWith(1, "a", data);
    expect(cb).toHaveBeenCalledWith(2, "b", data);
    expect(cb).toHaveBeenCalledWith(3, "c", data);
  });
});
