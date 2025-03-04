import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from "lucide-react";
import type { ReactNode } from "react";

export function MigrationBox({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return (
    <Collapsible className="flex flex-col gap-8 rounded-md border border-sky-100 bg-linear-to-tl from-sky-50 to-sky-100 p-3 shadow-xs dark:border-sky-900 dark:from-sky-900 dark:to-sky-950">
      <div className="relative flex items-center">
        <h6 className="text-sm font-semibold tracking-wider text-neutral-800 uppercase dark:text-neutral-200">
          Breaking changes in v2
        </h6>
        <CollapsibleTrigger asChild className="absolute right-0">
          <Button size="sm">
            <span className="sr-only">Expand</span>
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="pt-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}
