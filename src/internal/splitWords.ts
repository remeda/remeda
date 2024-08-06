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
const WORD_SEPARATORS = ["-", "_", ...WHITESPACE] as const;

// We are basing our logic on the type definition of SplitWords from type-fest.
// @see https://github.com/sindresorhus/type-fest/blob/main/source/split-words.d.ts
const WORD_SPLITTING_RE = new RegExp(
  [
    // **on** any word separator, these would be removed from the output.
    `[${WORD_SEPARATORS.join("")}]+`,
    // When the text transitions from a non-digit to a digit.
    String.raw`(?<=\D)(?=\d)`,
    // When the text transitions from a digit to a non-digit.
    String.raw`(?<=\d)(?=\D)`,
    // When the text transitions from a lower case to upper case.
    String.raw`(?<=[a-z])(?=[A-Z])`,
    // When the text transitions from 2 upper case letters to a lower case
    // letter. (one upper case letter is considered part of the word, e.g.
    // "Dog").
    String.raw`(?<=[A-Z])(?=[A-Z][a-z])`,
  ].join("|"),
  "u",
);

export const splitWords = (data: string): Array<string> =>
  data.split(WORD_SPLITTING_RE).filter(({ length }) => length > 0);
