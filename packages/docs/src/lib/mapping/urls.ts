/**
 * Returns a URL to the location in the library's documentation for the given
 * function name.
 */
export function mappingUrl(library: string, name: string): string | undefined {
  switch (library) {
    case "lodash":
      return `https://lodash.com/docs/4.17.15#${name}`;

    case "ramda":
      return `https://ramdajs.com/docs/#${name}`;

    case "just":
      return `https://anguscroll.com/just/just-${name}`;
  }

  throw new Error(
    `Library '${name}' does not have a URL template to map back to it's documentation page.`,
  );
}
