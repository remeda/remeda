const LZ_STRING_ENCODING =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";

// LZString algorithm based on lz-string by Pieroxy (MIT license).
// https://github.com/pieroxy/lz-string
export function* decompressLZString(
  charactersStream: Iterable<string>,
): Generator<string> {
  const stream = bitsStream(charactersStream);

  // Initialize the dictionary with the 3 special markers.
  const dictionary = ["<readWord>", "<readDWord>", "<endStream>"];

  let previous;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const numBits = Math.ceil(Math.log2(dictionary.length + 1));
    const bits = readBits(stream, numBits);

    let current;
    switch (bits) {
      case 0:
        // read word marker.
        current = String.fromCharCode(readBits(stream, 8 /* numBits */));
        dictionary.push(current);
        break;

      case 1:
        // read dword marker.
        current = String.fromCharCode(readBits(stream, 16 /* numBits */));
        dictionary.push(current);
        break;

      case 2:
        // End of stream marker.
        return;

      case dictionary.length:
        // KwKwK edge case: code references the entry about to be added.
        if (previous === undefined) {
          throw new Error(
            "Invalid LZString encoding: reference to previous character before it is defined",
          );
        }
        current = previous + (previous.at(0) ?? "");
        break;

      default:
        // Back-reference to an existing dictionary entry.
        current = dictionary[bits];
        if (current === undefined) {
          throw new Error(
            `Invalid dictionary reference at index ${String(bits)}`,
          );
        }
    }

    yield current;
    if (previous !== undefined) {
      dictionary.push(previous + (current.at(0) ?? ""));
    }

    previous = current;
  }
}

function* bitsStream(input: Iterable<string>): Generator<boolean> {
  for (const char of input) {
    const encoding = LZ_STRING_ENCODING.indexOf(char);
    if (encoding === -1) {
      throw new Error(`Invalid character in encoded string: ${char}`);
    }

    for (let bitMask = 0b10_0000; bitMask > 0; bitMask >>= 1) {
      yield (encoding & bitMask) !== 0;
    }
  }
}

function readBits(source: Generator<boolean>, numBits: number): number {
  let bits = 0b0;

  for (let i = 0; i < numBits; i++) {
    const bit = source.next();
    if (bit.done) {
      throw new Error(
        `Unexpected end of input while reading bits (expected ${numBits.toString()} bits)`,
      );
    }

    if (bit.value) {
      bits |= 0b1 << i;
    }
  }

  return bits;
}
