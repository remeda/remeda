import { Card } from "@/components/ui/card";
import type { ComponentProps, ReactNode } from "react";

export function ArticleCard({
  children,
  ...props
}: ComponentProps<typeof Card>): ReactNode {
  return (
    <Card asChild {...props}>
      <article>{children}</article>
    </Card>
  );
}
