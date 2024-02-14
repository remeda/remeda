import { Navbar, type NavbarCategory } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, type ReactNode } from "react";

export function MobileNav({
  entries,
}: {
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
        />
      </SheetContent>
    </Sheet>
  );
}
