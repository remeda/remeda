import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, type ReactNode } from "react";
import { Navbar, type NavbarCategory } from "./navbar";
import { VersionSelector } from "./version-selector";

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
          entries={entries}
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          <VersionSelector pathname={pathname} />
        </Navbar>
      </SheetContent>
    </Sheet>
  );
}
