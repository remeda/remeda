import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { isEmpty } from "remeda";
import { Navbar, type NavbarCategory } from "./navbar";

export function MobileNav({
  entries,
  title,
}: {
  readonly entries: ReadonlyArray<NavbarCategory>;
  readonly title: string | undefined;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  if (isEmpty(entries)) {
    return;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <Navbar
          entries={entries}
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          {title !== undefined && (
            <h2 className="text-lg font-bold capitalize">{title}</h2>
          )}
        </Navbar>
      </SheetContent>
    </Sheet>
  );
}
