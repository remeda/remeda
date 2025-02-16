import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Signature } from "@/lib/typedoc/schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { type ReactNode } from "react";
import { FunctionReturnType } from "./function-return-type";
import { Parameters } from "./parameters";

export function MethodSignature({
  parameters,
  type,
  children,
}: {
  readonly parameters: Signature["parameters"];
  readonly type: Signature["type"];
  readonly children: ReactNode;
}): ReactNode {
  return (
    <CollapsibleRoot>
      <div className="relative flex items-center">
        <div className="flex-1">{children}</div>
        <CollapsibleTrigger asChild className="absolute right-0">
          <Button
            variant="link"
            size="sm"
            className="text-background dark:text-foreground"
          >
            <span className="sr-only">Expand</span>
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 p-2">
          <div>
            Parameters
            <Parameters
              className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm"
              parameters={parameters}
            />
          </div>
          <div>
            Returns
            <FunctionReturnType className="text-sm font-semibold" type={type} />
          </div>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}
