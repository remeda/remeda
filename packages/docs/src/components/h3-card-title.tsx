import { CardTitle } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function H3CardTitle({
  children,
  ...props
}: ComponentProps<typeof CardTitle>): ReactNode {
  return (
    <CardTitle asChild {...props}>
      <h3>{children}</h3>
    </CardTitle>
  );
}
