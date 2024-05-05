import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface MigrationBoxProps {
  children: ReactNode;
  hasMigration: boolean;
}

export const MigrationBox = ({ children, hasMigration }: MigrationBoxProps) => {
  if (!hasMigration) {
    return (
      <div className="flex flex-col gap-8 rounded-md border border-emerald-100 bg-gradient-to-tl from-emerald-50 to-emerald-100 p-3 shadow-sm dark:border-emerald-900 dark:from-emerald-900 dark:to-emerald-950">
        <h6 className="text-sm text-neutral-800 dark:text-neutral-200">
          No breaking changes.
        </h6>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 rounded-md border border-sky-100 bg-gradient-to-tl from-sky-50 to-sky-100 p-3 shadow-sm dark:border-sky-900 dark:from-sky-900 dark:to-sky-950">
      <CollapsibleRoot>
        <div className="relative flex items-center">
          <h6 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Breaking changes in v2
          </h6>

          <CollapsibleTrigger asChild className="absolute right-0">
            <Button size="sm">
              <span className="sr-only">Expand</span>
              <CaretSortIcon className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-4">{children}</CollapsibleContent>
      </CollapsibleRoot>
    </div>
  );
};
