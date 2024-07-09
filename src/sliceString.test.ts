import { sliceString } from "./sliceString";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

describe("dataFirst", () => {
  describe("indexStart", () => {
    test("empty string, 0 indexStart", () => {
      expect(sliceString("", 0)).toEqual("");
    });

    test("empty string, >0 indexStart", () => {
      expect(sliceString("", 100)).toEqual("");
    });

    test("empty string, <0 indexStart", () => {
      expect(sliceString("", -100)).toEqual("");
    });

    test("alphabet, 0 indexStart", () => {
      expect(sliceString(ALPHABET, 0)).toEqual(ALPHABET);
    });

    test("alphabet, >0 indexStart, <len", () => {
      expect(sliceString(ALPHABET, 10)).toEqual("klmnopqrstuvwxyz");
    });

    test("alphabet, <0 indexStart, >-len", () => {
      expect(sliceString(ALPHABET, -10)).toEqual("qrstuvwxyz");
    });

    test("alphabet, >0 indexStart, >len", () => {
      expect(sliceString(ALPHABET, 100)).toEqual("");
    });

    test("alphabet, <0 indexStart, <-len", () => {
      expect(sliceString(ALPHABET, -100)).toEqual(ALPHABET);
    });
  });

  describe("indexEnd", () => {
    test("empty string, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString("", 0, 0)).toEqual("");
    });

    test("alphabet, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString(ALPHABET, 0, 0)).toEqual("");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd <len", () => {
      expect(sliceString(ALPHABET, 0, 10)).toEqual("abcdefghij");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 0, 100)).toEqual(ALPHABET);
    });

    test("alphabet, 0 indexStart, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 0, -10)).toEqual("abcdefghijklmnop");
    });

    test("alphabet, 0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 0, -100)).toEqual("");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd <len", () => {
      expect(sliceString(ALPHABET, 10, 20)).toEqual("klmnopqrst");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 10, 100)).toEqual("klmnopqrstuvwxyz");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 10, 5)).toEqual("");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 10, -100)).toEqual("");
    });

    test("alphabet, >0 indexStart >len, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 100, 200)).toEqual("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 100, 5)).toEqual("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 100, -100)).toEqual("");
    });
  });
});

describe("dataLast", () => {
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
});
