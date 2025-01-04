export const ALL_LIBRARIES = ["lodash", "ramda", "just"] as const;
export type Library = (typeof ALL_LIBRARIES)[number];

export function mappingUrl(library: Library, name: string): string {
  switch (library) {
    case "lodash":
      return `https://lodash.com/docs/4.17.15#${name}`;

    case "ramda":
      return `https://ramdajs.com/docs/#${name}`;

    case "just":
      return `https://anguscroll.com/just/just-${name}`;
  }
}
