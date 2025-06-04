import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Signature } from "@/lib/typedoc/schema";
import { ChevronsUpDownIcon } from "lucide-react";
import type { ReactNode } from "react";
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
    <Collapsible>
      <div className="relative flex items-center">
        {children}
        <CollapsibleTrigger className="absolute right-0 mr-2 text-background dark:text-foreground">
          <span className="sr-only">Expand</span>
          <ChevronsUpDownIcon className="size-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-3 p-2">
        <section>
          <h6>Parameters</h6>
          <Parameters
            className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm"
            parameters={parameters}
          />
        </section>
        <section>
          <h6>Returns</h6>
          <FunctionReturnType className="text-sm font-semibold" type={type} />
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}
