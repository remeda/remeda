import { CardHeader } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function HeaderCardHeader({
  children,
  ...props
}: ComponentProps<typeof CardHeader>): ReactNode {
  return (
    // We can't inline this within an astro component because in order for the
    // component to be able to pass props on to the raw html element via the
    // `asChild` prop it needs to happen within the context of a React island.
    <CardHeader asChild {...props}>
      <header>{children}</header>
    </CardHeader>
  );
}
