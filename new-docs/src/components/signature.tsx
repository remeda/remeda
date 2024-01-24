import type { ReactNode } from "react";
import {
  Collapsible as CollapsibleRoot,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const Signature = (props: {
  children: ReactNode;
  signature?: ReactNode;
}) => {
  return (
    <CollapsibleRoot>
      <div className="relative flex items-center">
        <div className="flex-1">{props.children}</div>

        <CollapsibleTrigger asChild className="absolute right-0">
          <Button variant="link" size="sm">
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="p-2">{props.signature}</div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
};
