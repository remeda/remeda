import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent className="pt-12">
        <Navbar
          onSelect={() => {
            setOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
