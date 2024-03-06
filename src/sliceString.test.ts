import { sliceString } from "./sliceString";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

describe("indexStart", () => {
  test("empty string, 0 indexStart", () => {
    expect(sliceString(0)("")).toEqual("");
  });

  test("empty string, >0 indexStart", () => {
    expect(sliceString(100)("")).toEqual("");
  });

  test("empty string, <0 indexStart", () => {
    expect(sliceString(-100)("")).toEqual("");
  });

  test("alphabet, 0 indexStart", () => {
    expect(sliceString(0)(ALPHABET)).toEqual(ALPHABET);
  });

  test("alphabet, >0 indexStart, <len", () => {
    expect(sliceString(10)(ALPHABET)).toEqual("klmnopqrstuvwxyz");
  });

  test("alphabet, <0 indexStart, >-len", () => {
    expect(sliceString(-10)(ALPHABET)).toEqual("qrstuvwxyz");
  });

  test("alphabet, >0 indexStart, >len", () => {
    expect(sliceString(100)(ALPHABET)).toEqual("");
  });

  test("alphabet, <0 indexStart, <-len", () => {
    expect(sliceString(-100)(ALPHABET)).toEqual(ALPHABET);
  });
});

describe("indexEnd", () => {
  test("empty string, 0 indexStart, 0 indexEnd", () => {
    expect(sliceString(0, 0)("")).toEqual("");
  });

  test("alphabet, 0 indexStart, 0 indexEnd", () => {
    expect(sliceString(0, 0)(ALPHABET)).toEqual("");
  });

  test("alphabet, 0 indexStart, >indexStart indexEnd <len", () => {
    expect(sliceString(0, 10)(ALPHABET)).toEqual("abcdefghij");
  });

  test("alphabet, 0 indexStart, >indexStart indexEnd >len", () => {
    expect(sliceString(0, 100)(ALPHABET)).toEqual(ALPHABET);
  });

  test("alphabet, 0 indexStart, <indexStart indexEnd >-len", () => {
    expect(sliceString(0, -10)(ALPHABET)).toEqual("abcdefghijklmnop");
  });

  test("alphabet, 0 indexStart <len, <indexStart indexEnd <-len", () => {
    expect(sliceString(0, -100)(ALPHABET)).toEqual("");
  });

  test("alphabet, >0 indexStart <len, >indexStart indexEnd <len", () => {
    expect(sliceString(10, 20)(ALPHABET)).toEqual("klmnopqrst");
  });

  test("alphabet, >0 indexStart <len, >indexStart indexEnd >len", () => {
    expect(sliceString(10, 100)(ALPHABET)).toEqual("klmnopqrstuvwxyz");
  });

  test("alphabet, >0 indexStart <len, <indexStart indexEnd >-len", () => {
    expect(sliceString(10, 5)(ALPHABET)).toEqual("");
  });

  test("alphabet, >0 indexStart <len, <indexStart indexEnd <-len", () => {
    expect(sliceString(10, -100)(ALPHABET)).toEqual("");
  });

  test("alphabet, >0 indexStart >len, >indexStart indexEnd >len", () => {
    expect(sliceString(100, 200)(ALPHABET)).toEqual("");
  });

  test("alphabet, >0 indexStart >len, <indexStart indexEnd >-len", () => {
    expect(sliceString(100, 5)(ALPHABET)).toEqual("");
  });

  test("alphabet, >0 indexStart >len, <indexStart indexEnd <-len", () => {
    expect(sliceString(100, -100)(ALPHABET)).toEqual("");
  });
});
