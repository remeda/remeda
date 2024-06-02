export function mappingUrl(library: string, name: string): string | undefined {
  switch (library) {
    case "lodash":
      return `https://lodash.com/docs/4.17.15#${name}`;

    default:
      return;
  }
}
