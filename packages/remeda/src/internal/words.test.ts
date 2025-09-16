import { describe, expect, test } from "vitest";
import { words } from "./words";

describe("copied from the type-fest tests", () => {
  test.each([
    { input: "", output: [] },
    { input: "a", output: ["a"] },
    { input: "B", output: ["B"] },
    { input: "aa", output: ["aa"] },
    { input: "aB", output: ["a", "B"] },
    { input: "Ba", output: ["Ba"] },
    { input: "BB", output: ["BB"] },
    { input: "aaa", output: ["aaa"] },
    { input: "aaB", output: ["aa", "B"] },
    { input: "aBa", output: ["a", "Ba"] },
    { input: "aBB", output: ["a", "BB"] },
    { input: "Baa", output: ["Baa"] },
    { input: "BaB", output: ["Ba", "B"] },
    { input: "BBa", output: ["B", "Ba"] },
    { input: "BBB", output: ["BBB"] },
    { input: "aaaa", output: ["aaaa"] },
    { input: "aaaB", output: ["aaa", "B"] },
    { input: "aaBa", output: ["aa", "Ba"] },
    { input: "aaBB", output: ["aa", "BB"] },
    { input: "aBaa", output: ["a", "Baa"] },
    { input: "aBaB", output: ["a", "Ba", "B"] },
    { input: "aBBa", output: ["a", "B", "Ba"] },
    { input: "aBBB", output: ["a", "BBB"] },
    { input: "Baaa", output: ["Baaa"] },
    { input: "BaaB", output: ["Baa", "B"] },
    { input: "BaBa", output: ["Ba", "Ba"] },
    { input: "BaBB", output: ["Ba", "BB"] },
    { input: "BBaa", output: ["B", "Baa"] },
    { input: "BBaB", output: ["B", "Ba", "B"] },
    { input: "BBBa", output: ["BB", "Ba"] },
    { input: "BBBB", output: ["BBBB"] },
    { input: "aaaaa", output: ["aaaaa"] },
    { input: "aaaaB", output: ["aaaa", "B"] },
    { input: "aaaBa", output: ["aaa", "Ba"] },
    { input: "aaaBB", output: ["aaa", "BB"] },
    { input: "aaBaa", output: ["aa", "Baa"] },
    { input: "aaBaB", output: ["aa", "Ba", "B"] },
    { input: "aaBBa", output: ["aa", "B", "Ba"] },
    { input: "aaBBB", output: ["aa", "BBB"] },
    { input: "aBaaa", output: ["a", "Baaa"] },
    { input: "aBaaB", output: ["a", "Baa", "B"] },
    { input: "aBaBa", output: ["a", "Ba", "Ba"] },
    { input: "aBaBB", output: ["a", "Ba", "BB"] },
    { input: "aBBaa", output: ["a", "B", "Baa"] },
    { input: "aBBaB", output: ["a", "B", "Ba", "B"] },
    { input: "aBBBa", output: ["a", "BB", "Ba"] },
    { input: "aBBBB", output: ["a", "BBBB"] },
    { input: "Baaaa", output: ["Baaaa"] },
    { input: "BaaaB", output: ["Baaa", "B"] },
    { input: "BaaBa", output: ["Baa", "Ba"] },
    { input: "BaaBB", output: ["Baa", "BB"] },
    { input: "BaBaa", output: ["Ba", "Baa"] },
    { input: "BaBaB", output: ["Ba", "Ba", "B"] },
    { input: "BaBBa", output: ["Ba", "B", "Ba"] },
    { input: "BaBBB", output: ["Ba", "BBB"] },
    { input: "BBaaa", output: ["B", "Baaa"] },
    { input: "BBaaB", output: ["B", "Baa", "B"] },
    { input: "BBaBa", output: ["B", "Ba", "Ba"] },
    { input: "BBaBB", output: ["B", "Ba", "BB"] },
    { input: "BBBaa", output: ["BB", "Baa"] },
    { input: "BBBaB", output: ["BB", "Ba", "B"] },
    { input: "BBBBa", output: ["BBB", "Ba"] },
    { input: "BBBBB", output: ["BBBBB"] },
  ])("case changes: $input", ({ input, output }) => {
    expect(words(input)).toStrictEqual(output);
  });

  test.each([
    { input: "hello world", output: ["hello", "world"] },
    { input: "Hello-world", output: ["Hello", "world"] },
    { input: "hello_world", output: ["hello", "world"] },
    { input: "hello  world", output: ["hello", "world"] },
    { input: "Hello--world", output: ["Hello", "world"] },
    { input: "hello__world", output: ["hello", "world"] },
    { input: "   hello  world", output: ["hello", "world"] },
    { input: "---Hello--world", output: ["Hello", "world"] },
    { input: "___hello__world", output: ["hello", "world"] },
    { input: "hello  world   ", output: ["hello", "world"] },
    { input: "hello\tworld", output: ["hello", "world"] },
    { input: "Hello--world--", output: ["Hello", "world"] },
    { input: "hello__world___", output: ["hello", "world"] },
    { input: "___ hello -__  _world", output: ["hello", "world"] },
    {
      input: "__HelloWorld-HELLOWorld helloWORLD",
      output: ["Hello", "World", "HELLO", "World", "hello", "WORLD"],
    },
    { input: "hello WORLD lowercase", output: ["hello", "WORLD", "lowercase"] },
    { input: "hello WORLD-lowercase", output: ["hello", "WORLD", "lowercase"] },
    { input: "hello WORLD Uppercase", output: ["hello", "WORLD", "Uppercase"] },
  ])("white spaces: $input", ({ input, output }) => {
    expect(words(input)).toStrictEqual(output);
  });

  test.each([
    { input: "item0", output: ["item", "0"] },
    { input: "item01", output: ["item", "01"] },
    { input: "item10", output: ["item", "10"] },
    { input: "item010", output: ["item", "010"] },
    { input: "0item0", output: ["0", "item", "0"] },
    { input: "01item01", output: ["01", "item", "01"] },
    { input: "10item10", output: ["10", "item", "10"] },
    { input: "010item010", output: ["010", "item", "010"] },
    {
      input: "item0_item_1 item -2",
      output: ["item", "0", "item", "1", "item", "2"],
    },
  ])("digits: $input", ({ input, output }) => {
    expect(words(input)).toStrictEqual(output);
  });
});

