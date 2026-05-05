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
    <details>
      <summary className="relative flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden">
        {children}
        <ChevronsUpDownIcon className="absolute right-0 mr-2 size-4 text-background dark:text-foreground" />
      </summary>
      <div className="flex flex-col gap-3 p-2">
        <section>
          <h5>Parameters</h5>
          <Parameters
            className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm"
            parameters={parameters}
          />
        </section>
        <section>
          <h5>Returns</h5>
          <FunctionReturnType className="text-sm font-semibold" type={type} />
        </section>
      </div>
    </details>
  );
}
