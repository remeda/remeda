import type { Words } from "type-fest";

// @see https://github.com/sindresorhus/type-fest/blob/main/source/internal/characters.d.ts#L5-L31
const WHITESPACE = [
  "\u{9}", // '\t'
  "\u{A}", // '\n'
  "\u{B}", // '\v'
  "\u{C}", // '\f'
  "\u{D}", // '\r'
  "\u{20}", // ' '
  "\u{85}",
  "\u{A0}",
  "\u{1680}",
  "\u{2000}",
  "\u{2001}",
  "\u{2002}",
  "\u{2003}",
  "\u{2004}",
  "\u{2005}",
  "\u{2006}",
  "\u{2007}",
  "\u{2008}",
  "\u{2009}",
  "\u{200A}",
  "\u{2028}",
  "\u{2029}",
  "\u{202F}",
  "\u{205F}",
  "\u{3000}",
  "\u{FEFF}",
] as const;

// @see https://github.com/sindresorhus/type-fest/blob/main/source/internal/characters.d.ts#L33
const WORD_SEPARATORS = new Set(["-", "_", ...WHITESPACE]);

export const words = <S extends string>(
  data: S,
): string extends S ? Array<string> : Words<S> => {
  const results: Array<string> = [];
  let word = "";

  const flush = (): void => {
    if (word.length > 0) {
      results.push(word);
      word = "";
    }
  };

  for (const character of data) {
    if (WORD_SEPARATORS.has(character)) {
      // Separator encountered; flush the current word & exclude the separator.
      flush();
      continue;
    }

    // Detect transitions:
    // 1. Lowercase to uppercase (e.g., "helloWorld")
    if (/[a-z]$/u.test(word) && /[A-Z]/u.test(character)) {
      flush();
    }
    // 2. Uppercase to lowercase following multiple uppercase letters (e.g., "HELLOWorld")
    // When the text transitions from 2 upper case letters to a lower case
    // letter. (one upper case letter is considered part of the word, e.g.
    // "Dog").
    else if (/[A-Z][A-Z]$/u.test(word) && /[a-z]/u.test(character)) {
      const lastCharacter = word.slice(-1);
      word = word.slice(0, -1);
      flush();
      word = lastCharacter;
    }
    // 3. Digit to non-digit or non-digit to digit (e.g., "123abc" or "abc123")
    else if (/\d$/u.test(word) !== /\d/u.test(character)) {
      flush();
    }

    // Add the current character to the current word.
    word += character;
  }

  // Flush any remaining word.
  flush();

  // @ts-expect-error [ts2322] -- TypeScript can't infer this type...
  return results;
};