describe("unicode and special characters", () => {
  test("doesn't break on accented characters", () => {
    expect(words("naïveApproach")).toStrictEqual(["naïve", "Approach"]);
    expect(words("résumé-data")).toStrictEqual(["résumé", "data"]);
  });

  test("doesn't splits at case boundaries with accented characters", () => {
    expect(words("caféWorld")).toStrictEqual(["caféWorld"]);
  });

  test("normalization doesn't matter", () => {
    const data = "caféWorld";
    const nfc = data.normalize("NFC");
    const nfd = data.normalize("NFD");
    const nfkc = data.normalize("NFKC");
    const nfkd = data.normalize("NFKD");

    expect(words(nfc)).toStrictEqual([nfc]);
    expect(words(nfd)).toStrictEqual([nfd]);
    expect(words(nfkc)).toStrictEqual([nfkc]);
    expect(words(nfkd)).toStrictEqual([nfkd]);
  });

  test("treats mixed scripts as single words", () => {
    expect(words("helloМосква")).toStrictEqual(["helloМосква"]);
    expect(words("dataΕλλάδα")).toStrictEqual(["dataΕλλάδα"]);
  });

  test("handles contractions and possessives", () => {
    expect(words("can'tStop")).toStrictEqual(["can't", "Stop"]);
    expect(words("user's-data")).toStrictEqual(["user's", "data"]);
  });

  test("handles curly apostrophes (\u2019)", () => {
    expect(words("user'sData")).toStrictEqual(["user's", "Data"]);
  });

  test("treats emojis as part of words", () => {
    expect(words("hello🎉World")).toStrictEqual(["hello🎉World"]);
  });

  test("treats special Unicode as part of words", () => {
    expect(words("data𝒽ello")).toStrictEqual(["data𝒽ello"]);
  });

  test("preserves combining diacritical marks", () => {
    expect(words("cafe\u0301World")).toStrictEqual(["cafe\u0301World"]);
  });
});
