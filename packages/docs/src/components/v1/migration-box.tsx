import { ChevronsUpDownIcon } from "lucide-react";
import type { ReactNode } from "react";

export function MigrationBox({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return (
    <details className="group flex flex-col gap-8 rounded-md border border-sky-100 bg-linear-to-tl from-sky-50 to-sky-100 p-3 shadow-xs dark:border-sky-900 dark:from-sky-900 dark:to-sky-950">
      <summary className="relative flex cursor-pointer list-none items-center text-sm font-semibold tracking-wider text-neutral-800 uppercase dark:text-neutral-200 [&::-webkit-details-marker]:hidden">
        Breaking changes in v2
        <ChevronsUpDownIcon className="absolute right-0 size-4" />
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}
