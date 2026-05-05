import type { Signature } from "@/lib/typedoc/schema";
import { Fragment, type ReactNode } from "react";
import { prop } from "remeda";

export function Parameters({
  parameters,
  className,
}: {
  readonly parameters: Signature["parameters"];
  readonly className?: string | undefined;
}): ReactNode {
  return (
    <dl className={className}>
      {parameters?.map(
        ({ name, comment }) =>
          comment !== undefined &&
          comment.summary.length > 0 && (
            <Fragment key={name}>
              <dt className="font-semibold">{name}</dt>
              <dd className="text-muted-foreground">
                {comment.summary.map(prop("text")).join("")}
              </dd>
            </Fragment>
          ),
      )}
    </dl>
  );
}
