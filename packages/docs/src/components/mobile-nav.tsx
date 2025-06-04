import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          <span className="sr-only">Library navigation menu</span>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <SheetTitle
          className={
            title === undefined ? "sr-only" : "text-lg font-bold capitalize"
          }
        >
          {title ?? "Library Entries"}
        </SheetTitle>
        <SheetDescription className="sr-only">
          List of all available functions provided by the library.
        </SheetDescription>
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
