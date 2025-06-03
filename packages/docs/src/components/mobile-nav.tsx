import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MenuIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Navbar, type NavbarCategory } from "./navbar";

export function MobileNav({
  entries,
  title,
}: {
  readonly entries: ReadonlyArray<NavbarCategory>;
  readonly title: string | undefined;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <VisuallyHidden>Library navigation menu</VisuallyHidden>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <VisuallyHidden asChild>
          <SheetTitle>Library Entries</SheetTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <SheetDescription>
            List of all available functions provided by the library.
          </SheetDescription>
        </VisuallyHidden>
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
