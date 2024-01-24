import { CaretSortIcon } from "@radix-ui/react-icons";
import { Fragment, type ReactNode } from "react";

import {
  Collapsible as CollapsibleRoot,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { FunctionData } from "@/data";

export const MethodSignature = ({
  args,
  returns,
  children,
}: {
  children: ReactNode;
  args: FunctionData["methods"][number]["args"];
  returns: FunctionData["methods"][number]["returns"];
}) => {
  return (
    <CollapsibleRoot>
      <div className="relative flex items-center">
        <div className="flex-1">{children}</div>

        <CollapsibleTrigger asChild className="absolute right-0">
          <Button variant="link" size="sm">
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col gap-3 p-2">
          <div>
            Parameters
            <dl className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm">
              {args.map((arg) => (
                <Fragment key={arg.name}>
                  <dt className="font-semibold">{arg.name}</dt>
                  <dd className="text-muted-foreground">{arg.description}</dd>
                </Fragment>
              ))}
            </dl>
          </div>

          <div>
            Returns
            <div className="text-sm font-semibold">{returns.name}</div>
          </div>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
};
