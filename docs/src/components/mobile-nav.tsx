import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@shadcn/sheet";
import { useState, type ReactNode } from "react";
import { Navbar, type NavbarCategory } from "./navbar";

export function MobileNav({
  pathname,
  entries,
}: {
  readonly pathname: string;
  readonly entries: ReadonlyArray<NavbarCategory>;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent className="pt-12">
        <Navbar
          pathname={pathname}
          entries={entries}
          onSelect={() => {
            setIsOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
