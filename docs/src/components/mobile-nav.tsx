import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export const MobileNav = (props: {
  entries: Record<string, Array<{ name: string; tags: Array<string> }>>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <div className="h-[calc(100vh-1.5rem)] pb-10 pt-6">
          <Navbar entries={props.entries} onSelect={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
