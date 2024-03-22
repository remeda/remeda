import { mapToObj } from "./mapToObj";
import { pipe } from "./pipe";

describe("data_first", () => {
  it("mapToObj", () => {
    const result = mapToObj([1, 2, 3], (x) => [String(x), x * 2]);
    expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
  });
  it("indexed", () => {
    const result = mapToObj([0, 0, 0], (_, i) => [i, i]);
    expect(result).toEqual({ 0: 0, 1: 1, 2: 2 });
  });
});

describe("data_last", () => {
  it("mapToObj", () => {
    const result = pipe(
      [1, 2, 3],
      mapToObj((x) => [String(x), x * 2]),
    );
    expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
  });
  it("indexed", () => {
    const result = pipe(
      [0, 0, 0],
      mapToObj((_, i) => [i, i]),
    );
    expect(result).toEqual({ 0: 0, 1: 1, 2: 2 });
  });
});
