import { Card } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function ArticleCard({
  children,
  ...props
}: ComponentProps<typeof Card>): ReactNode {
  return (
    // We can't inline this within an astro component because in order for the
    // component to be able to pass props on to the raw html element via the
    // `asChild` prop it needs to happen within the context of a React island.
    <Card asChild {...props}>
      <article>{children}</article>
    </Card>
  );
}
