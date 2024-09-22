import { sliceString } from "./sliceString";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

describe("dataFirst", () => {
  describe("indexStart", () => {
    test("empty string, 0 indexStart", () => {
      expect(sliceString("", 0)).toBe("");
    });

    test("empty string, >0 indexStart", () => {
      expect(sliceString("", 100)).toBe("");
    });

    test("empty string, <0 indexStart", () => {
      expect(sliceString("", -100)).toBe("");
    });

    test("alphabet, 0 indexStart", () => {
      expect(sliceString(ALPHABET, 0)).toStrictEqual(ALPHABET);
    });

    test("alphabet, >0 indexStart, <len", () => {
      expect(sliceString(ALPHABET, 10)).toBe("klmnopqrstuvwxyz");
    });

    test("alphabet, <0 indexStart, >-len", () => {
      expect(sliceString(ALPHABET, -10)).toBe("qrstuvwxyz");
    });

    test("alphabet, >0 indexStart, >len", () => {
      expect(sliceString(ALPHABET, 100)).toBe("");
    });

    test("alphabet, <0 indexStart, <-len", () => {
      expect(sliceString(ALPHABET, -100)).toStrictEqual(ALPHABET);
    });
  });

  describe("indexEnd", () => {
    test("empty string, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString("", 0, 0)).toBe("");
    });

    test("alphabet, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString(ALPHABET, 0, 0)).toBe("");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd <len", () => {
      expect(sliceString(ALPHABET, 0, 10)).toBe("abcdefghij");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 0, 100)).toStrictEqual(ALPHABET);
    });

    test("alphabet, 0 indexStart, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 0, -10)).toBe("abcdefghijklmnop");
    });

    test("alphabet, 0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 0, -100)).toBe("");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd <len", () => {
      expect(sliceString(ALPHABET, 10, 20)).toBe("klmnopqrst");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 10, 100)).toBe("klmnopqrstuvwxyz");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 10, 5)).toBe("");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 10, -100)).toBe("");
    });

    test("alphabet, >0 indexStart >len, >indexStart indexEnd >len", () => {
      expect(sliceString(ALPHABET, 100, 200)).toBe("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd >-len", () => {
      expect(sliceString(ALPHABET, 100, 5)).toBe("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd <-len", () => {
      expect(sliceString(ALPHABET, 100, -100)).toBe("");
    });
  });
});

describe("dataLast", () => {
  describe("indexStart", () => {
    test("empty string, 0 indexStart", () => {
      expect(sliceString(0)("")).toBe("");
    });

    test("empty string, >0 indexStart", () => {
      expect(sliceString(100)("")).toBe("");
    });

    test("empty string, <0 indexStart", () => {
      expect(sliceString(-100)("")).toBe("");
    });

    test("alphabet, 0 indexStart", () => {
      expect(sliceString(0)(ALPHABET)).toStrictEqual(ALPHABET);
    });

    test("alphabet, >0 indexStart, <len", () => {
      expect(sliceString(10)(ALPHABET)).toBe("klmnopqrstuvwxyz");
    });

    test("alphabet, <0 indexStart, >-len", () => {
      expect(sliceString(-10)(ALPHABET)).toBe("qrstuvwxyz");
    });

    test("alphabet, >0 indexStart, >len", () => {
      expect(sliceString(100)(ALPHABET)).toBe("");
    });

    test("alphabet, <0 indexStart, <-len", () => {
      expect(sliceString(-100)(ALPHABET)).toStrictEqual(ALPHABET);
    });
  });

  describe("indexEnd", () => {
    test("empty string, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString(0, 0)("")).toBe("");
    });

    test("alphabet, 0 indexStart, 0 indexEnd", () => {
      expect(sliceString(0, 0)(ALPHABET)).toBe("");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd <len", () => {
      expect(sliceString(0, 10)(ALPHABET)).toBe("abcdefghij");
    });

    test("alphabet, 0 indexStart, >indexStart indexEnd >len", () => {
      expect(sliceString(0, 100)(ALPHABET)).toStrictEqual(ALPHABET);
    });

    test("alphabet, 0 indexStart, <indexStart indexEnd >-len", () => {
      expect(sliceString(0, -10)(ALPHABET)).toBe("abcdefghijklmnop");
    });

    test("alphabet, 0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(0, -100)(ALPHABET)).toBe("");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd <len", () => {
      expect(sliceString(10, 20)(ALPHABET)).toBe("klmnopqrst");
    });

    test("alphabet, >0 indexStart <len, >indexStart indexEnd >len", () => {
      expect(sliceString(10, 100)(ALPHABET)).toBe("klmnopqrstuvwxyz");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd >-len", () => {
      expect(sliceString(10, 5)(ALPHABET)).toBe("");
    });

    test("alphabet, >0 indexStart <len, <indexStart indexEnd <-len", () => {
      expect(sliceString(10, -100)(ALPHABET)).toBe("");
    });

    test("alphabet, >0 indexStart >len, >indexStart indexEnd >len", () => {
      expect(sliceString(100, 200)(ALPHABET)).toBe("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd >-len", () => {
      expect(sliceString(100, 5)(ALPHABET)).toBe("");
    });

    test("alphabet, >0 indexStart >len, <indexStart indexEnd <-len", () => {
      expect(sliceString(100, -100)(ALPHABET)).toBe("");
    });
  });
});
