export function indexByIdentity<T>(items: T[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.toString()] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}
