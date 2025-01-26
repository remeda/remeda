import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type {
  SignatureParameters,
  SignatureType,
} from "@/content/functions/schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Fragment, type ReactNode } from "react";
import { prop } from "remeda";

export function MethodSignature({
  parameters,
  type,
  children,
}: {
  readonly parameters: SignatureParameters | undefined;
  readonly type: SignatureType;
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
            <dl className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm">
              {parameters?.map(({ name, comment }) => (
                <Fragment key={name}>
                  <dt className="font-semibold">{name}</dt>
                  <dd className="text-muted-foreground">
                    {comment?.summary === undefined ||
                    comment.summary.length === 0
                      ? undefined
                      : comment.summary.map(prop("text")).join("")}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
          <div>
            Returns
            <div className="text-sm font-semibold">
              {extractReturnType(type)}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

function extractReturnType(type: SignatureType): string {
  switch (type.type) {
    case "intrinsic":
      return type.name;

    case "array":
      return "Array";

    case "predicate":
      return "boolean";

    case "conditional":
    case "indexedAccess":
    case "intersection":
    case "mapped":
    case "query":
    case "reference":
    case "reflection":
    case "tuple":
    case "union":
      return "Object";
  }
}
