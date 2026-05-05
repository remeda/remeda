import { CardHeader } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function HeaderCardHeader({
  children,
  ...props
}: ComponentProps<typeof CardHeader>): ReactNode {
  return (
    <CardHeader asChild {...props}>
      <header>{children}</header>
    </CardHeader>
  );
}
