import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { useCallback, useMemo, type ReactNode } from "react";
import { entries, keys, map, only, pickBy, pipe } from "remeda";

type VersionDescriptor = {
  readonly label: string;
  readonly path: string;
};

const VERSION_LABEL = {
  latest: { label: "Latest", path: "/docs" },
  v1: { label: "1.61.0", path: "/v1" },
} as const satisfies Readonly<Record<string, VersionDescriptor>>;

type Version = keyof typeof VERSION_LABEL;

export function VersionSelector({
  pathname,
}: {
  readonly pathname: string;
}): ReactNode {
  console.log(pathname);
  const current = useMemo(() => {
    const trimmed = pathname.replace(/\/$/, "");
    return pipe(
      VERSION_LABEL,
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

      const url = VERSION_LABEL[value].path;
      window.location.href = url;
    },
    [current],
  );

  return (
    <Select value={current ?? ""} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {map(entries(VERSION_LABEL), ([value, { label }]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
