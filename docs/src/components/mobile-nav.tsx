import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, type ReactNode } from "react";
import { Navbar, type NavbarCategory } from "./navbar";
import { VersionSelector } from "./version-selector";
import { isEmpty } from "remeda";

export function MobileNav({
  pathname,
  entries,
  showVersionSelector = false,
}: {
  readonly pathname: string;
  readonly entries: ReadonlyArray<NavbarCategory>;
  readonly showVersionSelector?: boolean;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  if (isEmpty(entries)) {
    return;
  }

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
          {showVersionSelector && <VersionSelector pathname={pathname} />}
        </Navbar>
      </SheetContent>
    </Sheet>
  );
}
