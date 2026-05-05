import { CardTitle } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function H3CardTitle({
  children,
  ...props
}: ComponentProps<typeof CardTitle>): ReactNode {
  return (
    // We can't inline this within an astro component because in order for the
    // component to be able to pass props on to the raw html element via the
    // `asChild` prop it needs to happen within the context of React rendering.
    <CardTitle asChild {...props}>
      <h3>{children}</h3>
    </CardTitle>
  );
}
