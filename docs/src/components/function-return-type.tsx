import type { Signature } from "@/lib/typedoc/schema";
import type { ReactNode } from "react";

export function FunctionReturnType({
  type,
  className,
}: {
  readonly type: Signature["type"];
  readonly className?: string | undefined;
}): ReactNode {
  return <div className={className}>{extractReturnType(type)}</div>;
}

function extractReturnType(type: Signature["type"]): string {
  switch (type.type) {
    case "intrinsic":
      return type.name;

    case "array":
      return "Array";

    case "predicate":
      return "boolean";

    case "mapped":
    case "conditional":
      // These only show up in V1!
      return "Object";

    case "indexedAccess":
    case "intersection":
    case "query":
    case "reference":
    case "reflection":
    case "tuple":
    case "union":
      return "Object";
  }
}
