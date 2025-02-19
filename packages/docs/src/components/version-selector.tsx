import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useMemo, type ReactNode } from "react";
import { entries, keys, map, only, pickBy, pipe } from "@remeda/library";

type VersionDescriptor = {
  readonly label: string;
  readonly path: string;
};

export const VERSIONS = {
  latest: { label: "Latest", path: "/docs" },
  v1: { label: "1.61.0", path: "/v1" },
} as const satisfies Readonly<Record<string, VersionDescriptor>>;

type Version = keyof typeof VERSIONS;

export function VersionSelector({
  pathname,
}: {
  readonly pathname: string;
}): ReactNode {
  const current = useMemo(() => {
    const trimmed = pathname.replace(/\/$/, "");
    return pipe(
      VERSIONS,
      pickBy(({ path }) => path === trimmed),
      keys(),
      only(),
    );
  }, [pathname]);

  const handleValueChange = useCallback(
    (value: Version) => {
      if (value === current) {
        return;
      }

      const url = VERSIONS[value].path;
      globalThis.location.href = url;
    },
    [current],
  );

  return (
    <Select value={current ?? ""} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {map(entries(VERSIONS), ([value, { label }]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
